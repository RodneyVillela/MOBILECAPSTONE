const express = require('express');
const cors = require('cors');
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const tf = require('@tensorflow/tfjs');

let model;

const labels = [
  'Healthy',
  'Black_Gill',
  'White_Spot_Syndrome_Virus',
];

function buildLocalTfjsModelIOHandler({ modelDir }) {
  // Custom IO handler that mimics the browser fetch-based loader using Node filesystem.
  // This avoids tfjs' file:// loader (which relies on fetch/file IO that may be unavailable).
  return {
    async load() {
      const modelJsonPath = path.join(modelDir, 'model.json');
      const rawModelJson = fs.readFileSync(modelJsonPath, 'utf8');
      const modelJson = JSON.parse(rawModelJson);

      const weightsManifest = modelJson.weightsManifest || [];
      const weightPaths = [];
      for (const entry of weightsManifest) {
        const paths = entry.paths || [];
        const weights = entry.weights || [];
        for (const p of paths) {
          for (const w of weights) {
            // e.g. p=weights.bin and w.name is a tensor name; tfjs expects raw weights buffer.
            // We'll load the corresponding binary file once per unique path.
            weightPaths.push(p);
          }
          // In typical tfjs format, there's a single binary file per manifest path.
          // We'll load each unique path once below.
          break;
        }
      }

      const uniqueWeightPaths = Array.from(new Set(weightPaths));

      // Load all referenced weight binary files; in practice this model has weights.bin only.
      // Combine into a single ArrayBuffer by concatenation.
      // Note: if multiple weight.bin files exist, this simple concatenation may not match specs.
      // For current project layout (single weights.bin), this is sufficient.
      const buffers = uniqueWeightPaths.map((p) => {
        const pth = path.join(modelDir, p);
        return fs.readFileSync(pth);
      });

      const totalLen = buffers.reduce((sum, b) => sum + b.byteLength, 0);
      const merged = new Uint8Array(totalLen);
      let offset = 0;
      for (const b of buffers) {
        merged.set(new Uint8Array(b.buffer, b.byteOffset, b.byteLength), offset);
        offset += b.byteLength;
      }

      // Build weightSpecs from weightsManifest.
      // tfjs uses these specs to map raw weights buffer slices to tensors.
      const weightSpecs = [];
      for (const entry of weightsManifest) {
        const weights = entry.weights || [];
        for (const w of weights) weightSpecs.push(w);
      }

      return {
        modelTopology: modelJson.modelTopology,
        weightSpecs,
        weightData: merged.buffer,
      };
    },

    // Required by tfjs loaders.
    async save() {
      throw new Error('Saving is not supported by this IO handler');
    },

    // Some tfjs versions call this.
    getLoadHandlers() {
      return null;
    },
  };
}

async function loadModel() {
  // modelDir resolved relative to this file, not the current working directory.
  const modelDir = path.join(__dirname, 'model');

  const modelJsonPath = path.join(modelDir, 'model.json');
  const weightsPath = path.join(modelDir, 'weights.bin');

  const rawModelJson = fs.readFileSync(modelJsonPath, 'utf8');
  const modelJson = JSON.parse(rawModelJson);

  const weightSpecs = [];
  for (const entry of (modelJson.weightsManifest || [])) {
    for (const w of (entry.weights || [])) weightSpecs.push(w);
  }

  const weightsBuffer = fs.readFileSync(weightsPath);

  // Important: use a minimal local IOHandler to prevent tfjs from attempting any fetch.
  const ioHandler = {
    async load() {
      return {
        modelTopology: modelJson.modelTopology,
        weightSpecs,
        weightData: weightsBuffer.buffer,
      };
    },
  };

  // Dispose/clear any previous model instance.
  model = await tf.loadLayersModel(ioHandler);
  return model;
}






const app = express();
app.use(cors());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

app.post('/api/detect', upload.single('image'), async (req, res) => {
  try {
    if (!req.file?.buffer) {
      return res.status(400).json({ error: 'Image is required (field name: image).' });
    }

    if (!model) {
      await loadModel();
    }

    // Fully decode + resize using sharp (tfjs pure JS cannot use tf.node.decodeImage())
    // Output a raw RGB pixel buffer (224 x 224 x 3)
    const resized = await sharp(req.file.buffer)
      .resize(224, 224)
      .removeAlpha()
      .raw()
      .toBuffer();

    const imgTensor = tf.tensor3d(new Uint8Array(resized), [224, 224, 3], 'int32');
    const normalized = imgTensor.toFloat().div(tf.scalar(255));
    const batched = normalized.expandDims(0);


    const predictions = model.predict(batched);
    const data = await predictions.data();

    // Dispose tensors we created
    imgTensor.dispose();
    normalized.dispose();
    batched.dispose();

    const arr = Array.from(data);

    let bestIdx = 0;
    for (let i = 1; i < arr.length; i++) {
      if (arr[i] > arr[bestIdx]) bestIdx = i;
    }

    const confidence = arr[bestIdx] ?? 0;
    const label = labels[bestIdx] ?? 'Healthy';

    normalized.dispose();
    batched.dispose();
    predictions.dispose();


    res.json({ label, confidence });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Detection failed', details: err instanceof Error ? err.message : String(err) });
  }
});

const PORT = process.env.PORT || 3000;

loadModel()
  .then(() => {
    console.log('Model loaded.');
  })
  .catch((e) => {
    console.warn('Model not loaded yet (expected until model is added).', e?.message || e);
  })
  .finally(() => {
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
  });

