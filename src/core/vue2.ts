import type { ComponentPublicInstance, MountOptions } from '../types'
import { isVue2, Vue2 } from 'vue-demi'
import { inheritVue2Context } from '../utils/context'
import { MountBase } from './base'

/**
 * Vue 2 implementation of Mount.
 * Uses Vue.extend() to create component instances.
 */
export class MountVue2 extends MountBase {
	vm: ComponentPublicInstance | null = null
	private _vue2Instance: any = null

	constructor(component: any, options: MountOptions = {}) {
		super(component, options)

		if (!isVue2) {
			throw new Error('MountVue2 can only be used with Vue 2')
		}

		this._createVM()
	}

	/** Create Vue 2 instance using Vue.extend() */
	protected _createVM(): void {
		const VueConstructor = Vue2 as any
		const { props, parent, listeners, on } = this.options

		// Merge listeners
		const mergedListeners = { ...listeners, ...on }

		// Inherit context (router, store, i18n) from parent
		const context = inheritVue2Context(parent, this.options)

		// Get component options (handle both SFC and inline components)
		const componentOptions = this._component.options || this._component

		// Create Vue 2 constructor and instance
		const ComponentConstructor = VueConstructor.extend(componentOptions)
		const instance = new ComponentConstructor({
			propsData: props || {},
			parent: parent as any,
		})

		// Inject context (Vue.extend doesn't support these as constructor options)
		this._injectContext(instance, context)

		// Bind event listeners
		this._bindListeners(instance, mergedListeners)

		// Intercept $emit to forward to EventEmitter
		this._interceptEmit(instance)

		// Auto-handle close event
		instance.$on('close', (value: any) => {
			this._resolvePromise(value)
			this.unmount()
		})

		instance._mountId = this.id
		this._vue2Instance = instance
	}

	/** Mount Vue 2 instance to DOM */
	protected _mountVM(): void {
		if (!this._vue2Instance) return

		this._ensureElement()
		this._appendElementToDOM()

		this._vue2Instance.$mount(this.el)

		// Update el reference after mount
		if (this._vue2Instance.$el) {
			this.el = this._vue2Instance.$el as HTMLElement
		}

		this.vm = this._vue2Instance as ComponentPublicInstance
		this.mounted = true
	}

	/** Unmount Vue 2 instance */
	protected _unmountVM(): void {
		if (this._vue2Instance) {
			this._vue2Instance.$destroy()
			this._vue2Instance = null
		}
		this.vm = null
		this.mounted = false
	}

	/** Update Vue 2 instance props (limited support) */
	protected _updateVM(): void {
		// Vue 2 doesn't support reactive prop updates like Vue 3
		if (this._vue2Instance && this.options.props) {
			Object.assign(this._vue2Instance.$props, this.options.props)
		}
	}

	// ========== Private Helpers ==========

	/** Inject router, store, i18n into instance */
	private _injectContext(instance: any, context: { router?: any; store?: any; i18n?: any }): void {
		if (context.router) {
			Object.defineProperty(instance, '$router', {
				get: () => context.router,
				configurable: true,
			})
		}
		if (context.store) {
			Object.defineProperty(instance, '$store', {
				get: () => context.store,
				configurable: true,
			})
		}
		if (context.i18n) {
			Object.defineProperty(instance, '$i18n', {
				get: () => context.i18n,
				configurable: true,
			})
		}
	}

	/** Bind event listeners to instance */
	private _bindListeners(instance: any, listeners: Record<string, any>): void {
		Object.entries(listeners).forEach(([event, handler]) => {
			if (Array.isArray(handler)) {
				handler.forEach(h => instance.$on(event, h))
			} else {
				instance.$on(event, handler)
			}
		})
	}

	/** Intercept $emit to forward events to EventEmitter */
	private _interceptEmit(instance: any): void {
		const originalEmit = instance.$emit.bind(instance)

		instance.$emit = (event: string, ...args: any[]) => {
			// Forward to MountInstance EventEmitter for instance.on() support
			this._eventEmitter.emit(event, ...args)

			// Also call original $emit
			return originalEmit(event, ...args)
		}
	}
}
