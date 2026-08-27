import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const backendDir = path.resolve(__dirname, '..');

const entryContent = `import express from 'express';
import { createApp } from './dist/app.js';

const app = createApp();

export default app;
`;

const nestedEntryContent = `import express from 'express';
import { createApp } from '../../dist/app.js';

const app = createApp();

export default app;
`;

// 1. Root of backend
fs.writeFileSync(path.join(backendDir, 'app.js'), entryContent);
fs.writeFileSync(path.join(backendDir, 'index.js'), entryContent);
fs.writeFileSync(path.join(backendDir, 'server.js'), entryContent);

// 2. dist of backend
const distDir = path.join(backendDir, 'dist');
if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });
fs.writeFileSync(path.join(distDir, 'app.js'), entryContent);
fs.writeFileSync(path.join(distDir, 'index.js'), entryContent);

// 3. nested pharmacy-pos-frontend/dist inside backend
const nestedDir = path.join(backendDir, 'pharmacy-pos-frontend', 'dist');
if (!fs.existsSync(nestedDir)) fs.mkdirSync(nestedDir, { recursive: true });
fs.writeFileSync(path.join(nestedDir, 'app.js'), nestedEntryContent);
fs.writeFileSync(path.join(nestedDir, 'index.js'), nestedEntryContent);
fs.writeFileSync(path.join(nestedDir, 'server.js'), nestedEntryContent);

console.log('✅ Entrypoints with explicit express imports generated.');
