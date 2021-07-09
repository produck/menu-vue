import { MenuItem } from '@produck/menu';

export function normalizeSimpleMenuOptions(_options = []) {
	if (!Array.isArray(_options)) {
		throw new Error('An `options` of menu MUST be an array.');
	}

	return [_options.map(itemOptions => {
		const finalItemOptions = {
			type: MenuItem.Spearator
		};

		if (itemOptions === null) {
			return finalItemOptions;
		}

		finalItemOptions.label = itemOptions.label;
		finalItemOptions.type = MenuItem.Clickable;

		if (Array.isArray(itemOptions.submenu)) {
			finalItemOptions.type = MenuItem.Submenu;
			finalItemOptions.submenu = itemOptions.submenu;

			return finalItemOptions;
		} else {
			finalItemOptions.click = itemOptions.click;
			finalItemOptions.isChecked = itemOptions.isChecked;
			finalItemOptions.isDisabled = itemOptions.isDisabled;

			return finalItemOptions;
		}
	})];
}

export function normalizeSimpleMenuBarOptions(_options = []) {
	if (!Array.isArray(_options)) {
		throw new Error('An `options` of menu bar MUST be an array.');
	}

	return _options.map(_itemOptions => {
		return {
			title: _itemOptions.title,
			menu: normalizeSimpleMenuOptions(_itemOptions.menu)
		};
	});
}