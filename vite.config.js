import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },

      '/profile/': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/chat/': {
        target: 'http://localhost:8080', // 정확한 API 서버 주소
        changeOrigin: true, // 헤더에 필요한 변경
        rewrite: (path) => path.replace(/^\/chat/, '/chat'), // /chat/ 경로 유지
      },
    },
  },
})
