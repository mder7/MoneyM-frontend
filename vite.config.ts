import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Обратный прокси сервера фронтенда (решение CORS):
//   /api/...       → веб-сервис NestJS (порт 3000)
//   /dividends/... → бакет dividends в S3 MinIO (порт 9000)
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/dividends': {
        target: 'http://localhost:9000',
        changeOrigin: true,
      },
    },
  },
})
