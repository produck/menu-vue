import Vue from 'vue';
import App from './App.vue';
import MenuPlugin from '../lib/index';
import { MenuItem, popup } from '@produck/menu';

Vue.config.productionTip = false;
Vue.use(MenuPlugin);

new Vue({
	render: function (h) {
		return h(App);
	},
}).$mount('#app');

window.addEventListener('contextmenu', event => {
	popup([
		[
			{
				type: MenuItem.Clickable,
				click() {
					console.log('hello, world');
				}
			}
		]
	], {

	});
});
