import type { App, ComponentPublicInstance, Ref, VNode, VNodeProps } from 'vue-demi'
import { defineAsyncComponent, h, isVue2, Vue2 } from 'vue-demi'

// ==================== Types ====================

type RenderFn = (vnode: VNode | null, container: Element | ShadowRoot) => void

export type CreateVNodeParameters = Parameters<typeof h>
export type Component = CreateVNodeParameters['0'] | (() => Promise<Component>)
export type Data = Record<string, unknown>
export type Listener = (...args: any[]) => void
export type Listeners = Record<string, Listener>

export interface Slots {
	default?: VNode | VNode[]
	[key: string]: VNode | VNode[] | undefined
}

export interface MountHooks {
	/** Callback before mount */
	onBeforeMount?: (instance: Mount) => void
	/** Callback after mount */
	onMounted?: (instance: Mount) => void
	/** Callback before unmount */
	onBeforeUnmount?: (instance: Mount) => void
	/** Callback after unmount */
	onUnmounted?: (instance: Mount) => void
}

export interface KeepAliveOptions {
	/** Enable KeepAlive */
	enabled?: boolean
	/** Components to include */
	include?: string | RegExp | string[]
	/** Components to exclude */
	exclude?: string | RegExp | string[]
	/** Max cache count */
	max?: number
}

export interface Options<TContext = Record<string, unknown>> extends MountHooks {
	/** Props data */
	props?: (Data & VNodeProps) | null
	/** Children nodes */
	children?: unknown
	/** Patch flag */
	patchFlag?: number
	/** Dynamic props */
	dynamicProps?: string[] | null
	/** Is block node */
	isBlockNode?: boolean
	/** Mount target */
	target?: Element | ShadowRoot | string
	/** Container tag name */
	tagName?: string
	/** Vue 3 app instance */
	app?: App
	/** Vue 2 context */
	context?: TContext & { router?: unknown; store?: unknown; i18n?: unknown }
	/** Parent component instance */
	parent?: unknown
	/** Event listeners */
	listeners?: Listeners
	/** Event listeners (alias) */
	on?: Listeners
	/** Slots */
	slots?: Slots
	/** Component instance ref */
	ref?: Ref<ComponentPublicInstance | null>
	/** KeepAlive options */
	keepAlive?: KeepAliveOptions | boolean
}

// ==================== Module State ====================

let cachedRender: RenderFn | undefined,
	instanceId = 0

const instances: Set<Mount> = new Set()

// ==================== Helper Functions ====================

/** Check if running in Node.js environment */
function isNodeEnv(): boolean {
	return typeof process !== 'undefined' && !!process.versions?.node
}

/** Dynamic import that works in both Node.js and browser */
function dynamicImportVue(): Promise<any> {
	if (isNodeEnv()) {
		return import('vue')
	}

	// Use Function constructor for browser to prevent bundlers from transforming
	// eslint-disable-next-line no-new-func
	const dynamicImport = new Function('module', 'return import(module)')

	return dynamicImport('vue')
}

/**
 * Get Vue 3 render function
 * Uses dynamic import to avoid bundling in Vue 2 environment
 */
function getRender(): RenderFn | undefined {
	if (isVue2) return undefined
	if (cachedRender) return cachedRender

	dynamicImportVue().then((vue: any) => {
		cachedRender = vue.render
	})

	return cachedRender
}

/** Capitalize first letter */
function capitalize(str: string): string {
	return str.charAt(0).toUpperCase() + str.slice(1)
}

/** Resolve target element from string or Element */
function resolveTarget(target: Element | ShadowRoot | string | undefined): Element | ShadowRoot | null {
	if (!target) return null

	return typeof target === 'string' ? document.querySelector(target) : target
}

// ==================== Main Class ====================

class Mount {
	/** VNode instance */
	vNode: VNode | typeof Vue2 | null = null
	/** Mount target */
	target!: Element | ShadowRoot
	/** Options */
	options: Options = {}
	/** Instance ID */
	readonly id: number
	/** Component instance */
	componentInstance: ComponentPublicInstance | null = null

	private seed = 1
	private _autoCreatedTarget = false
	private _component: Component
	private _originalTarget: Element | ShadowRoot | null = null

	constructor(component: Component, options: Options = {}) {
		if (typeof document === 'undefined') {
			throw new TypeError('This plugin works in browser')
		}

		this.id = ++instanceId
		this._component = component
		this.options = options

		this._initTarget(options)
		instances.add(this)

		// Handle async components
		if (typeof component === 'function' && component.constructor.name === 'AsyncFunction') {
			component = defineAsyncComponent(component as any)
		}

		this.vNode = this._createVM(component, options)
	}

	// ==================== Private Methods ====================

	/** Initialize target element */
	private _initTarget(options: Options): void {
		const specifiedTarget = resolveTarget(options.target)

		if (specifiedTarget) {
			if (isVue2) {
				// Vue 2: create wrapper to prevent $mount from replacing target
				const wrapper = document.createElement('div')

				wrapper.setAttribute('data-mount-wrapper', String(this.id))
				this.target = wrapper
				this._autoCreatedTarget = true
				this._originalTarget = specifiedTarget
			} else {
				this.target = specifiedTarget
			}
		} else {
			this.target = document.createElement(options.tagName || 'div')
			this._autoCreatedTarget = true
		}
	}

	/** Create VNode or Vue 2 instance */
	private _createVM(
		component: Component,
		{ props, children, app, parent, listeners, on, slots }: Options = {},
	): VNode | typeof Vue2 {
		const mergedListeners = { ...listeners, ...on }

		if (isVue2) {
			return this._createVue2Instance(component, props, parent, mergedListeners)
		}

		return this._createVue3VNode(component, props, children, app, slots, mergedListeners)
	}

	/** Create Vue 2 component instance */
	private _createVue2Instance(
		component: Component,
		props: Data | null | undefined,
		parent: unknown,
		mergedListeners: Listeners,
	): typeof Vue2 {
		const VueConstructor = Vue2 as any
		const componentAny = component as any

		// Get component options (handle async components and Vue.extend constructors)
		let componentOptions = componentAny

		if (typeof componentAny === 'function' && componentAny.cid !== undefined) {
			componentOptions = componentAny
		} else if (componentAny.options) {
			componentOptions = componentAny.options
		}

		// Create and configure instance
		const ComponentConstructor = VueConstructor.extend(componentOptions)
		const instance = new ComponentConstructor({
			propsData: props || {},
			parent: parent as any,
		})

		// Bind event listeners
		if (mergedListeners) {
			Object.entries(mergedListeners).forEach(([event, handler]) => {
				instance.$on(event, handler)
			})
		}

		;(instance as any).id = `mount-plugin-${this.seed++}`

		return instance as typeof Vue2
	}

	/** Create Vue 3 VNode */
	private _createVue3VNode(
		component: Component,
		props: Data | null | undefined,
		children: unknown,
		app: App | undefined,
		slots: Slots | undefined,
		mergedListeners: Listeners,
	): VNode {
		// Merge props and event listeners (close -> onClose)
		const mergedProps = {
			...props,
			...Object.fromEntries(
				Object.entries(mergedListeners).map(([event, handler]) => [
					`on${capitalize(event)}`,
					handler,
				]),
			),
		}

		// Handle slots
		const mergedChildren = slots ? { ...slots, ...(children ? { default: children } : {}) } : children

		const vNode = h(component as any, mergedProps, mergedChildren as any)

		// Set app context
		if (app?._context) {
			;(vNode as VNode).appContext = app._context
		}

		return vNode
	}

	/** Append target element to DOM */
	private _appendTargetToDOM(): void {
		if (!this.options.target) {
			document.body.appendChild(this.target)
		} else if (isVue2 && this._originalTarget) {
			if (!this._originalTarget.contains(this.target)) {
				this._originalTarget.appendChild(this.target)
			}
		}
	}

	/** Mount for Vue 2 */
	private _mountVue2(): void {
		const vm = this.vNode as any

		vm?.$mount(this.target)

		// Update target to the actual $el after mount
		// Vue 2 $mount replaces the target element with component's $el
		if (vm?.$el) {
			this.target = vm.$el
		}

		this.componentInstance = vm as ComponentPublicInstance
	}

	/** Mount for Vue 3 */
	private _mountVue3(): void {
		const renderFn = getRender()

		if (renderFn) {
			renderFn(this.vNode as VNode, this.target)
		} else {
			// Render not cached: dynamically import and render
			const vNode = this.vNode as VNode
			const target = this.target

			dynamicImportVue().then((vue: any) => {
				cachedRender = vue.render
				if (cachedRender && vNode) {
					cachedRender(vNode, target)
				}
			})
		}

		this.componentInstance = (this.vNode as VNode).component?.proxy ?? null
	}

	/** Unmount for Vue 2 */
	private _unmountVue2(): void {
		const vm = this.vNode as any

		vm?.$destroy()

		if (this._autoCreatedTarget && this.target?.parentNode) {
			this.target.parentNode.removeChild(this.target)
		}
	}

	/** Unmount for Vue 3 */
	private _unmountVue3(): void {
		const renderFn = getRender()

		if (renderFn) {
			renderFn(null, this.target)
		}

		if (this._autoCreatedTarget && document.body.contains(this.target)) {
			document.body.removeChild(this.target)
		}
	}

	/** Update target for Vue 2 wrapper pattern */
	private _updateTargetForVue2(specifiedTarget: Element | ShadowRoot): void {
		const wrapper = document.createElement('div')

		wrapper.setAttribute('data-mount-wrapper', String(this.id))
		this.target = wrapper
		this._autoCreatedTarget = true
		this._originalTarget = specifiedTarget
	}

	// ==================== Public Methods ====================

	/** Mount the component */
	mount(): this {
		// Recreate VNode if options were updated via chained API
		if (this.options.props || this.options.listeners || this.options.on || this.options.slots) {
			this.vNode = this._createVM(this._component, this.options)
		}

		this.options.onBeforeMount?.(this)
		this._appendTargetToDOM()

		if (isVue2) {
			this._mountVue2()
		} else {
			this._mountVue3()
		}

		if (this.options.ref) {
			this.options.ref.value = this.componentInstance
		}

		this.options.onMounted?.(this)

		return this
	}

	/** Unmount the component */
	unmount(): void {
		this.options.onBeforeUnmount?.(this)

		if (this.options.ref) {
			this.options.ref.value = null
		}

		if (isVue2) {
			this._unmountVue2()
		} else {
			this._unmountVue3()
		}

		this.vNode = null
		this.target = null as unknown as Element | ShadowRoot
		this.componentInstance = null
		instances.delete(this)

		this.options.onUnmounted?.(this)
	}

	/** Unmount the component (alias) */
	destroy = this.unmount

	/** Unmount the component (alias) */
	remove = this.unmount

	// ==================== Chained API ====================

	/** Set props */
	setProps(props: Data): this {
		this.options = { ...this.options, props: { ...this.options.props, ...props } }

		return this
	}

	/** Set event listeners */
	setListeners(listeners: Listeners): this {
		this.options = { ...this.options, listeners: { ...this.options.listeners, ...listeners } }

		return this
	}

	/** Set event listeners (alias) */
	on = this.setListeners

	/** Set slots */
	setSlots(slots: Slots): this {
		this.options = { ...this.options, slots: { ...this.options.slots, ...slots } }

		return this
	}

	/** Set target */
	setTarget(target: Element | ShadowRoot | string): this {
		this.options = { ...this.options, target }
		const specifiedTarget = resolveTarget(target)

		if (specifiedTarget) {
			if (isVue2) {
				this._updateTargetForVue2(specifiedTarget)
			} else {
				this.target = specifiedTarget
				this._autoCreatedTarget = false
			}
		}

		return this
	}

	/** Set lifecycle hooks */
	setHooks(hooks: MountHooks): this {
		this.options = { ...this.options, ...hooks }

		return this
	}

	// ==================== Static Methods ====================

	/** Get all active instances */
	static get instances(): Mount[] {
		return Array.from(instances)
	}

	/** Unmount all instances */
	static unmountAll(): void {
		instances.forEach(instance => instance.unmount())
	}

	/** Unmount all instances (alias) */
	static destroyAll = Mount.unmountAll

	/** Get instance by ID */
	static getById(id: number): Mount | undefined {
		return Array.from(instances).find(instance => instance.id === id)
	}
}

export default Mount
