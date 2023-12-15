// const require = (await import('node:module')).createRequire(import.meta.url);
// const __filename = (await import('node:url')).fileURLToPath(import.meta.url);
const __filename = (await import('node:path')).resolve('.');
const __dirname = (await import('node:path')).dirname(__filename);
import { dirname, join } from 'node:path';

export { __rootDir, __appDir, __wranglerDir };

const __appDir = join(__dirname, '.');
console.log(__appDir);
const __rootDir = join(__appDir, '..');
console.log(__rootDir);
const __wranglerDir = join(__appDir, 'api');
console.log(__wranglerDir);
