import 'vue';
import { popup, MenuItem, Bar, closeAllMenu } from '@produck/menu';

interface MenuVue {
	popup: typeof popup;
	closeAllMenu: typeof closeAllMenu;
	Bar: MenuBarVue;
}

interface MenuBarVue {

}

declare module "vue/types/vue" {
	interface Vue {
		$pMenu: MenuVue;
	}

	interface VueConstructor {
		$pMenu: MenuVue;
	}
}

export { MenuItem };