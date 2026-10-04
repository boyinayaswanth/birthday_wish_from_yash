import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/birthday_wish_from_yash/' : '/',
  server: {
    port: 3000,
    open: false
  }
});
