import { createApp } from '../pharmacy-pos-backend/dist/app.js';

let appInstance = null;

export default function handler(req, res) {
  try {
    if (!appInstance) {
      appInstance = createApp();
    }
    return appInstance(req, res);
  } catch (error) {
    console.error('❌ Serverless invocation error:', error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: 'Serverless function execution error',
        error: error?.message || String(error),
      });
    }
  }
}
