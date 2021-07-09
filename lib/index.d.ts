import 'vue';
import { popup, MenuItem, Bar, closeAllMenu } from '@produck/menu';

namespace SimpleOptions {
	type SpearatorMenuItem = null;
	type Menu = (MenuItem | SpearatorMenuItem)[];

	interface MenuItem {
		label?: string;
		click?: () => any;
		isChecked?: boolean;
		isDisabled?: boolean;
		submenu?: SimpleMenu;
	}

	type MenuBar = MenuBarItem[];

	interface MenuBarItem {
		title?: string;
		menu: Menu;
	}
}

interface MenuVue {
	popup: typeof popup;
	closeAll: typeof closeAllMenu;
	Bar: MenuBarVue;
	Simple: Simple;

}

interface MenuBarVue {
	mount: typeof Bar.mount;
	set: typeof Bar.setMenuBar;
}

interface Simple {
	popup(options: SimpleOptions.Menu): void;
	setMenuBar(options: SimpleOptions.MenuBar): void;
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