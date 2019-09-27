module.exports = {
	plugins: {
		// 必须要加这个。加了这个之后在 .css 中 @import 进来的 .less 文件，会成功！
		// "postcss-import": {}
	}
}