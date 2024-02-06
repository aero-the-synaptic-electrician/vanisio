const common = require('./webpack.common');
const {merge} = require('webpack-merge');
const TerserPlugin  = require('terser-webpack-plugin');
const {DefinePlugin} = require('webpack');

module.exports = merge(common, {
	mode: 'production',
	module: {
		rules: [
			{
			  test: /\.js$/,
			  exclude: /node_modules/,
			  use: ['babel-loader']
			}
		]
	},
	optimization: {
		minimize: true,
		minimizer: [
			new TerserPlugin()
		]
	},
	performance: {
		hints: false
	},
	plugins: [
		new DefinePlugin({production:true})
	]
});