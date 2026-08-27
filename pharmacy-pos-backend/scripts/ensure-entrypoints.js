import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const backendDir = path.resolve(__dirname, '..');

const entryContent = `import express from 'express';

const app = express();
let cachedApp = null;

app.use(async (req, res, next) => {
  try {
    if (!cachedApp) {
      const module = await import('./dist/app.js');
      const createAppFn = module.createApp || module.default?.createApp || module.default;
      if (typeof createAppFn !== 'function') {
        throw new Error('createApp function not found in dist/app.js. Exported keys: ' + Object.keys(module).join(', '));
      }
      cachedApp = createAppFn();
    }
    return cachedApp(req, res, next);
  } catch (err) {
    console.error('❌ Serverless invocation error:', err);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: 'Serverless initialization error',
        error: err?.message || String(err),
        stack: err?.stack,
      });
    }
  }
});

export default app;
`;

const nestedEntryContent = `import express from 'express';

const app = express();
let cachedApp = null;

app.use(async (req, res, next) => {
  try {
    if (!cachedApp) {
      const module = await import('../../dist/app.js');
      const createAppFn = module.createApp || module.default?.createApp || module.default;
      if (typeof createAppFn !== 'function') {
        throw new Error('createApp function not found in ../../dist/app.js. Exported keys: ' + Object.keys(module).join(', '));
      }
      cachedApp = createAppFn();
    }
    return cachedApp(req, res, next);
  } catch (err) {
    console.error('❌ Serverless invocation error:', err);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: 'Serverless initialization error',
        error: err?.message || String(err),
        stack: err?.stack,
      });
    }
  }
});

export default app;
`;

// 1. Root of backend
fs.writeFileSync(path.join(backendDir, 'app.js'), entryContent);
fs.writeFileSync(path.join(backendDir, 'index.js'), entryContent);
fs.writeFileSync(path.join(backendDir, 'server.js'), entryContent);

// 2. nested pharmacy-pos-frontend/dist inside backend (NEVER overwrite dist/app.js which contains the compiled tsc app!)
const nestedDir = path.join(backendDir, 'pharmacy-pos-frontend', 'dist');
if (!fs.existsSync(nestedDir)) fs.mkdirSync(nestedDir, { recursive: true });
fs.writeFileSync(path.join(nestedDir, 'app.js'), nestedEntryContent);
fs.writeFileSync(path.join(nestedDir, 'index.js'), nestedEntryContent);
fs.writeFileSync(path.join(nestedDir, 'server.js'), nestedEntryContent);

console.log('✅ Entrypoints successfully generated without modifying compiled dist/app.js');
