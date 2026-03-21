import { defineConfig } from 'vitepress'

export default defineConfig({
	base: '/vue-mount-plugin/',
	title: 'vue-mount-plugin',
	description: 'A simple and easy to use Vue instance extension plugin that supports Vue 2.0 and Vue 3.0',
	lang: 'en-US',

	head: [
		['meta', { name: 'theme-color', content: '#6366f1' }],
		['meta', { name: 'og:type', content: 'website' }],
		['meta', { name: 'og:title', content: 'vue-mount-plugin' }],
		['meta', { name: 'og:description', content: 'A simple and easy to use Vue instance extension plugin' }],
	],

	locales: {
		root: {
			label: 'English',
			lang: 'en',
			themeConfig: {
				darkModeSwitchLabel: 'Theme',
				darkModeSwitchTitle: 'Switch to dark theme',
				lightModeSwitchTitle: 'Switch to light theme',
				langMenuLabel: 'Language',
				sidebarMenuLabel: 'Menu',
				returnToTopLabel: 'Return to top',
				outline: { label: 'On this page' },
				docFooter: { prev: 'Previous', next: 'Next' },
				lastUpdated: {
					text: 'Last updated',
					formatOptions: { dateStyle: 'medium', timeStyle: 'short' },
				},
				editLink: {
					pattern: 'https://github.com/saqqdy/vue-mount-plugin/edit/master/docs/:path',
					text: 'Edit this page on GitHub',
				},
				footer: {
					message: 'Released under the MIT License.',
					copyright: 'Copyright © 2023-present saqqdy',
				},
				nav: [
					{ text: 'Guide', link: '/guide/getting-started', activeMatch: '/guide/' },
					{ text: 'API', link: '/api/', activeMatch: '/api/' },
					{ text: 'Examples', link: '/examples/', activeMatch: '/examples/' },
					{ text: 'Migration', link: '/migration/v3-to-v4', activeMatch: '/migration/' },
					{
						text: 'Links',
						items: [
							{ text: 'GitHub', link: 'https://github.com/saqqdy/vue-mount-plugin' },
							{ text: 'NPM', link: 'https://www.npmjs.com/package/vue-mount-plugin' },
							{ text: 'Changelog', link: 'https://github.com/saqqdy/vue-mount-plugin/blob/master/CHANGELOG.md' },
						],
					},
				],
				sidebar: {
					'/guide/': [
						{
							text: 'Guide',
							items: [
								{ text: 'Getting Started', link: '/guide/getting-started' },
								{ text: 'Basic Usage', link: '/guide/basic-usage' },
								{ text: 'Advanced Usage', link: '/guide/advanced-usage' },
								{ text: 'Composables', link: '/guide/composables' },
								{ text: 'Vue Plugin', link: '/guide/vue-plugin' },
							],
						},
					],
					'/api/': [
						{
							text: 'API Reference',
							items: [
								{ text: 'Overview', link: '/api/' },
								{ text: 'mount()', link: '/api/mount' },
								{ text: 'createMount()', link: '/api/createMount' },
								{ text: 'MountInstance', link: '/api/instance' },
								{ text: 'MountOptions', link: '/api/options' },
								{ text: 'Global Functions', link: '/api/global' },
								{ text: 'Types', link: '/api/types' },
							],
						},
					],
					'/examples/': [
						{
							text: 'Examples',
							items: [
								{ text: 'Overview', link: '/examples/' },
								{ text: 'Modal', link: '/examples/modal' },
								{ text: 'Confirm Dialog', link: '/examples/confirm-dialog' },
								{ text: 'Toast', link: '/examples/toast' },
								{ text: 'Context Inheritance', link: '/examples/context' },
							],
						},
					],
					'/migration/': [
						{
							text: 'Migration',
							items: [
								{ text: 'v3 to v4', link: '/migration/v3-to-v4' },
							],
						},
					],
				},
			},
		},
		zh: {
			label: '简体中文',
			lang: 'zh-CN',
			link: '/zh/',
			title: 'vue-mount-plugin',
			description: '一个简单易用的 Vue 实例扩展插件，支持 Vue 2.0 和 Vue 3.0',
			themeConfig: {
				darkModeSwitchLabel: '主题',
				darkModeSwitchTitle: '切换到深色模式',
				lightModeSwitchTitle: '切换到浅色模式',
				langMenuLabel: '语言',
				sidebarMenuLabel: '菜单',
				returnToTopLabel: '回到顶部',
				outline: { label: '页面导航' },
				docFooter: { prev: '上一页', next: '下一页' },
				lastUpdated: {
					text: '最后更新于',
					formatOptions: { dateStyle: 'medium', timeStyle: 'short' },
				},
				editLink: {
					pattern: 'https://github.com/saqqdy/vue-mount-plugin/edit/master/docs/:path',
					text: '在 GitHub 上编辑此页',
				},
				footer: {
					message: '基于 MIT 许可发布',
					copyright: '版权所有 © 2023-present saqqdy',
				},
				nav: [
					{ text: '指南', link: '/zh/guide/getting-started', activeMatch: '/zh/guide/' },
					{ text: 'API', link: '/zh/api/', activeMatch: '/zh/api/' },
					{ text: '示例', link: '/zh/examples/', activeMatch: '/zh/examples/' },
					{ text: '迁移', link: '/zh/migration/v3-to-v4', activeMatch: '/zh/migration/' },
					{
						text: '链接',
						items: [
							{ text: 'GitHub', link: 'https://github.com/saqqdy/vue-mount-plugin' },
							{ text: 'NPM', link: 'https://www.npmjs.com/package/vue-mount-plugin' },
							{ text: '更新日志', link: 'https://github.com/saqqdy/vue-mount-plugin/blob/master/CHANGELOG.md' },
						],
					},
				],
				sidebar: {
					'/zh/guide/': [
						{
							text: '指南',
							items: [
								{ text: '快速上手', link: '/zh/guide/getting-started' },
								{ text: '基础用法', link: '/zh/guide/basic-usage' },
								{ text: '进阶用法', link: '/zh/guide/advanced-usage' },
								{ text: '组合式函数', link: '/zh/guide/composables' },
								{ text: 'Vue 插件', link: '/zh/guide/vue-plugin' },
							],
						},
					],
					'/zh/api/': [
						{
							text: 'API 参考',
							items: [
								{ text: '概览', link: '/zh/api/' },
								{ text: 'mount()', link: '/zh/api/mount' },
								{ text: 'createMount()', link: '/zh/api/createMount' },
								{ text: 'MountInstance', link: '/zh/api/instance' },
								{ text: 'MountOptions', link: '/zh/api/options' },
								{ text: '全局函数', link: '/zh/api/global' },
								{ text: '类型', link: '/zh/api/types' },
							],
						},
					],
					'/zh/examples/': [
						{
							text: '示例',
							items: [
								{ text: '概览', link: '/zh/examples/' },
								{ text: '模态框', link: '/zh/examples/modal' },
								{ text: '确认对话框', link: '/zh/examples/confirm-dialog' },
								{ text: '消息提示', link: '/zh/examples/toast' },
								{ text: '上下文继承', link: '/zh/examples/context' },
							],
						},
					],
					'/zh/migration/': [
						{
							text: '迁移',
							items: [
								{ text: 'v3 到 v4', link: '/zh/migration/v3-to-v4' },
							],
						},
					],
				},
			},
		},
	},

	themeConfig: {
		logo: '/logo.svg',
		siteTitle: 'vue-mount-plugin',
		socialLinks: [
			{ icon: 'github', link: 'https://github.com/saqqdy/vue-mount-plugin' },
		],
		search: {
			provider: 'local',
		},
	},
})
