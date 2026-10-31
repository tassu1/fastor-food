import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// Dev-only proxy avoids CORS issues with the staging API (/api -> https://staging.fastor.ai)
export default defineConfig({
  plugins: [react()],
  server: { proxy: { '/api': { target: 'https://staging.fastor.ai', changeOrigin: true, rewrite: p => p.replace(/^\/api/, '') } } }
});
