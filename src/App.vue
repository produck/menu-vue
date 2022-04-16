<template>

<div
>
	<div ref="bar"></div>

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
	},
	mounted() {
		this.$pMenu.Bar.set([
			{
				title: '文件(&F)',
				menu: [
					[
						{
							label: '新建(&N)',
						},
						{
							label: '新建窗口(&W)'
						},
					],
					[
						{
							label: '打开(&O)',
						},
					],
					[
						{
							label: '退出(&X)',
							click() {
								window.location.reload();
							}
						}
					]
				]
			},
			{
				title: '编辑(&E)',
				menu: []
			},
			{
				title: '视图(&V)',
				menu: [
					[
						{
							label: '放大',
							click: () => {
								const { drawing } = this.$spoke.getEditor('primary');

								drawing.setScaleInMode(drawing.scale - 1);
							}
						},
						{
							label: '缩小'
						},
						{
							label: '重置视野'
						},
						{
							label: '适应'
						}
					]
				]
			}
		]);

		this.$pMenu.Bar.mount(this.$refs.bar);
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
