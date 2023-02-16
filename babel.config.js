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
					browsers: ['> 0.1%', 'last 2 versions', 'not ie < 11']
				},
				corejs: 3
			}
		],
		'@babel/typescript'
	],
	plugins: []
}
