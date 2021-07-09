import * as Menu from '@produck/menu';
import { normalizeSimpleMenuOptions, normalizeSimpleMenuBarOptions } from './normalize';

export function popup(options, modifiers) {
	Menu.popup(normalizeSimpleMenuOptions(options), modifiers);
}

export function setMenuBar(options) {
	Menu.Bar.setMenuBar(normalizeSimpleMenuBarOptions(options));
}