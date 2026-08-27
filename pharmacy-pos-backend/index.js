import express from 'express';

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
