import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// import { resolve } from 'path'

export default defineConfig({
	plugins: [vue()],
	// resolve: {
	// 	alias: {
	// 		// 直接使用源码，让 vite 编译 TypeScript
	// 		'vue-mount-plugin': resolve(__dirname, '../../src/index.ts'),
	// 	},
	// },
})
