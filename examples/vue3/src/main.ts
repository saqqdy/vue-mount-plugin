import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import { MountPlugin } from 'vue-mount-plugin'

// Setup Router
const router = createRouter({
	history: createWebHashHistory(),
	routes: [
		{ path: '/', component: { template: '<div>Home</div>' } },
	],
})

// Setup Pinia
const pinia = createPinia()

// Setup I18n
const i18n = createI18n({
	legacy: false,
	locale: 'en',
	messages: {
		en: {
			hello: 'Hello World',
		},
	},
})

const app = createApp(App)

// Install plugins
app.use(router)
app.use(pinia)
app.use(i18n)
app.use(MountPlugin, {
	zIndex: 2000,
})

// Provide for context inheritance in dynamically mounted components
app.provide('app', app)
app.provide('router', router)
app.provide('pinia', pinia)
app.provide('i18n', i18n)

app.mount('#app')
