import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Ajusta si usas alias como "@/..."
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    proxy: {
      // Proxy a tu backend Node (puedes seguir usando rutas relativas /api)
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
        // si tu backend NO usa prefijo /api, podrías reescribir:
        // rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  resolve: {
    alias: {
      // ejemplo de alias opcional
      // '@': '/src'
    }
  }
});
