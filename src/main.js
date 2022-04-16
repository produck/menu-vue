import '@produck/menu/src/style.scss';

import Vue from 'vue';
import App from './App.vue';
import MenuPlugin from '../lib/index';
import { MenuItem } from '@produck/menu';

Vue.config.productionTip = false;
Vue.use(MenuPlugin);

new Vue({
	render: function (h) {
		return h(App);
	},
}).$mount('#app');

window.addEventListener('contextmenu', event => {
	event.preventDefault();

	Vue.$pMenu.Simple.popup([
		[
			{
				type: MenuItem.Clickable,
				click() {
					console.log('hello, world');
				}
			}
		]
	]);
});

window.addEventListener('keydown', event => {
	if (event.altKey) {
		event.preventDefault();
	}
});