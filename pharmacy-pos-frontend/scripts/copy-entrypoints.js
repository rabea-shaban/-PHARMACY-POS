import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '../dist');

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

const entryContent = `import { createApp } from '../../pharmacy-pos-backend/dist/app.js';
const app = createApp();
export default app;
`;

fs.writeFileSync(path.join(distDir, 'app.js'), entryContent);
fs.writeFileSync(path.join(distDir, 'index.js'), entryContent);
fs.writeFileSync(path.join(distDir, 'server.js'), entryContent);
console.log('✅ Universal serverless entrypoints generated in pharmacy-pos-frontend/dist');
