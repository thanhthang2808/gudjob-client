import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    exclude: ['pdfjs-dist'], // Exclude pdfjs-dist from dependency optimization
  },
  build: {
    outDir: 'dist', // Thư mục sau khi build
},
})
