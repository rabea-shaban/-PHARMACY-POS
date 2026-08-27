import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createApp } from '../src/app.js';

let appInstance: any = null;

export default function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (!appInstance) {
      appInstance = createApp();
    }
    return appInstance(req, res);
  } catch (error: any) {
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
