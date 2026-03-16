import { spawn } from 'node:child_process'

async function run(): Promise<void> {
	await Promise.all([build(), copy()])
}

async function build(): Promise<void> {
	await spawn(
		'rollup',
		['-c', 'build/rollup.config.ts', '--configPlugin', 'rollup-plugin-esbuild'],
		{ stdio: 'inherit' },
	)
}

async function copy(): Promise<void> {
	// await cp('src/index.mjs', 'dist')
}

run()
