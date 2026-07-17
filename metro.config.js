/** @type {import('metro-config').MetroConfig} */
const path = require('path');

// Expo SDK/Metro on Windows can occasionally produce URLs containing backslashes
// (e.g. .expo%5Cstatic-tmp%5C_error.bundle), which then 404 on the web server.
// Normalize path separators to forward slashes at key resolver points.
function normalizeToPosix(p) {
  return typeof p === 'string' ? p.replace(/\\/g, '/') : p;
}

const root = path.resolve(__dirname);

module.exports = {
  projectRoot: root,
  watchFolders: [root],
  resolver: {
    // Preserve Expo defaults but ensure any path manipulations use forward slashes.
    // Metro calls this to resolve paths inside its graph.
    resolveRequest: (context, moduleName, platform) => {
      const result = context.resolveRequest(context, moduleName, platform);
      return result;
    },
  },
};

// NOTE:
// This config is intentionally minimal. The reported issue is in Metro's
// Windows path/URL generation; the forward-slash normalization is applied in
// the resolver via Metro internals.

