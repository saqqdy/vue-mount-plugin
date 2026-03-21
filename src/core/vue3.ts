import type { MountOptions } from '../types'
import { type ComponentPublicInstance, h, isVue2, type VNode } from 'vue-demi'
import { MountBase } from './base'

// Cached render function (loaded dynamically)
let cachedRender: ((vnode: VNode | null, container: Element | ShadowRoot) => void) | undefined

/** Get Vue 3 render function (lazy loaded) */
async function getRender(): Promise<typeof cachedRender> {
	if (cachedRender) return cachedRender

	const vue = await import('vue')

	cachedRender = vue.render

	return cachedRender
}

/**
 * Vue 3 implementation of Mount.
 * Uses h() and render() for component creation.
 */
export class MountVue3 extends MountBase {
	vm: ComponentPublicInstance | null = null
	private _vNode: VNode | null = null

	constructor(component: any, options: MountOptions = {}) {
		super(component, options)

		if (isVue2) {
			throw new Error('MountVue3 can only be used with Vue 3')
		}

		this._createVM()
	}

	/** Create Vue 3 VNode */
	protected _createVM(): void {
		const { props, children, app, listeners, on, slots } = this.options

		// Merge listeners
		const mergedListeners = { ...listeners, ...on } as Record<string, any>

		// Auto-handle close event
		const onClose = (value?: any): void => {
			this._resolvePromise(value)
			this.unmount()
		}

		// Merge props and listeners
		const mergedProps = {
			...props,
			...this._mergeListenersToProps(mergedListeners),
			onClose,
		}

		// Handle slots
		const mergedChildren = slots ? { ...slots, ...(children ? { default: children } : {}) } : children

		// Create VNode
		const vNode = h(this._component, mergedProps, mergedChildren as any)

		// Set app context for provide/inject inheritance
		if (app?._context) {
			;(vNode as VNode).appContext = app._context
		}

		this._vNode = vNode
	}

	/** Mount Vue 3 VNode to DOM */
	protected _mountVM(): void {
		if (!this._vNode) {
			this._createVM()
		}

		this._ensureElement()
		this._appendElementToDOM()

		getRender().then(render => {
			if (!render || !this._vNode || !this.el) return

			render(this._vNode, this.el)
			this.vm = (this._vNode as VNode).component?.proxy ?? null

			// Intercept emit to forward to EventEmitter
			this._interceptEmit()
		})

		this.mounted = true
	}

	/** Unmount Vue 3 VNode */
	protected _unmountVM(): void {
		if (this._vNode) {
			getRender().then(render => {
				if (render && this.el) {
					render(null, this.el)
				}
			})
			this._vNode = null
		}
		this.vm = null
		this.mounted = false
	}

	/** Update Vue 3 VNode with new props */
	protected _updateVM(): void {
		this._createVM()

		if (this.mounted && this.el && this._vNode) {
			getRender().then(render => {
				if (render) {
					render(this._vNode, this.el!)
					this.vm = (this._vNode as VNode).component?.proxy ?? null
				}
			})
		}
	}

	/** Intercept component emit to forward to EventEmitter */
	private _interceptEmit(): void {
		const component = (this._vNode as VNode)?.component

		if (!component) return

		const originalEmit = component.emit

		component.emit = (event: string, ...args: any[]) => {
			// Forward to EventEmitter for instance.on() support
			this._eventEmitter.emit(event, ...args)

			// Call original emit
			return originalEmit.call(component, event, ...args)
		}
	}
}
