module.exports = {
	presets: [
		[
			'@babel/env',
			{
				loose: true,
				modules: 'auto',
				useBuiltIns: 'usage',
				targets: {
					// node: '16',
					browsers: ['> 1%', 'not ie 11', 'not op_mini all']
				},
				corejs: 3
			}
		],
		'@babel/typescript'
	],
	plugins: []
}
