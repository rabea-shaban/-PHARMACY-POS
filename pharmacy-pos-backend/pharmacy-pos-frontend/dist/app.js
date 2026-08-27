import express from 'express';

const app = express();
let cachedApp = null;

app.use(async (req, res, next) => {
  try {
    if (!cachedApp) {
      const { createApp } = await import('../../dist/app.js');
      cachedApp = createApp();
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
