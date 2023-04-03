import { sep } from 'node:path'
import type { RollupOptions } from 'rollup'
import nodeResolve from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser'
import cleanup from 'rollup-plugin-cleanup'
import typescript from '@rollup/plugin-typescript'
import alias, { type ResolverObject } from '@rollup/plugin-alias'
import filesize from 'rollup-plugin-filesize'
import { visualizer } from 'rollup-plugin-visualizer'
import pkg from '../package.json' assert { type: 'json' }
import { banner, extensions, reporter } from './config'

const externals = [...Object.keys(pkg.dependencies || {})]
const nodeResolver = nodeResolve({
	// Use the `package.json` "browser" field
	browser: false,
	extensions,
	preferBuiltins: true,
	exportConditions: ['node'],
	moduleDirectories: ['node_modules']
})
const iifeGlobals = {
	vue: 'Vue',
	'vue-demi': 'VueDemi'
}

const options: RollupOptions = {
	plugins: [
		alias({
			customResolver: nodeResolver as ResolverObject,
			entries: [
				// {
				//     find: /^#lib(.+)$/,
				//     replacement: resolve(__dirname, '..', 'src', '$1.mjs')
				// }
			]
		}),
		nodeResolver,
		commonjs({
			sourceMap: false,
			exclude: ['core-js']
		}),
		babel({
			babelHelpers: 'bundled',
			extensions,
			exclude: ['node_modules']
		}),
		typescript({
			compilerOptions: {
				outDir: undefined,
				declaration: false,
				declarationDir: undefined,
				target: 'es5'
			}
		}),
		filesize({ reporter }),
		visualizer()
	]
}

function externalCjsEsm(id: string) {
	return ['vue', 'vue2', 'vue-demi', 'core-js', '@babel/runtime']
		.concat(externals)
		.some(k => new RegExp('^' + k).test(id))
}

function externalUmd(id: string) {
	return ['vue', 'vue2', 'vue-demi'].some(k => id === k || new RegExp('^' + k + sep).test(id))
}

const distDir = (path: string) =>
	process.env.BABEL_ENV === 'es5' ? path.replace('index', 'es5/index') : path

export default [
	{
		input: 'src/index.ts',
		output: [
			{
				file: distDir(pkg.main),
				exports: 'auto',
				format: 'cjs'
			},
			{
				file: distDir(pkg.module),
				exports: 'auto',
				format: 'es'
			}
		],
		external: externalCjsEsm,
		...options
	},
	{
		input: distDir('dist/index.mjs'),
		output: [
			{
				file: distDir('dist/index.iife.js'),
				format: 'iife',
				name: 'VueMount',
				extend: true,
				globals: iifeGlobals,
				banner
			},
			{
				file: distDir(pkg.unpkg),
				format: 'iife',
				name: 'VueMount',
				extend: true,
				globals: iifeGlobals,
				banner,
				plugins: [terser()]
			}
		],
		external: externalUmd,
		plugins: [
			nodeResolver,
			commonjs({
				sourceMap: false,
				exclude: ['core-js']
			}),
			cleanup({
				comments: 'all'
			}),
			filesize({ reporter }),
			visualizer()
		]
	}
]
