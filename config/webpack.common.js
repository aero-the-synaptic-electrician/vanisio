const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {VueLoaderPlugin} = require('vue-loader');
const paths = require('./paths');

module.exports = {
	entry: ['@babel/polyfill', paths.source + '/main.ts'],
	output: {
		path: paths.output,
		// filename: 'js/[name].[contenthash].js',
		filename: 'js/[name].js',
		publicPath: './',
		clean: true
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js'],
		alias: {
			vue: 'vue/dist/vue.cjs',
            '@': paths.source,
		}
	},
	module: {
		rules: [
			{
				test: /\.vue$/,
				loader: 'vue-loader'
			},
			{
				test: /\.css$/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader'
					}
				]
			},
			{
				test: /\.(png|jpe?g|gif|ico)$/,
				loader: 'file-loader',
				options: {
					name: 'img/[name].[ext]'
				}
			},
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                options: { appendTsSuffixTo: [/\.vue$/] },
                exclude: /node_modules/,
            }
		]
	},
	experiments: {
		asyncWebAssembly: true,
		syncWebAssembly: true
	},
	optimization: {
		splitChunks: {
			cacheGroups: {
				commons: {
					priority: 50,
					chunks: 'all',
					test: /node_modules/,
					name: 'vendor',
					enforce: true
				},
				styles: {
					name: 'app',
					test: /\.css$/, // chunks plugin has to be aware of all kind of files able to output css in order to put them together
					chunks: 'initial',
					minChunks: 1,
					enforce: true
				},
			}
		},
		concatenateModules: false
		// minimize: true
	},
	performance: {
		hints: false
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: paths.source + '/index.html',
			hash: true,
			minify: true
		}),
		new MiniCssExtractPlugin({
			filename: 'css/style.css'
		}),
		new VueLoaderPlugin()
	]
};