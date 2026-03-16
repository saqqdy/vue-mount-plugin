import { config } from '@eslint-sets/eslint-config'

export default config({
	ignores: ['examples/**'],
	markdown: false,
	rules: {
		camelcase: 'off',
		'perfectionist/sort-interfaces': 'off',
		'perfectionist/sort-objects': 'off',
	},
	stylistic: {
		indent: 'tab',
	},
	test: true,
	type: 'lib',
	typescript: true,
})
