const merge = require("webpack-merge");
const common = require("./webpack.common.js");


module.exports = merge(common, {
	mode: 'production',
	// 关闭 source map
	devtool: false,

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
					// chunks: 'initial',
				},
				default: {
					name: "chunk-common",
					// chunks: 'initial',
				}
			}

		}
	}


});