module.exports = {
	presets: [
		[
			'@babel/env',
			{
				loose: true,
				modules: 'auto',
				useBuiltIns: 'usage',
				targets: 'node 14',
				corejs: 3
			}
		],
		'@babel/typescript'
	],
	plugins: []
}
