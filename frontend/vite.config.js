import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' // <-- Adicione esta linha

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {           // <-- Adicione esta seção
    alias: {           // <-- Adicione esta seção
      '@': path.resolve(__dirname, './src'), // <-- Mapeia '@/' para a pasta 'src'
    },
  },
})