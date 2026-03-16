import type { InternalModuleFormat, OutputOptions, Plugin, RollupOptions } from 'rollup'
import nodeResolve from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import cleanup from 'rollup-plugin-cleanup'
import terser from '@rollup/plugin-terser'
import typescript from '@rollup/plugin-typescript'
import injectCode from 'rollup-plugin-inject-code'
import filesize from 'rollup-plugin-filesize'
import { visualizer } from 'rollup-plugin-visualizer'
import { banner, extensions, reporter } from './config'

export interface Config {
	browser?: boolean
	env: 'development' | 'production'
	file: string
	format: InternalModuleFormat
	input: string
	minify?: boolean
	plugins?: Plugin[]
	transpile?: boolean
}

export interface Output extends OutputOptions {
	plugins: Plugin[]
}

export interface Options extends RollupOptions {
	external: string[]
	output: Output
	plugins: Plugin[]
}

const IS_ES5 = process.env.BABEL_ENV === 'es5'
const IS_WATCH = process.env.ROLLUP_WATCH

const configs: Config[] = IS_WATCH ? [
	{
		browser: true,
		env: 'development',
		file: 'dist/index.mjs',
		format: 'es',
		input: 'src/index.ts',
	},
	{
		env: 'development',
		file: 'dist/index.cjs',
		format: 'cjs',
		input: 'src/index.ts',
	},
] : IS_ES5 ? [
	// ES5 构建
	{
		env: 'development',
		file: 'dist/index.es5.js',
		format: 'umd',
		input: 'src/index.ts',
	},
	{
		env: 'production',
		file: 'dist/index.es5.min.js',
		format: 'umd',
		input: 'src/index.ts',
		minify: true,
	},
] : [
	// 正常构建
	{
		env: 'development',
		file: 'dist/index.mjs',
		format: 'es',
		input: 'src/index.ts',
	},
	{
		env: 'development',
		file: 'dist/index.iife.js',
		format: 'iife',
		input: 'src/index.ts',
	},
	{
		env: 'production',
		file: 'dist/index.iife.min.js',
		format: 'iife',
		input: 'src/index.ts',
		minify: true,
	},
	{
		env: 'development',
		file: 'dist/index.cjs',
		format: 'cjs',
		input: 'src/index.ts',
	},
]

function createEntries(): Options[] {
	return configs.map(createEntry)
}

function createEntry(config: Config): Options {
	const isGlobalBuild = config.format === 'iife' || config.format === 'umd'
	const isTypeScript = config.input.endsWith('.ts')
	const isTranspiled =
		config.input.endsWith('bundler.js') ||
		config.input.endsWith('browser.js') ||
		config.input.endsWith('prod.js')

	const _config: Options = {
		external: ['vue', 'vue2', 'vue-demi'],
		input: config.input,
		onwarn: (msg: any, warn) => {
			// 过滤掉 TypeScript 插件的临时文件警告
			if (/Circular/.test(msg) || /rollup\.config.*\.mjs/.test(msg.message || '')) {
				return
			}
			warn(msg)
		},
		output: {
			exports: 'auto',
			extend: true,
			file: config.file,
			format: config.format,
			globals: {
				vue: 'VueDemi',
				vue2: 'VueDemi',
				'vue-demi': 'VueDemi',
			},
			plugins: [],
		},
		plugins: [],
	}

	if (isGlobalBuild || config.browser) _config.output.banner = banner

	if (isGlobalBuild) {
		_config.output.name = _config.output.name || 'VueMount'
		_config.output.plugins.push(
			injectCode({
				path: 'vue-demi/lib/index.iife.js',
			}),
		)
	}

	if (!isGlobalBuild) {
		_config.external.push('js-cool', 'tslib')
	}

	_config.plugins.push(nodeResolve(), commonjs())

	if (config.transpile !== false) {
		if (!isTranspiled) {
			_config.plugins.push(
				babel({
					babelHelpers: 'bundled',
					exclude: [/node_modules[\\/]core-js/],
					extensions,
				}),
			)
		}
		if (isTypeScript) {
			_config.plugins.push(
				typescript({
					compilerOptions: {
						declaration: false,
						outDir: 'dist',
						target: IS_ES5 ? 'ES5' : 'ESNext',
					},
					tsconfig: './tsconfig.json',
				}),
			)
		}
	}

	if (config.minify) {
		_config.plugins.push(terser({ module: config.format === 'es' }))
		_config.output.plugins.push(terser())
	}

	_config.plugins.push(
		cleanup({
			comments: 'all',
		}),
		filesize({ reporter }),
		visualizer(),
	)

	return _config
}

export default createEntries()
