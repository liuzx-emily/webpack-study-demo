const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 使用 vue-loader 时，必须引入这个插件！它负责将你定义过的其它规则复制并应用到 .vue 文件里相应语言的块。例如，如果你有一条匹配 /\.js$/ 的规则，那么它会应用到 .vue 文件里的 <script> 块。
const VueLoaderPlugin = require('vue-loader/lib/plugin');


const { CleanWebpackPlugin } = require('clean-webpack-plugin');

// 把 css 提取出来，放到独立的css文件中。默认每个包含css的 bundle.js 提取出一个 css文件。
// 只在 prod 环境下使用，而且不能和 style-loader 一起用。
const MiniCssExtractPlugin = require("mini-css-extract-plugin");


// 
module.exports = {
	mode: 'production',
	// 关闭 source map
	devtool: false,
	// 多入口，这里的 key 就是配置多页面时 HtmlWebpackPlugin 中的 chunks
	entry: {
		main: "./src/main.js",
		login: "./src/login.js",
	},
	output: {
		/* 
      [hash]：整个项目
      [chunkhash] : 每个入口（entry）
      [contenthash] : 每个打包后的文件内容
		 */
		// filename: 'js/[name].[hash].[chunkhash].[contenthash].js',
		filename: 'js/[name].[contenthash].js',
		// 此选项决定了非入口(non-entry) chunk 文件的名称。
		// 这里的 [name] 对应的是 optimization.splitChunks.name
		chunkFilename: 'js/[name].js',
		path: path.resolve(__dirname, 'dist')
	},
	module: {
		rules: [{
				test: /\.css$/,
				use: [
					// css 的 HMR 是 style-loader 提供的。
					// MiniCssExtractPlugin 现在还不支持 HMR ，所以开发环境还是得用 style-loader
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							// you can specify a publicPath here . by default it use publicPath in webpackOptions.output							
							/* loader中必须要配置 publicPath，修正MiniCssExtractPlugin中设置的css层级
              如果不配置的话， css文件中引用的字体、图片路径就错了！ */
							publicPath: '../',
						},
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
				use: [{
						loader: MiniCssExtractPlugin.loader,
						options: {
							publicPath: '../',
						},
					},
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
						outputPath: "assets/image/"
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
            /* 
            output：打包后资源文件的目录
            publicPath：别人引入这个资源文件时的路径。
             */
						outputPath: "./assets/fonts",
						name: '[name].[ext]',
					}
				}]
			},
		]
	},
  
	optimization: {
		// 策略优先级：maxInitialRequest/maxAsyncRequests < maxSize < minSize
		splitChunks: {
			// 可选值：initial async all，或者函数。默认为async
			// initial, all模式会将所有来自node_modules的模块分配到一个叫vendors的缓存组；所有重复引用至少两次的代码，会被分配到default的缓存组。
			// initial模式下会分开优化打包异步和非异步模块。而all会把异步和非异步同时进行优化打包。也就是说moduleA在indexA中异步引入，indexB中同步引入，initial下moduleA会出现在两个打包块中，而all只会出现一个。
			chunks: 'async',
			// 分离出来的块大小必须 > minSize。因为太小的没有必要切出来。
			minSize: 30000,
			// 分离出来的块，如果太大了，还要再切。
			maxSize: 0,
			// 被引用次数必须超过 minChunks ，才会被切出来。默认为1
			minChunks: 1,
			// 按需加载时候最大的并行请求数，默认为5
			maxAsyncRequests: 5,
			// 一个入口最大的并行请求数，默认为3
			maxInitialRequests: 3,
			// 命名连接符 默认为~
			automaticNameDelimiter: '~',
			// 拆分出来块的名字，默认为true，代表由块名和hash值自动生成
			// 这里设置的名字对应 output.chunkFilename 中的 [name]
			name: true,
			// cacheGroups : inherit 或者 override splitChunks.* 的所有设置。并且多出来三个设置项：test, priority, reuseExistingChunk
			// 默认的 cacheGroup 中有 vendors 和 default，如果想把它们都禁用，需要设置 splitChunks.cacheGroups.default 为 false
			// 默认的 cacheGroup 的 priority 是负的。自定义的 cacheGroup 的 priority 默认是0 。
			cacheGroups: {
				vendors: {
					name: "chunk-vendors",
					// 覆盖 splitChunks.chunks 设置的 async 
					chunks: 'initial',
				},
				default: {
					name: "chunk-common",
					chunks: 'initial',
				}
			}

		}
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
		new MiniCssExtractPlugin({
			// Options similar to the same options in webpackOptions.output
			// both options are optional
			filename: "css/[name].[contenthash].css",
			chunkFilename: "css/[name].[contenthash].css"
		}),

		// 清理输出文件夹
		new CleanWebpackPlugin(),
	],

};