const common = require('./webpack.common');
const {merge} = require('webpack-merge');
const {DefinePlugin} = require('webpack');

module.exports = merge(common, {
	mode: 'development',
	optimization: {
		minimize: false
	},
	performance: {
		hints: 'warning'
	},
    devtool: 'inline-source-map',
	plugins: [
		new DefinePlugin({production:false})
	]
});