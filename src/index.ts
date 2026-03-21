import type { Component, MountInstance, MountOptions, MountPluginOptions } from './types'
import { isVue2, type Plugin } from 'vue-demi'
import { setGlobalConfig } from './config'
import { getInstanceById, getInstances } from './core/base'
import { MountVue2 } from './core/vue2'
import { MountVue3 } from './core/vue3'

// Re-export all modules
export * from './composables'
export * from './config'
export * from './core'
export * from './types'
export * from './utils'

/**
 * Create a Mount instance without showing it.
 * Use this for manual control over show/hide/unmount lifecycle.
 *
 * @param component - Vue component to mount
 * @param options - Mount options
 * @returns Mount instance (not yet shown)
 *
 * @example
 * ```ts
 * const instance = createMount(Modal, { props: { title: 'Hello' } })
 * instance.show()    // Display the component
 * instance.hide()    // Hide but keep instance
 * instance.unmount() // Destroy completely
 * ```
 */
export function createMount<T = any>(component: Component, options: MountOptions = {}): MountInstance<T> {
	if (isVue2) {
		return new MountVue2(component, options) as unknown as MountInstance<T>
	}

	return new MountVue3(component, options) as unknown as MountInstance<T>
}

/**
 * Mount a component and immediately show it.
 * This is the most common usage pattern.
 *
 * @param component - Vue component to mount
 * @param options - Mount options
 * @returns Mount instance (already shown)
 *
 * @example
 * ```ts
 * // Basic usage
 * mount(Modal, { props: { title: 'Hello' } })
 *
 * // With Promise support
 * const result = await mount(ConfirmDialog, { props: { message: 'Are you sure?' } })
 *
 * // Singleton mode
 * mount(Toast, { singleton: true, props: { message: 'Hello' } })
 * ```
 */
export function mount<T = any>(component: Component, options: MountOptions = {}): MountInstance<T> {
	const instance = createMount<T>(component, options)

	return instance.show()
}

/**
 * Vue plugin for adding global $show method.
 *
 * @example
 * ```ts
 * // Vue 2
 * Vue.use(MountPlugin, { zIndex: 2000 })
 * this.$show(Modal, { props: { title: 'Hello' } })
 *
 * // Vue 3
 * app.use(MountPlugin, { zIndex: 2000 })
 * // Or use mount() directly (recommended)
 * ```
 */
export const MountPlugin: Plugin = {
	install(app: any, options: MountPluginOptions = {}) {
		setGlobalConfig({
			...options,
			installed: true,
		})

		const name = options.name || '$show'

		if (isVue2) {
			app.prototype[name] = mount
		} else {
			app.config.globalProperties[name] = mount
		}
	},
}

/**
 * Check if a component instance is currently mounted.
 *
 * @param id - Instance ID
 * @returns Whether the instance is mounted
 */
export function isMounted(id: string): boolean {
	const instance = getInstanceById(id)

	return instance?.mounted ?? false
}

/**
 * Get all active instance IDs.
 *
 * @returns Array of instance IDs
 */
export function getActiveInstanceIds(): string[] {
	return getInstances().map(instance => instance.id)
}
