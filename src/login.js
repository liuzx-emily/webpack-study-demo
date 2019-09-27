import Vue from 'vue';

import Login from './Login.vue'

// $mount 和 el 没什么区别
new Vue({
	render: createElement => createElement(Login),
}).$mount("#app");