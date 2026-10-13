import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'

export default defineConfig({
  plugins: [vue()],
  base: './',
  server: { port: 8080 },
  test: { globals: true, include: ['test/unit/specs/**/*.spec.js'] }
})
