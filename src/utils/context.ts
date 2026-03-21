import type { App, ContextOptions, MountOptions } from '../types'

/**
 * Inherit context from parent component in Vue 2.
 * Automatically extracts router, store, i18n from parent instance.
 */
export function inheritVue2Context(parent: any, options: MountOptions): ContextOptions {
	const context = options.context || {}

	// Auto-inherit from parent component instance
	if (parent && (parent._isVue || parent.$options)) {
		return {
			router: parent.$router || context.router,
			store: parent.$store || context.store,
			i18n: parent.$i18n || context.i18n,
			route: parent.$route,
			...context,
		}
	}

	return context
}

/**
 * Inherit context from app instance in Vue 3.
 * Returns appContext for provide/inject support.
 */
export function inheritVue3Context(app: App | undefined): { appContext?: App['_context']; provides?: Record<string, unknown> } {
	if (app?._context) {
		return {
			appContext: app._context,
			provides: app._context.provides,
		}
	}

	return {}
}

/**
 * Get context from current component instance.
 * Useful for useMount composable to inherit parent context.
 */
export function getCurrentComponentContext(componentInstance: any): ContextOptions {
	if (!componentInstance) return {}

	const context: ContextOptions = {}

	// Vue 2
	if (componentInstance.$router) context.router = componentInstance.$router
	if (componentInstance.$store) context.store = componentInstance.$store
	if (componentInstance.$i18n) context.i18n = componentInstance.$i18n

	// Vue 3
	if (componentInstance.$?.appContext) {
		context.appContext = componentInstance.$.appContext
	}

	return context
}
