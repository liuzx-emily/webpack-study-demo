const merge = require("webpack-merge");
const common = require("./webpack.common.js");


module.exports = merge(common, {
	mode: 'development',
  // devtool 此选项控制是否生成，以及如何生成 source map。
  // 不同的值会明显影响到构建(build)和重新构建(rebuild)的速度。
	devtool: "inline-source-map",

	devServer: {
		// 将 dist 目录下的文件 serve 到 localhost:8080 下。（译注：serve，将资源作为 server 的可访问文件）
		contentBase: './dist',
	},
});