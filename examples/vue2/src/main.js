import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import VueI18n from 'vue-i18n'
import App from './App.vue'
import { MountPlugin } from 'vue-mount-plugin'

// Install Vue plugins
Vue.use(VueRouter)
Vue.use(Vuex)
Vue.use(VueI18n)

Vue.config.productionTip = false

// Setup Router
const router = new VueRouter({
	mode: 'hash',
	routes: [
		{ path: '/', component: { template: '<div>Home</div>' } },
	],
})

// Setup Store
const store = new Vuex.Store({
	state: {
		count: 0,
	},
	mutations: {
		increment(state) {
			state.count++
		},
	},
})

// Setup I18n
const i18n = new VueI18n({
	locale: 'en',
	messages: {
		en: {
			hello: 'Hello World',
		},
	},
})

// Install mount plugin
Vue.use(MountPlugin, {
	zIndex: 2000,
})

new Vue({
	router,
	store,
	i18n,
	render: h => h(App),
}).$mount('#app')
