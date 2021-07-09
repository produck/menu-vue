<template>

<div
>
	<div
		@contextmenu.prevent.stop="$pMenu.popup(menuOptions)"
	>some examples</div>

	<button
		@contextmenu.prevent.stop="openMenu"
	>-</button>

	<button
		v-p-menu.blocking.mnemonic="menuOptions"
	>2+</button>

	<div
		v-p-menu-simple="simpleOptions"
	>simple directive</div>

	{{panelSize}}
	<div

	></div>
</div>

</template>

<script>
import { MenuItem } from '@produck/menu';
export default {
	name: 'App',
	data() {
		return {
			panelSize: 200
		};
	},
	computed: {
		menuOptions() {
			return [
				[
					{
						id: 1,
						type: MenuItem.Clickable,
						label: 'incr&&ease',
						click: () => {
							this.panelSize += 100;
						},
						isChecked: true
					}
				]
			];
		},
		simpleOptions() {
			return [
				{
					label: 'a',
					click: () => console.log('fuck')
				},
				null,
				{
					label: 'b'
				}
			];
		}
	},
	methods: {
		openMenu() {
			this.$pMenu.popup([
				[
					{
						type: MenuItem.Clickable,
						label: 'decrease' + Math.random().toString(16).substr(2, 8),
						click: () => this.panelSize -= 50,
					}
				]
			]);
		}
	}
};
</script>

<style>
* {
	margin: 0;
	padding: 0;
}

html, body {
	height: 100%;
	width: 100%;
}

.sv-view {
	box-shadow: 0 0 0 1px inset #000;
}

#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	margin-top: 60px;
}
</style>
