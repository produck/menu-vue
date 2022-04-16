import * as Menu from '@produck/menu';
import * as Simple from './simple';

const MenuVue = Object.freeze({
	popup: Menu.popup,
	closeAll: Menu.closeAllMenu,
	Bar: Object.freeze({
		mount: Menu.Bar.mount,
		set: Menu.Bar.setMenuBar
	}),
	Simple: {
		popup: Simple.popup,
		setMenuBar: Simple.setMenuBar
	}
});

/**
 * @param {Event} event
 */
const STOP_AND_PREVENT = event => {
	event.preventDefault();
	event.stopPropagation();
};

function ModifierOptions({ blocking, mnemonic }) {
	return {
		blocking: Boolean(blocking),
		mnemonic: Boolean(mnemonic)
	};
}

export default {
	/**
	 * @param {import('vue').VueConstructor} Vue
	 */
	install(Vue) {
		Vue.$pMenu = MenuVue;
		Vue.prototype.$pMenu = MenuVue;

		Vue.directive('p-menu-simple', {
			bind(el, binding) {
				el.addEventListener('contextmenu', event => {
					STOP_AND_PREVENT(event);
					Simple.popup(binding.value, ModifierOptions(binding.modifiers));
				});
			}
		});

		Vue.directive('p-menu', {
			bind(el, binding) {
				el.addEventListener('contextmenu', event => {
					STOP_AND_PREVENT(event);
					Menu.popup(binding.value, ModifierOptions(binding.modifiers));
				});
			}
		});
	},
	MenuItem: Menu.MenuItem
};

Menu.Bar.bootstrap();