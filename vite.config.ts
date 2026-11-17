import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // O three.js (~550 kB, ~136 kB gzip) fica num chunk próprio, baixado sob demanda
    // só quando uma cena 3D vai aparecer. Não pesa no carregamento inicial.
    chunkSizeWarningLimit: 600,
  },
})
