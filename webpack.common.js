const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 使用 vue-loader 时，必须引入这个插件！它负责将你定义过的其它规则复制并应用到 .vue 文件里相应语言的块。例如，如果你有一条匹配 /\.js$/ 的规则，那么它会应用到 .vue 文件里的 <script> 块。
const VueLoaderPlugin = require('vue-loader/lib/plugin');
// 清理输出文件夹
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// 
module.exports = {
	// 多入口，这里的 key 就是配置多页面时 HtmlWebpackPlugin 中的 chunks
	entry: {
		main: "./src/main.js",
		login: "./src/login.js",
	},
	output: {
		filename: '[name].[hash].js',
		// 此选项决定了非入口(non-entry) chunk 文件的名称。
		// 这里的 [name] 对应的是 optimization.splitChunks.name
		chunkFilename: '[name].js',
		path: path.resolve(__dirname, 'dist')
	},
	module: {
		rules: [
			{ test: /\.vue$/, use: ["vue-loader"] },
			{
				test: /\.css$/,
				use: ["style-loader", "css-loader"]
				// use: ["style-loader", {
				// 	loader: "css-loader",
				// 	options: {
				// 		// 用于配置「css-loader 作用于 @import 的资源之前」有多少个 loader。默认为0 
				// 		importLoaders: 1
				// 	}
				// }, "postcss-loader"]
			},
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env']
					}
				}
			},
			{
				test: /\.less$/,
				use: ["style-loader", {
					loader: "css-loader",
					options: {
						// 用于配置「css-loader 作用于 @import 的资源之前」有多少个 loader。默认为0 
						importLoaders: 2
					}
				}, "postcss-loader", "less-loader"]
			},
			// 图片资源 url-loader：文件尺寸大于 limit 时，默认使用 file-loader，并且会把参数传过去。
			// 所以要安装 file-loader！
			{
				test: /\.(png|svg|jpg|gif)$/,
				use: [{
					loader: "url-loader",
					options: {
						limit: 37000,
						// outputPath 是 file-loader 中用到的参数
						outputPath: "zx-image/"
					}
				}]
			},
			// 字体
			{
				test: /\.(eot|otf|woff|woff2|ttf)$/,
				use: [{
					loader: "url-loader",
					options: {
						limit: 37000,
						// outputPath 是 file-loader 中用到的参数
						outputPath: "zx-font/"
					}
				}]
			},
		]
	},
	plugins: [
		// 使用 vue-loader 时，必须引入这个插件！它负责将你定义过的其它规则复制并应用到 .vue 文件里相应语言的块。例如，如果你有一条匹配 /\.js$/ 的规则，那么它会应用到 .vue 文件里的 <script> 块。
		new VueLoaderPlugin(),
		new HtmlWebpackPlugin({
			template: "./src/template/index.html",
			filename: "index.html",
			chunks: [
				'chunk-vendors',
				'chunk-common',
				'main',
			],
		}),
		new HtmlWebpackPlugin({
			title: "登录",
			template: "./src/template/index.html",
			filename: "login.html",
			chunks: [
				'chunk-vendors',
				'chunk-common',
				'login',
			]
		}),
		// 清理输出文件夹
		new CleanWebpackPlugin(),
	],

};