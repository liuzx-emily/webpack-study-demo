const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 使用 vue-loader 时，必须引入这个插件！它负责将你定义过的其它规则复制并应用到 .vue 文件里相应语言的块。例如，如果你有一条匹配 /\.js$/ 的规则，那么它会应用到 .vue 文件里的 <script> 块。
const VueLoaderPlugin = require('vue-loader/lib/plugin');



// 把 css 提取出来，放到独立的css文件中。默认，每个包含css的 bundle.js 提取出一个 css文件。
// 只在 prod 环境下使用，而且不能和 style-loader 一起用。
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const devMode = process.env.NODE_ENV !== 'production'

// 
module.exports = {
	// 多入口，这里的 key 就是配置多页面时 HtmlWebpackPlugin 中的 chunks
	entry: {
		main: "./src/main.js",
		login: "./src/login.js",
	},
	output: {
		/* 
		[hash]：
		  跟整个项目的构建相关。只要项目里有文件更改，这个[hash]值就会更改，并且全部文件都共用相同的hash值。
		  如果项目中所有文件都不变，那么[hash]值也不会变。
		
		[chunkhash] 基于每个 chunk 内容的 hash
		  
		[contenthash] hashes generated for extracted content
		 */
		filename: '[name].[hash].js',
		// 此选项决定了非入口(non-entry) chunk 文件的名称。
		// 这里的 [name] 对应的是 optimization.splitChunks.name
		chunkFilename: '[name].js',
		path: path.resolve(__dirname, 'dist')
	},
	module: {
		rules: [{
				test: /\.css$/,
				use: [
					// css 的 HMR 是 style-loader 提供的。
					// MiniCssExtractPlugin 现在还不支持 HMR ，所以开发环境还是得用 style-loader
					devMode ? 'style-loader' : {
						loader: MiniCssExtractPlugin.loader,
						// you can specify a publicPath here . by default it use publicPath in webpackOptions.output
						// publicPath: '../'
					},
					"css-loader"
				]
				// use: ["style-loader", {
				// 	loader: "css-loader",
				// 	options: {
				// 		// 用于配置「css-loader 作用于 @import 的资源之前」有多少个 loader。默认为0 
				// 		importLoaders: 1
				// 	}
				// }, "postcss-loader"]
			},
			{
				test: /\.less$/,
				use: [
					devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
					{
						loader: "css-loader",
						options: {
							// 用于配置「css-loader 作用于 @import 的资源之前」有多少个 loader。默认为0 
							importLoaders: 2
						}
					}, "postcss-loader", "less-loader"
				]
			},
			{ test: /\.vue$/, use: ["vue-loader"] },
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
	],

};