import { defineConfig } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'

export default defineConfig({
	plugins: [createVuePlugin()],
	// resolve: {
	// 	alias: {
	// 		'vue-demi': 'vue-demi/lib/v2.7',
	// 	},
	// },
})
