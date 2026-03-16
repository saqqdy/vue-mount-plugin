const isES5 = process.env.BABEL_ENV === 'es5'

const presets = [
	[
		'@babel/env',
		{
			corejs: isES5 ? 3 : false,
			exclude: ['transform-regenerator'],
			targets: isES5 ? { browsers: ['ie >= 11'] } : { browsers: ['> 1%', 'last 2 versions', 'not ie < 11', 'not ie_mob < 11', 'not op_mini all'] },
			useBuiltIns: isES5 ? 'usage' : false,
		},
	],
	'@babel/typescript',
]

module.exports = { presets }
