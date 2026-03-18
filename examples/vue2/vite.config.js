import { defineConfig } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'
import { resolve } from 'path'

export default defineConfig({
  plugins: [createVuePlugin()],
  resolve: {
    alias: {
      'vue-mount-plugin': resolve(__dirname, '../../dist/index.mjs'),
      // 确保 vue-demi 使用 Vue 2 版本 (使用 mjs 版本以兼容 Vite ESM)
      'vue-demi': resolve(__dirname, 'node_modules/vue-demi/lib/v2.7/index.mjs'),
    },
  },
})
