import Vue from 'vue';

import '@fortawesome/fontawesome-free/css/all.css'

// import './styles/main.less'
import './styles/main.css'

import App from './App.vue'

// $mount 和 el 没什么区别
new Vue({
	el: "#app",
	render: createElement => createElement(App),
});
