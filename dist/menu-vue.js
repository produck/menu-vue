/*!
 * @produck/menu-vue v0.1.2
 * (c) 2020-2021 ChaosLee
 * Released under the MIT License.
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global['menu-vue'] = factory());
}(this, (function () { 'use strict';

	const
		assign = Object.assign,
		throwError$1 = message => { throw new Error(message); },
		instanceOf = (instance, contructor) => instance instanceof contructor,
		typeOf = (any, typeString) => typeof any === typeString,
		isArray = any => Array.isArray(any);

	const isFunction = any => typeOf(any, 'function'),
		isString = any => typeOf(any, 'string'),
		isBoolean = any => typeOf(any, 'boolean'),
		isObject = any => typeOf(any, 'object'),
		isNull = any => any === null;

	const
		toLowerCase = string => string.toLowerCase();

	const DOCUMENT = document, WINDOW = window;
	const BODY = DOCUMENT.body;
	const DOCUMENT_FRAGEMENT = DocumentFragment;

	/**
	 * @param {HTMLElement} element
	 * @param {string} eventType
	 * @param {EventListener} listener
	 */
	const addEventListener = (element, eventType, listener) => {
		element.addEventListener(eventType, listener);
	};

	/**
	 * @param {HTMLElement} element
	 */
	const removeAllChild = (element) => {
		return Array
			.from(element.childNodes)
			.map(childElement => removeChild(element, childElement));
	};

	/**
	 * @param {string} tagName
	 * @returns {HTMLElement}
	 */
	const createElement = (tagName) => {
		return DOCUMENT.createElement(tagName);
	};

	const createTextNode = (data) => {
		return DOCUMENT.createTextNode(data);
	};

	/**
	 * @param {HTMLElement} element
	 * @param {object} ruleObject
	 */
	const setStyle = (element, ...ruleObjectList) => {
		for (const ruleObject of ruleObjectList) {
			for (const property in ruleObject) {
				element.style.setProperty(property, ruleObject[property]);
			}
		}
	};

	/**
	 * @param {HTMLElement} parentElement
	 * @param {HTMLElement} element
	 */
	const appendChild = (parentElement, element) => {
		parentElement.appendChild(element);
	};

	/**
	 * @param {HTMLElement} parentElement
	 * @param {HTMLElement} element
	 */
	const removeChild = (parentElement, element) => {
		parentElement.removeChild(element);
	};

	/**
	 * @param {HTMLElement} element
	 * @param  {...string} tokens
	 */
	const addClass = (element, ...tokens) => {
		element.classList.add(...tokens);
	};

	/**
	 * @param {HTMLElement} element
	 * @param  {...string} tokens
	 */
	const removeClass = (element, ...tokens) => {
		element.classList.remove(...tokens);
	};

	const PREVENT_DEFAULT = event => event.preventDefault();
	const STOP_PROPAGATION = event => event.stopPropagation();

	const STOP_AND_PREVENT$1 = (event) => {
		PREVENT_DEFAULT(event);
		STOP_PROPAGATION(event);
	};

	/**
	 * @param {HTMLElement} element
	 */
	const getRect = (element) => {
		return element.getBoundingClientRect();
	};

	const createFragement = () => {
		return DOCUMENT.createDocumentFragment();
	};

	const
		ROW_ELEMENT = 'e',
		TEXT_ELEMENT = 't',
		MENU = '$',
		LISTEN_ENTER = 'L',
		ACTIVE$1 = 'A',
		FOCUSABLE = 0;

	const
		COLOR = 'color',
		BACKGROUND = 'back',
		FRONTGROUND = 'front';

	const
		MUTE_FRONT_COLOR = 'mute-front-color',
		BACKGROUND_COLOR = `${BACKGROUND}-${COLOR}`,
		FRONTGROUND_COLOR = `${FRONTGROUND}-${COLOR}`,
		SIZE_SM = 'size-sm',
		SIZE_MD = 'size-md',
		SIZE_LG = 'size-lg',
		BAR_HEIGHT = 'bar-height',
		ANIMATION_DURATION = 'animation-duration';

	const CSSVarGenerator = namespace => name => `var(--${namespace}-${name})`;

	const Var = CSSVarGenerator('menu');

	const MNEMONIC_REG = /^[a-z0-9`~?]$/i;

	const LABEL_REG = /^([^&]*)(&[a-z]|&&)?([^&]*)$/i;

	const FRAGEMENT = 'n', MNEMONIC$2 = 'f';

	const resolveLabelText = (text, noMnemonic = false) => {
		const fragement = createFragement();
		const result = { [FRAGEMENT]: fragement, [MNEMONIC$2]: null };
		const [, left, mnemonic, right] = text.match(LABEL_REG);

		if (mnemonic === undefined) {
			appendChild(fragement, createTextNode(left));
		} else if (mnemonic === '&&') {
			appendChild(fragement, createTextNode([left, '&', right].join('')));
		} else {
			const mnemonicChar = mnemonic[1];

			if (noMnemonic) {
				appendChild(fragement, createTextNode([left, mnemonicChar, right].join('')));
			} else  {
				const u = createElement('u');

				u.textContent = mnemonicChar;
				result[MNEMONIC$2] = toLowerCase(mnemonicChar);
				appendChild(fragement, createTextNode(left));
				appendChild(fragement, u);
				appendChild(fragement, createTextNode(right));
			}
		}

		return result;
	};

	const throwError = message => { throw new Error(message); };

	let x = 0, y = 0;
	const getCurrentPosition = () => ({ x, y });

	addEventListener(WINDOW, 'mousedown', event => {
		x = event.clientX;
		y = event.clientY;
	});

	const MENU_ITEM_ROW_STYLE = {
		display: 'block',
		'border': '1px solid transparent'
	};

	const MENU_ITEM_TEXT_STYLE = {
		position: 'relative',
		display: 'flex'
	};

	class AbstractMenu {}

	class BaseMenuItem {
		constructor(menu) {
			if (!instanceOf(menu, AbstractMenu)) {
				throwError('A menu required.');
			}

			const rowElement = createElement('li');
			const textElement = createElement('a');

			appendChild(rowElement, textElement);
			setStyle(rowElement, MENU_ITEM_ROW_STYLE);
			setStyle(textElement, MENU_ITEM_TEXT_STYLE);
			addClass(rowElement, 'menu-item');

			this[ROW_ELEMENT] = rowElement;
			this[TEXT_ELEMENT] = textElement;
			this[MENU] = menu;
		}

		[LISTEN_ENTER](listener) {
			addEventListener(this[ROW_ELEMENT], 'mouseenter', listener);
		}

		[ACTIVE$1]() {}

		get [FOCUSABLE]() {
			return false;
		}
	}

	const normalize$6 = (_options) => {
		const options = {
			id: null
		};

		const {
			id: _id = options.id,
			type: _type
		} = _options;

		options.id = _id;
		options.type = _type;

		return options;
	};

	const FOCUS$1 = 'F',
		BLUR$1 = 'r',
		LABEL_SPAN = 'l',
		MNEMONIC$1 = 'g',
		EXPANDABLE = '_';

	const MENU_ELEMENT = 'm',
		ITEM_LIST = 'l',
		OPENER = 'o',
		FOCUSING_ITEM = 'f',
		EXPANDING_ITEM = 'e',
		COLLAPSING_DELAY = 'd',
		HAS_MNEMONIC$1 = 'h',

		COLLAPSE_ITEM = 'C',
		EXPAND_ITEM = 'E',
		CANCEL_COLLAPSE = 'xC',
		S_CREATE = 'S',
		OPEN = 'O',
		CLOSE = 'X',
		APPEND = 'A',
		NEXT$1 = 'N',
		FOCUS_ITEM = 'F';

	const ICON_SPAN_STYLE = {
		'margin-right': '0.5em'
	};

	const MENU_ITEM_LABEL_SPAN_STYLE = {
		'flex-grow': '1',
		'padding': `0 ${Var(SIZE_LG)}`,
	};

	class FunctionMenuItem extends BaseMenuItem {
		constructor(menu, options) {
			super(menu);

			const textElement = this[TEXT_ELEMENT];
			const labelSpan = createElement('span');

			if (!isNull(options.icon)) {
				const iconSpan = createElement('span');

				addClass(iconSpan, 'menu-item-icon');
				setStyle(iconSpan, ICON_SPAN_STYLE);
				appendChild(labelSpan, iconSpan);
				appendChild(iconSpan, options.icon);
			}

			addClass(labelSpan, 'menu-item-label');
			setStyle(labelSpan, MENU_ITEM_LABEL_SPAN_STYLE);
			appendChild(textElement, labelSpan);

			const result = resolveLabelText(options.label, !menu[HAS_MNEMONIC$1]);

			appendChild(labelSpan, result[FRAGEMENT]);

			this[LABEL_SPAN] = labelSpan;
			this[LISTEN_ENTER](() => menu[FOCUS_ITEM](this));
			this[MNEMONIC$1] = result[MNEMONIC$2];
		}

		[FOCUS$1]() {
			addClass(this[ROW_ELEMENT], 'focus');
		}

		[BLUR$1]() {
			const rowElement = this[ROW_ELEMENT];

			removeClass(rowElement, 'focus');
		}

		get [FOCUSABLE]() {
			return true;
		}

		get [EXPANDABLE]() {
			return false;
		}
	}

	const normalize$5 = (_options) => {
		const options = assign({
			label: '<NO_LABEL>',
			icon: null
		}, normalize$6(_options));

		const {
			label: _label = options.label,
			icon: _icon = options.icon
		} = _options;

		if (!isString(_label)) {
			throwError$1('A menu item label MUST be a string.');
		}

		if (!isNull(_icon) && !instanceOf(_icon, DOCUMENT_FRAGEMENT)) {
			throwError$1('A menu item icon MUST be a DocumentFragment.');
		}

		options.label = _label;
		options.icon = _icon;

		return options;
	};

	const MENU_ITEM_ICON_BOX_STYLE = {
		position: 'absolute',
		height: '100%',
		width: Var(SIZE_LG),
		'text-align': 'center'
	};

	const
		CLICK = 'C',
		CLICK_LISTENER = 'c',
		DISABLED = 'd',
		KEY_ENTER = 'E';

	const SUB_MENU_OPITONS = 'sm',
		EXPANDED_MENU = 'o',

		EXPAND = 'E',
		COLLAPSE = 'C';

	const container = createElement('div');
	const CONTAINER_STYLE = {
		top: 0,
		left: 0,
		width: 0,
		height: '100%',
		display: 'block',
		position: 'fixed',
		'font-size': Var(SIZE_MD)
	};

	setStyle(container, CONTAINER_STYLE);
	addClass(container, 'menu-scope');
	appendChild(BODY, container);

	let currentMenu = null;

	const setCurrentMenu = (menu, blocking = false) => {
		closeAllMenu();
		currentMenu = menu;

		if (blocking) {
			setStyle(container, { width: '100%' });
		}
	};

	const appendMenu = (menu) => {
		appendChild(container, menu[MENU_ELEMENT]);
		menu[OPEN]();
	};

	const closeAllMenu = () => {
		if (!isNull(currentMenu)) {
			currentMenu[CLOSE]();
			currentMenu = null;
			expandable = expanding = null;
			setStyle(container, { width: 0 });
		}
	};

	const selectUp = () => {
		getTopMenu()[NEXT$1](null, true);
	};

	const selectDown = () => {
		getTopMenu()[NEXT$1]();
	};

	const getTopMenu = () => {
		let menu = currentMenu;

		while (!isNull(menu[EXPANDING_ITEM])) {
			menu = menu[EXPANDING_ITEM][EXPANDED_MENU];
		}

		return menu;
	};

	const tryCollapse = () => {
		const topMenu = getTopMenu();

		if (!isNull(topMenu[OPENER])) {
			topMenu[OPENER][COLLAPSE]();

			return true;
		}

		return false;
	};

	const tryExpand = () => {
		const topMenu = getTopMenu();
		const focusingItem = topMenu[FOCUSING_ITEM];

		if (focusingItem && focusingItem[SUB_MENU_OPITONS]) {
			topMenu[EXPAND_ITEM]();
			selectDown();
		}
	};

	const tryActive = () => {
		const topMenu = getTopMenu();
		const focusingItem = topMenu[FOCUSING_ITEM];

		focusingItem && focusingItem[ACTIVE$1]();
	};

	const KEY_MAP_OPERATION$1 = {
		ArrowUp: selectUp,
		ArrowDown: selectDown,
		ArrowLeft: tryCollapse,
		ArrowRight: tryExpand,
		Escape: () => tryCollapse() || closeAllMenu(),
		Enter: tryActive
	};

	addEventListener(WINDOW, 'mousedown', closeAllMenu);
	addEventListener(WINDOW, 'blur', closeAllMenu);

	let expanding = null, expandable = null;

	const current = Object.freeze({
		get expanding() {
			return expanding;
		},
		get expandable() {
			return expandable;
		},
		get closed() {
			return isNull(currentMenu);
		},
		next() {
			if (currentMenu) {
				currentMenu[NEXT$1]();
			}
		}
	});

	addEventListener(WINDOW, 'keydown', event => {
		const { key } = event;

		if (currentMenu) {
			const topMenu = getTopMenu();

			expanding = !isNull(currentMenu[EXPANDING_ITEM]);

			expandable = topMenu[FOCUSING_ITEM]
				? topMenu[FOCUSING_ITEM][EXPANDABLE]
				: false;

			if (key in KEY_MAP_OPERATION$1) {
				KEY_MAP_OPERATION$1[key](event);
			} else if (MNEMONIC_REG.test(key)) {

				if (topMenu[NEXT$1](toLowerCase(key))) {
					topMenu[FOCUSING_ITEM][ACTIVE$1]();
				}
			}
		}
	});

	const CHECKING_POSITION_STYLE = { top: 0, left: 0 };

	const MENU_ITEM_ROW_STYLE_ON_DISABLED = {
		opacity: 0.4,
		cursor: 'default'
	};

	const joinAcceleratorElement = acceleratorBarList => {
		const lastBarIndex = acceleratorBarList.length - 1;
		const fragement = createFragement();

		acceleratorBarList.forEach((bar, index) => {
			appendChild(fragement, bar);
			index !== lastBarIndex && appendChild(fragement, createTextNode(' '));
		});

		return fragement;
	};

	class ClickableMenuItem extends FunctionMenuItem {
		constructor(menu, options) {
			super(menu, options);

			const rowElement = this[ROW_ELEMENT];
			const textElement = this[TEXT_ELEMENT];
			const acceleratorSpan = createElement('span');
			const checkboxSpan = createElement('span');

			addClass(acceleratorSpan, 'menu-item-accelerator');
			addClass(checkboxSpan, 'menu-item-checkbox');

			setStyle(acceleratorSpan, MENU_ITEM_LABEL_SPAN_STYLE, { 'text-align': 'right' });
			setStyle(checkboxSpan, MENU_ITEM_ICON_BOX_STYLE, CHECKING_POSITION_STYLE);
			appendChild(textElement, acceleratorSpan);
			appendChild(textElement, checkboxSpan);
			appendChild(acceleratorSpan, joinAcceleratorElement(options.accelerator));

			addEventListener(rowElement, 'mouseup', () => this[CLICK]());
			addEventListener(rowElement, 'contextmenu', STOP_AND_PREVENT$1);

			this[CLICK_LISTENER] = options.click;
			this[KEY_ENTER] = event => event.key === 'Enter' && this[CLICK]();

			const disabled = this[DISABLED] = options.isDisabled;

			if (disabled) {
				setStyle(this[ROW_ELEMENT], MENU_ITEM_ROW_STYLE_ON_DISABLED);
				addClass(rowElement, 'disabled');
			}

			if (options.isChecked) {
				addClass(rowElement, 'checked');
			}
		}

		get [FOCUSABLE]() {
			return !this[DISABLED];
		}

		[FOCUS$1]() {
			if (!this[DISABLED]) {
				super[FOCUS$1]();
			}
		}

		[BLUR$1]() {
			if (!this[DISABLED]) {
				super[BLUR$1]();
			}
		}

		[CLICK]() {
			this[CLICK_LISTENER]();
			closeAllMenu();
		}

		[ACTIVE$1]() {
			this[CLICK]();
		}
	}

	const DEFAULT_CLICK_FN = () => console.warn(undefined);

	const  normalize$4 = (_options) => {
		const options = assign({
			click: DEFAULT_CLICK_FN,
			isChecked: false,
			isDisabled: false,
			accelerator: []
		}, normalize$5(_options));

		const {
			click: _click = options.click,
			isChecked: _isChecked = options.isChecked,
			isDisabled: _isDisabled = options.isDisabled,
			accelerator: _accelerator = options.accelerator
		} = _options;

		if (!isFunction(_click)) {
			throwError$1('A `.click()` of clickable item MUST be a function.');
		}

		if (!isBoolean(_isChecked)) {
			throwError$1('A `.isChecked` MUST be a `boolean`.');
		}

		if (!isBoolean(_isDisabled)) {
			throwError$1('A `.isDisabled` MUST be a `boolean`.');
		}

		if (!isArray(_accelerator)) {
			throwError$1('A `.accelerator` MUST be an array of string.');
		}

		options.accelerator = _accelerator.map(_bar => {
			if (!instanceOf(_bar, DOCUMENT_FRAGEMENT)) {
				throwError$1('A `.accelerator` MUST be a `DocumentFragement`.');
			}

			return _bar;
		});

		options.click = _click;
		options.isChecked = _isChecked;
		options.isDisabled = _isDisabled;

		return options;
	};

	const NORMALIZER = 'n', TYPE = 't';
	const TYPE_NORMALIZER_MAP = [];

	const normalize$3 = (options) => {
		options.type = 'type' in options ? options.type : ClickableMenuItem;

		const pair = TYPE_NORMALIZER_MAP.find(pair => pair[TYPE] === options.type);

		if (pair === undefined) {
			throwError$1('Invalid menu item type.');
		}

		return pair[NORMALIZER](options);
	};

	const normalizeMenuOptions = (_options) => {
		if (!isArray(_options)) {
			throwError$1('Menu options MUST be an array.');
		}

		return _options.map(_groupOptions => {
			if (!isArray(_groupOptions)) {
				throwError$1('Menu item group options MUST be an array.');
			}

			const NORMALIZE_ITEM_OPTIONS = options => normalize$3(options);

			return _groupOptions.reduce((itemOptionsList, itemOptions) => {
				const finalItemOptionsList = isFunction(itemOptions)
					? itemOptions().map(NORMALIZE_ITEM_OPTIONS)
					: [NORMALIZE_ITEM_OPTIONS(itemOptions)];

				itemOptionsList.push(...finalItemOptionsList);

				return itemOptionsList;
			}, []);
		});
	};

	const register = (MenuItemClass, normalize) => {
		TYPE_NORMALIZER_MAP.push({
			[TYPE]: MenuItemClass,
			[NORMALIZER]: normalize
		});
	};

	const SPEARATOR_MENU_ITEM_STYLE = {
		display: 'block',
		'border-bottom': `1px solid ${Var(MUTE_FRONT_COLOR)}`,
		'margin': `${Var(SIZE_SM)} ${Var(SIZE_MD)}`,
	};

	class SpearatorMenuItem extends BaseMenuItem {
		constructor(menu) {
			super(menu);

			setStyle(this[TEXT_ELEMENT], SPEARATOR_MENU_ITEM_STYLE);
			this[LISTEN_ENTER](() => menu[FOCUS_ITEM]());
		}
	}

	const normalize$2 = (_options) => {
		return normalize$6(_options);
	};

	const MENU_STYLE = {
		display: 'block',
		position: 'fixed',
		margin: 0,
		padding: `${Var(SIZE_SM)} 0`,
		'white-space': 'nowrap',
		'border': '1px solid transparent',
		'line-height': Var(SIZE_LG),
		'background': Var(BACKGROUND_COLOR),
		'color': Var(FRONTGROUND_COLOR),
		'user-select': 'none',
		'opacity': 0,
		'transition': `opacity ${Var(ANIMATION_DURATION)}`,
	};

	const IS_FOCUSABLE_ITEM = item => item[FOCUSABLE];

	class Menu extends AbstractMenu {
		constructor() {
			super();

			const menuElement = createElement('ul');
			const itemComponentList = [];

			setStyle(menuElement, MENU_STYLE);
			addClass(menuElement, 'menu');

			this[ITEM_LIST] = itemComponentList;
			this[MENU_ELEMENT] = menuElement;
			this[FOCUSING_ITEM] = null;
			this[OPENER] = null;
			this[COLLAPSING_DELAY] = null;
			this[HAS_MNEMONIC$1] = false;

			const cancelOpenerCollapse = () => {
				let opener = this[OPENER];

				while (!isNull(opener)) {
					opener[MENU][FOCUS_ITEM](opener);
					opener[MENU][CANCEL_COLLAPSE]();
					opener = opener[MENU][OPENER];
				}
			};

			addEventListener(menuElement, 'mouseleave', () => this[FOCUS_ITEM]());
			addEventListener(menuElement, 'mousedown', STOP_PROPAGATION);
			addEventListener(menuElement, 'mouseenter', cancelOpenerCollapse);
		}

		get [EXPANDING_ITEM]() {
			return this[ITEM_LIST]
				.filter(item => instanceOf(item, SubmenuMenuItem))
				.find(submenuItem => !isNull(submenuItem[EXPANDED_MENU])) || null;
		}

		[FOCUS_ITEM](item = null) {
			this[FOCUSING_ITEM] && this[FOCUSING_ITEM][BLUR$1]();
			!isNull(item) && item[FOCUS$1]();
			this[this[EXPANDING_ITEM] === item ? CANCEL_COLLAPSE : COLLAPSE_ITEM]();
			this[FOCUSING_ITEM] = item;
		}

		[EXPAND_ITEM]() {
			if (instanceOf(this[FOCUSING_ITEM], SubmenuMenuItem)) {
				this[FOCUSING_ITEM][EXPAND]();
			}
		}

		[COLLAPSE_ITEM](delay = 500) {
			this[CANCEL_COLLAPSE]();

			const expandingItem = this[EXPANDING_ITEM];

			if (expandingItem && instanceOf(expandingItem, SubmenuMenuItem)) {
				this[COLLAPSING_DELAY] = setTimeout(() => expandingItem[COLLAPSE](), delay);
			}
		}

		[CANCEL_COLLAPSE]() {
			clearTimeout(this[COLLAPSING_DELAY]);
		}

		[OPEN]() {
			requestAnimationFrame(() => setStyle(this[MENU_ELEMENT], { opacity: 1 }));
		}

		[CLOSE]() {
			removeChild(this[MENU_ELEMENT].parentElement, this[MENU_ELEMENT]);
			this[COLLAPSE_ITEM](0);
		}

		/**
		 * Use to add item to this menu.
		 *
		 * @param {import('./Base').BaseMenuItem} item A menu item being appended
		 */
		[APPEND](item) {
			this[ITEM_LIST].push(item);
		}

		/**
		 * Try to find a `next` item then focusing.
		 *
		 * @param {string|null} mnemonic Filtering item by a-z
		 * @param {boolean} reversed Searching direction
		 * ../..returns The target item found or not.
		 */
		[NEXT$1](mnemonic = null, reversed = false) {
			const sequence = this[ITEM_LIST].filter(IS_FOCUSABLE_ITEM);

			if (reversed) {
				sequence.reverse();
			}

			const focusingIndex = sequence.findIndex(item => item === this[FOCUSING_ITEM]);
			const length = sequence.length;

			for (let index = 0; index < length; index++) {
				const current = sequence[(focusingIndex + index + 1) % length];

				if (isNull(mnemonic) || current[MNEMONIC$1] === mnemonic) {
					this[FOCUS_ITEM](current);

					return true;
				}
			}

			return false;
		}

		static [S_CREATE](options, hasMnemonic) {
			const finalOptions = normalizeMenuOptions(options);
			const menu = new this();
			const fragement = createFragement();

			menu[HAS_MNEMONIC$1] = hasMnemonic;

			finalOptions.forEach((groupOptions, index) => {
				groupOptions.forEach(options => {
					const item = new options.type(menu, options);

					menu[APPEND](item);
					appendChild(fragement, item[ROW_ELEMENT]);
				});

				if (index !== options.length - 1) {
					const spearatorItem = new SpearatorMenuItem(menu);

					menu[APPEND](spearatorItem);
					appendChild(fragement, spearatorItem[ROW_ELEMENT]);
				}
			});

			appendChild(menu[MENU_ELEMENT], fragement);

			return menu;
		}
	}

	const ICON_POSITION_STYLE = { right: 0, top: 0 };

	/**
	 * @param {HTMLElement} menuElement
	 * @param {DOMRect} rect
	 */
	const relayoutMenu = (menuElement, rect, offsetX = 0, offsetY = 0) => {
		const bottom = rect.bottom;
		const top = rect.top - offsetY;
		const right = rect.right + offsetX;
		const left = rect.left;

		setStyle(menuElement, { top: `${top}px`, left: `${right}px` });

		const menuRect = getRect(menuElement);

		if (menuRect.bottom > WINDOW.innerHeight) {
			setStyle(menuElement, {
				top: `${bottom - menuElement.offsetHeight}px`
			});
		}

		if (menuRect.right > WINDOW.innerWidth) {
			setStyle(menuElement, {
				left: `${left - menuElement.offsetWidth}px`
			});
		}

		//TODO resize
	};

	class SubmenuMenuItem extends FunctionMenuItem {
		constructor(menu, options) {
			super(menu, options);

			const expandingSpan = createElement('span');

			setStyle(expandingSpan, MENU_ITEM_ICON_BOX_STYLE, ICON_POSITION_STYLE);
			addClass(expandingSpan, 'menu-item-expanding');
			appendChild(this[TEXT_ELEMENT], expandingSpan);

			this[SUB_MENU_OPITONS] = options.submenu;
			this[EXPANDED_MENU] = null;
			this[LISTEN_ENTER](() => this[MENU][EXPAND_ITEM]());
		}

		[EXPAND]() {
			if (isNull(this[EXPANDED_MENU])) {
				const menu = Menu[S_CREATE](this[SUB_MENU_OPITONS], this[MENU][HAS_MNEMONIC$1]);
				const rect = getRect(this[ROW_ELEMENT]);

				menu[OPENER] = this;
				this[EXPANDED_MENU] = menu;
				appendMenu(menu);
				relayoutMenu(menu[MENU_ELEMENT], rect, 1, 7);
			}
		}

		[COLLAPSE]() {
			const expandedMenu = this[EXPANDED_MENU];

			if (!isNull(expandedMenu)) {
				expandedMenu[CLOSE]();
				this[EXPANDED_MENU] = null;
			}
		}

		[ACTIVE$1]() {
			this[EXPAND]();
			this[EXPANDED_MENU][NEXT$1]();
		}

		[EXPANDABLE]() {
			return true;
		}
	}

	const normalize$1 = (_options) => {
		const options = assign({
			submenu: []
		}, normalize$5(_options));

		const {
			submenu: _submenu = options.submenu
		} = _options;

		options.submenu = normalizeMenuOptions(_submenu);

		return options;
	};

	var index$1 = /*#__PURE__*/Object.freeze({
		__proto__: null,
		Clickable: ClickableMenuItem,
		Spearator: SpearatorMenuItem,
		Submenu: SubmenuMenuItem
	});

	register(ClickableMenuItem, normalize$4);
	register(SubmenuMenuItem, normalize$1);
	register(SpearatorMenuItem, normalize$2);

	const normalizeModifier = (_options = {}) => {
		const options = {
			position: getCurrentPosition(),
			mnemonic: false,
			blocking: false
		};

		const {
			position: _position = options.position,
			mnemonic: _mnemonic = options.mnemonic,
			blocking: _blocking = options.blocking
		} = _options;

		if (!isBoolean(_mnemonic)) {
			throwError$1('A `modifier.mnemonic` MUST be a boolean.');
		}

		if (!isBoolean(_blocking)) {
			throwError$1('A `modifier.blocking` MUST be a boolean.');
		}

		if (!isObject(_position)) {
			throwError$1('A `modifier.position` MUST be a boolean.');
		} else {
			const {
				x: _x = options.position.x,
				y: _y = options.position.y
			} = _position;

			if (isNaN(_x) || isNaN(_y)) {
				throwError$1('Invalid position.');
			}

			options.position.x = _x;
			options.position.y = _y;
		}

		options.mnemonic = _mnemonic;
		options.blocking = _blocking;

		return options;
	};

	const MockRectFromPosition = position => {
		return {
			top: position.y,
			bottom: position.y,
			left: position.x,
			right: position.x
		};
	};

	const popup$1 = (menuOptions, modifierOptions) => {
		const { position, mnemonic, blocking } = normalizeModifier(modifierOptions);
		const menu = Menu[S_CREATE](menuOptions, mnemonic);

		setCurrentMenu(menu, blocking);
		appendMenu(menu);
		relayoutMenu(menu[MENU_ELEMENT], MockRectFromPosition(position));
	};

	/**
	 * @param {Array} _options
	 */
	const normalize = _options => {
		if (!isArray(_options)) {
			throwError$1('A menu bar options MUST be an array.');
		}

		const options = _options.map(_buttonOptions => {
			const options = {
				title: 'defalut',
				menu: []
			};

			const {
				title: _title = options.title,
				menu: _menu = options.menu
			} = _buttonOptions;

			if (!isString(_title)) {
				throwError$1('A menu bar button title MUST be a string.');
			}

			options.menu = isFunction(_menu) ? _menu : () => _menu;
			options.title = _title;

			return options;
		});

		return options;
	};

	const
		BAR_ELEMENT = 'e',
		BUTTON_LIST = 'b',

		ACTIVE = 'a',
		_ACTIVE = '_a',
		HAS_MNEMONIC = 'h',
		_HAS_MNEMONIC = '_h',
		FOCUSING_BUTTON = 'f',
		_FOCUSING_BUTTON = '_f',

		APPEND_BUTTON = 'A',
		NEXT = 'N';

	const CONTAINER = '_',
		MENU_BAR$1 = '$',
		SELECTING = 'x';

	const state = {
		[CONTAINER]: null,
		[MENU_BAR$1]: null,
		[SELECTING]: false
	};

	const isReady =
		() => !isNull(state[CONTAINER]) && !isNull(state[MENU_BAR$1]);

	let holding = false;

	addEventListener(WINDOW, 'keyup', event => {
		if (event.key === 'Alt') {
			holding = false;
		}
	});

	const KEY_MAP_OPERATION = {
		Alt: () => {
			if (!holding) {
				holding = true;

				const buttonList = state[MENU_BAR$1][BUTTON_LIST];

				if (buttonList.length > 0) {
					if (isNull(state[MENU_BAR$1][FOCUSING_BUTTON])) {
						closeAllMenu();
						state[SELECTING] = state[MENU_BAR$1][HAS_MNEMONIC] = true;
						state[MENU_BAR$1][FOCUSING_BUTTON] = buttonList[0];
					} else {
						resetMenuBar();
					}
				}
			}
		},
		Enter: () => {
			if (!state[MENU_BAR$1][ACTIVE]) {
				state[MENU_BAR$1][ACTIVE] = true;
				current.next();
			}
		},
		ArrowDown: () => {
			if (!state[MENU_BAR$1][ACTIVE]) {
				state[MENU_BAR$1][ACTIVE] = true;
				current.next();
			}
		},
		ArrowLeft: () => {
			if (state[SELECTING]) {
				if (current.closed || current.expanding === false) {
					state[MENU_BAR$1][NEXT](null, true);

					if (state[MENU_BAR$1][ACTIVE]) {
						current.next();
					}
				}
			}
		},
		ArrowRight: () => {
			if (state[SELECTING]) {
				if (current.closed || current.expandable === false) {
					state[MENU_BAR$1][NEXT]();

					if (state[MENU_BAR$1][ACTIVE]) {
						current.next();
					}
				}
			}
		},
		Escape: () => {
			if (current.closed) {
				if (state[MENU_BAR$1][ACTIVE]) {
					state[MENU_BAR$1][ACTIVE] = false;
				} else if (state[MENU_BAR$1][FOCUSING_BUTTON]) {
					resetMenuBar();
				}
			}
		}
	};

	const resetMenuBar = () => {
		if (isReady()) {
			state[MENU_BAR$1][FOCUSING_BUTTON] = null;

			holding =
				state[MENU_BAR$1][ACTIVE] =
				state[MENU_BAR$1][HAS_MNEMONIC] =
				state[SELECTING] =
				false;
		}
	};

	addEventListener(WINDOW, 'mousedown', resetMenuBar);
	addEventListener(WINDOW, 'mouseup', resetMenuBar);
	addEventListener(WINDOW, 'blur', resetMenuBar);

	addEventListener(WINDOW, 'keydown', event => {
		if (isReady()) {
			const key = event.key;

			if (key in KEY_MAP_OPERATION) {
				KEY_MAP_OPERATION[key]();
			} else if (MNEMONIC_REG.test(key)) {
				if (current.closed) {
					if (!state[MENU_BAR$1][ACTIVE]) {
						state[MENU_BAR$1][ACTIVE] = true;
					}

					if (state[MENU_BAR$1][NEXT](toLowerCase(key))) {
						current.next();
					}
				}
			}
		}
	});

	const install = () => {
		if (state[MENU_BAR$1] && state[CONTAINER]) {
			removeAllChild(state[CONTAINER]);
			appendChild(state[CONTAINER], state[MENU_BAR$1][BAR_ELEMENT]);
		}
	};

	const MENU_BAR = '$',
		OUTER_ELEMENT = 'o',
		INNER_ELEMENT = 'i',
		MENU_OPTIONS = '_',
		MNEMONIC = 'm',
		TITLE = 't',

		SET_LABEL = 'S',
		FOCUS = 'F',
		BLUR = 'B',
		OPEN_MENU = 'O';

	const MENU_BAR_STYLE = {
		display: 'flex',
		flex: 1,
		'user-select': 'none',
		height: `${Var(BAR_HEIGHT)}`,
		'line-height': `${Var(BAR_HEIGHT)}`,
		'font-size': Var(SIZE_MD),
		color: Var(FRONTGROUND_COLOR)
	};

	class MenuBar {
		constructor() {
			const container = createElement('div');

			addClass(container, 'menu-bar');
			setStyle(container, MENU_BAR_STYLE);

			this[BAR_ELEMENT] = container;
			this[BUTTON_LIST] = [];

			addEventListener(container, 'click', () => this[ACTIVE] = !this[ACTIVE]);
			addEventListener(container, 'mousedown', STOP_PROPAGATION);
			addEventListener(container, 'mouseup', STOP_PROPAGATION);
			addEventListener(container, 'contextmenu', STOP_AND_PREVENT$1);
			addEventListener(container, 'mouseleave', () => {
				if (!this[ACTIVE]) {
					this[FOCUSING_BUTTON] = null;
				}
			});

			this[_HAS_MNEMONIC] = false;
			this[_ACTIVE] = false;
			this[_FOCUSING_BUTTON] = null;
		}

		get [HAS_MNEMONIC]() {
			return this[_HAS_MNEMONIC];
		}

		set [HAS_MNEMONIC](value) {
			this[_HAS_MNEMONIC] = value;
			this[BUTTON_LIST].forEach(button => button[SET_LABEL]());
			(value ? addClass : removeClass)(this[BAR_ELEMENT], 'has-mnemonic');
		}

		get [ACTIVE]() {
			return this[_ACTIVE];
		}

		set [ACTIVE](value) {
			if (value !== this[_ACTIVE]) {
				const barElement = this[BAR_ELEMENT];

				if (value) {
					addClass(barElement, 'active');
					state[SELECTING] = true;

					if (this[_FOCUSING_BUTTON]) {
						this[_FOCUSING_BUTTON][OPEN_MENU]();
					}
				} else {
					removeClass(barElement, 'active');
					closeAllMenu();
				}

				this[_ACTIVE] = value;
			}
		}

		get [FOCUSING_BUTTON]() {
			return this[_FOCUSING_BUTTON];
		}

		set [FOCUSING_BUTTON](value) {
			const currentButton = this[FOCUSING_BUTTON];

			if (value !== currentButton) {
				if (!isNull(currentButton)) {
					currentButton[BLUR]();
				}

				if (!isNull(value)) {
					value[FOCUS]();

					if (this[ACTIVE]) {
						value[OPEN_MENU]();
					}
				}
			}

			this[_FOCUSING_BUTTON] = value;
		}

		[APPEND_BUTTON](button) {
			this[BUTTON_LIST].push(button);
		}

		/**
		 * Try to find a `next` item then focusing.
		 *
		 * ..param {string|null} mnemonic Filtering item by a-z
		 * ..param {boolean} reversed Searching direction
		 * ..returns The target item found or not.
		 */
		[NEXT](mnemonic = null, reversed = false) {
			const sequence = this[BUTTON_LIST].slice(0);

			if (reversed) {
				sequence.reverse();
			}

			const focusingIndex = sequence.findIndex(button => button === this[FOCUSING_BUTTON]);
			const length = sequence.length;

			for (let index = 0; index < length; index++) {
				const current = sequence[(focusingIndex + index + 1) % length];

				if (isNull(mnemonic) || current[MNEMONIC] === mnemonic) {
					this[FOCUSING_BUTTON] = current;

					return true;
				}
			}

			return false;
		}
	}

	const MENU_BUTTON_OUTER_STYLE = {
		padding: `0 ${Var(SIZE_SM)}`,
	};

	class MenuBarButton {
		constructor(menuBar, options) {
			this[MENU_BAR] = menuBar;
			this[MENU_OPTIONS] = options.menu;
			this[MNEMONIC] = null;
			this[TITLE] = options.title;

			const outerElement = this[OUTER_ELEMENT] = createElement('div');
			const innerElement = this[INNER_ELEMENT] = createElement('div');

			addClass(outerElement, 'menu-bar-button');
			addClass(innerElement, 'menu-bar-button-title');
			appendChild(outerElement, innerElement);
			setStyle(outerElement, MENU_BUTTON_OUTER_STYLE);

			const focusThis = () => this[MENU_BAR][FOCUSING_BUTTON] = this;

			addEventListener(outerElement, 'mouseenter', focusThis);

			this[SET_LABEL]();
		}

		[SET_LABEL]() {
			const result = resolveLabelText(this[TITLE], !this[MENU_BAR][HAS_MNEMONIC]);

			removeAllChild(this[INNER_ELEMENT]);
			appendChild(this[INNER_ELEMENT], result[FRAGEMENT]);
			this[MNEMONIC] = result[MNEMONIC$2];
		}

		[FOCUS]() {
			addClass(this[OUTER_ELEMENT], 'focus');
		}

		[BLUR]() {
			removeClass(this[OUTER_ELEMENT], 'focus');
		}

		[OPEN_MENU]() {
			const { left, bottom } = getRect(this[OUTER_ELEMENT]);
			const menuOptions = normalizeMenuOptions(this[MENU_OPTIONS]());

			popup$1(menuOptions, {
				position: { x: left, y: bottom },
				mnemonic: this[MENU_BAR][HAS_MNEMONIC]
			});
		}
	}

	const mount = element => {
		state[CONTAINER] = element;
		install();
	};

	const setMenuBar$1 = options => {
		const finalOptions = normalize(options);
		const menuBar = state[MENU_BAR$1] = new MenuBar();
		const fragement = createFragement();

		finalOptions.forEach(buttonOptions => {
			const button = new MenuBarButton(menuBar, buttonOptions);

			menuBar[APPEND_BUTTON](button);
			appendChild(fragement, button[OUTER_ELEMENT]);
		});

		appendChild(menuBar[BAR_ELEMENT], fragement);
		install();
	};

	function normalizeSimpleMenuOptions(_options = []) {
		if (!Array.isArray(_options)) {
			throw new Error('An `options` of menu MUST be an array.');
		}

		return [_options.map(itemOptions => {
			const finalItemOptions = {
				type: SpearatorMenuItem
			};

			if (itemOptions === null) {
				return finalItemOptions;
			}

			finalItemOptions.label = itemOptions.label;
			finalItemOptions.type = ClickableMenuItem;

			if (Array.isArray(itemOptions.submenu)) {
				finalItemOptions.type = SubmenuMenuItem;
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

	function normalizeSimpleMenuBarOptions(_options = []) {
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

	function popup(options, modifiers) {
		popup$1(normalizeSimpleMenuOptions(options), modifiers);
	}

	function setMenuBar(options) {
		setMenuBar$1(normalizeSimpleMenuBarOptions(options));
	}

	const MenuVue = Object.freeze({
		popup: popup$1,
		closeAll: closeAllMenu,
		Bar: Object.freeze({
			mount: mount,
			set: setMenuBar$1
		}),
		Simple: {
			popup: popup,
			setMenuBar: setMenuBar
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

	var index = {
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
						popup(binding.value, ModifierOptions(binding.modifiers));
					});
				}
			});

			Vue.directive('p-menu', {
				bind(el, binding) {
					el.addEventListener('contextmenu', event => {
						STOP_AND_PREVENT(event);
						popup$1(binding.value, ModifierOptions(binding.modifiers));
					});
				}
			});
		},
		MenuItem: index$1
	};

	return index;

})));
