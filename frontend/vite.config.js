import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      // Prebuilt browser runtimes keep the production build free of
      // process.env feature-flag transforms (and their extra tooling).
      vue: 'vue/dist/vue.runtime.esm-browser.prod.js',
      'vue-router': 'vue-router/dist/vue-router.esm-browser.prod.js',
    },
  },
  server: {
    host: '127.0.0.1',
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: false,
      },
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    // The production bundle stays readable (no esbuild child process needed).
    target: 'esnext',
    minify: false,
    cssMinify: false,
  },
})
