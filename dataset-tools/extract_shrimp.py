import pandas as pd
from pathlib import Path
from PIL import Image
import io

parquet_path = "train-00000-of-00001.parquet"

df = pd.read_parquet(parquet_path)

shrimp_df = df[df['label_name'].str.startswith("Shrimp")]

out_dir = Path("shrimp-dataset")
out_dir.mkdir(exist_ok=True)

for i, row in shrimp_df.iterrows():
    class_name = row['label_name'].replace("Shrimp_", "")
    class_dir = out_dir / class_name
    class_dir.mkdir(parents=True, exist_ok=True)

    img_data = row['image']
    img_bytes = img_data['bytes'] if isinstance(img_data, dict) else img_data
    img = Image.open(io.BytesIO(img_bytes))
    img.save(class_dir / f"{i}.jpg")

print(f"Done. Extracted {len(shrimp_df)} shrimp images to: {out_dir.resolve()}")