import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		coverage: {
			exclude: ['src/types.ts'],
			include: ['src/**/*.ts'],
			provider: 'v8',
			reporter: ['text', 'json', 'html'],
		},
		environment: 'node',
		globals: true,
		include: ['test/**/*.test.ts'],
	},
})
