<template>
	<section id="app">
		<header>
			<h1>小学入学自我介绍</h1>
			<p> 我叫小红，是一个自信，开朗，友好，积极向上的小女孩。 </p>
			<p>希望在今后六年的学习生活中，能和亲爱的老师，同学们成为最好的朋友！我们大家一起快乐地学习，快乐地成长!</p>
			<p>谢谢大家！</p>
			<i class="fas fa-camera"></i>
			<span @click="test_lazyLoad">测试懒加载！</span>
		</header>
		<ul class="article-list">
			<li v-for="item in list" :key="item.id">
				<span class="article-title" :title="item.title">{{item.title}}</span>
				<span class="article-time">{{formattingDate(item.time)}}</span>
			</li>
		</ul>
	</section>
</template>
<script>
export default {
	data() {
		return {
			list: [
				{ id: "1", title: "文章1文章1文章1文章1文章1文章1文章1文章1文章1文章1文章1文章1文章1文章1文章1文章1", time: 1558828800000 },
				{ id: "2", title: "文章2", time: 1560297600000 },
			]
		};
	},
	created() {
		// throw new Error("强行出错~");
		console.log(" /src 下的源代码都可以访问到 process.env.NODE_ENV： ", process.env.NODE_ENV);
	},
	methods: {
		test_lazyLoad() {
			import(/* webpackChunkName: "hello" */ './hello-lazyload.js').then(module => {
        console.log(module);
				var hello = module.hello;
				hello();
			});
		},
		formattingDate(timestamp, pattern) {
			if (!timestamp) {
				return "";
			}
			var oDate = new Date(+timestamp);
			if (pattern === undefined || pattern == 1) {
				pattern = "yyyy-MM-dd";
			} else if (pattern == 2) {
				pattern = "yyyy-MM-dd hh:mm:ss";
			}
			pattern = pattern.replace(/yyyy/i, oDate.getFullYear());
			pattern = pattern.replace(/yy/gi, (oDate.getYear() % 100) > 9 ? (oDate.getYear() % 100).toString() : '0' + (oDate.getYear() % 100));
			var month = oDate.getMonth() + 1;
			pattern = pattern.replace(/MM/, month > 9 ? month.toString() : '0' + month);
			pattern = pattern.replace(/M/g, month);
			pattern = pattern.replace(/w|W/g, '日一二三四五六'[oDate.getDay()]);
			var date = oDate.getDate();
			pattern = pattern.replace(/dd/i, date > 9 ? date.toString() : '0' + date);
			pattern = pattern.replace(/d/gi, date);
			var hour = oDate.getHours();
			pattern = pattern.replace(/hh/i, hour > 9 ? hour.toString() : '0' + hour);
			pattern = pattern.replace(/h/ig, hour);
			var minute = oDate.getMinutes();
			pattern = pattern.replace(/mm/, minute > 9 ? minute.toString() : '0' + minute);
			pattern = pattern.replace(/m/g, minute);
			var second = oDate.getSeconds();
			pattern = pattern.replace(/ss/i, second > 9 ? second.toString() : '0' + second);
			pattern = pattern.replace(/s/ig, second);
			return pattern;
		},
	}
}
</script>