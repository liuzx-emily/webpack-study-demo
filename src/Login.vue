<style lang="less">
#app{
  background:url(./images/bg.png)
}
h1 {
	color: red;
}
</style>
<template>
	<section id="app">
		<h1>登录</h1>
    <img src="./images/rabbit.jpg">
	</section>
</template>
<script>
import {hello} from './hello-lazyload.js';
hello();
export default {
	created() {
		console.log(1);
	}
}
</script>