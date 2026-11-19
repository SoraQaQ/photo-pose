import { defineConfig } from 'vite';
import { resolve } from 'node:path';

// 将拍摄页和素材准备页都纳入发布产物。
export default defineConfig({
  build: { rollupOptions: { input: { main: resolve('index.html'), material: resolve('material.html') } } }
});
