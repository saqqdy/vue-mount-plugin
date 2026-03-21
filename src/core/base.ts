import type { ComponentPublicInstance, LifecycleHooks, Listener, MountInstance, MountOptions, Slots } from '../types'
import { getSingletonKey, removeSingleton, setSingleton } from '../composables/useSingleton'
import { mergeWithGlobalConfig } from '../config'
import { appendTo, createElement, isInDOM, removeElement, resolveTarget, setZIndex } from '../utils/dom'
import { createInstanceId, EventEmitter, eventToPropName } from '../utils/events'

/** All active mount instances */
const instances = new Set<MountBase>()

/**
 * Abstract base class for Mount implementations.
 * Provides common functionality for both Vue 2 and Vue 3.
 */
export abstract class MountBase implements MountInstance {
	// ========== Public Properties ==========

	/** Unique instance ID */
	readonly id: string

	/** Mount options (merged with global config) */
	options: MountOptions

	/** Whether the component is currently mounted */
	mounted: boolean = false

	/** DOM element */
	el: HTMLElement | null = null

	/** Vue component instance */
	abstract vm: ComponentPublicInstance | null

	// ========== Protected State ==========

	protected _eventEmitter = new EventEmitter()
	protected _promise: Promise<any>
	protected _resolve!: (value: any) => void
	protected _reject!: (error: any) => void
	protected _component: any
	protected _autoCreatedTarget = false
	protected _hidden = false
	protected _destroyed = false
	protected _resolved = false
	protected _singletonKey: string | symbol | undefined

	constructor(component: any, options: MountOptions = {}) {
		this.id = createInstanceId()
		this._component = component
		this.options = mergeWithGlobalConfig(options)

		// Initialize Promise for async/await support
		this._promise = new Promise((resolve, reject) => {
			this._resolve = resolve
			this._reject = reject
		})

		// Setup singleton if specified
		this._singletonKey = getSingletonKey(component, options.singleton)
		if (this._singletonKey) {
			setSingleton(this._singletonKey, this)
		}

		// Register to global instances set
		instances.add(this)
	}

	// ========== Abstract Methods ==========

	/** Create Vue instance - implemented by subclass */
	protected abstract _createVM(): void

	/** Mount to DOM - implemented by subclass */
	protected abstract _mountVM(): void

	/** Unmount from DOM - implemented by subclass */
	protected abstract _unmountVM(): void

	/** Update props - implemented by subclass */
	protected abstract _updateVM(): void

	// ========== Public API ==========

	/**
	 * Show/mount the component.
	 * @returns this (for chaining)
	 */
	show(): this {
		if (this.mounted && !this._hidden) return this

		this.options.onBeforeMount?.(this)
		this._ensureElement()
		this._mountVM()

		if (this.options.zIndex && this.el) {
			setZIndex(this.el, this.options.zIndex)
		}

		this.mounted = true
		this._hidden = false

		this.options.onMounted?.(this)
		this.emit('show', this)

		return this
	}

	/**
	 * Hide the component (keeps instance for later use).
	 * @returns this (for chaining)
	 */
	hide(): this {
		if (!this.mounted || this._hidden) return this

		this.emit('beforeHide', this)

		if (this.el && isInDOM(this.el)) {
			removeElement(this.el)
		}

		this._hidden = true
		this.emit('hide', this)

		return this
	}

	/**
	 * Unmount and destroy the component completely.
	 */
	unmount(): void {
		if (this._destroyed) return

		this._destroyed = true

		if (this.mounted || this._hidden) {
			this.options.onBeforeUnmount?.(this)
		}

		this._eventEmitter.emit('beforeUnmount', this)
		this._unmountVM()

		if (this._autoCreatedTarget && this.el) {
			removeElement(this.el)
		}

		this.mounted = false
		this._hidden = false
		this.el = null
		this.vm = null

		instances.delete(this)

		if (this._singletonKey) {
			removeSingleton(this._singletonKey)
		}

		this.options.onUnmounted?.(this)
		this._eventEmitter.clear()
	}

	/** Alias for unmount */
	destroy = this.unmount

	/** Alias for unmount */
	remove = this.unmount

	/**
	 * Update component props dynamically.
	 * @returns this (for chaining)
	 */
	setProps(props: Record<string, any>): this {
		this.options = {
			...this.options,
			props: { ...this.options.props, ...props } as any,
		}

		if (this.mounted) {
			this._updateVM()
		}

		return this
	}

	/**
	 * Add event listener.
	 * @returns this (for chaining)
	 */
	on(event: string, handler: Listener): this {
		this._eventEmitter.on(event, handler)

		return this
	}

	/**
	 * Remove event listener.
	 * @returns this (for chaining)
	 */
	off(event: string, handler?: Listener): this {
		this._eventEmitter.off(event, handler)

		return this
	}

	/**
	 * Emit event to listeners.
	 * @returns this (for chaining)
	 */
	emit(event: string, ...args: any[]): this {
		if (this._destroyed) return this
		this._eventEmitter.emit(event, ...args)

		return this
	}

	/**
	 * Wait for close event (Promise support).
	 * @example
	 * const result = await mount(ConfirmDialog, { ... })
	 */
	then<TResult = void>(resolve: (value: any) => TResult): Promise<TResult> {
		return this._promise.then(resolve)
	}

	/** Catch promise rejection */
	catch<TResult = never>(reject: (error: any) => TResult): Promise<any> {
		return this._promise.catch(reject)
	}

	/** Finally handler */
	finally(onFinally: () => void): Promise<any> {
		return this._promise.finally(onFinally)
	}

	/**
	 * Set target element for mounting.
	 * @returns this (for chaining)
	 */
	setTarget(target: string | Element | ShadowRoot): this {
		this.options.target = target

		return this
	}

	/**
	 * Set lifecycle hooks.
	 * @returns this (for chaining)
	 */
	setHooks(hooks: LifecycleHooks): this {
		this.options = { ...this.options, ...hooks }

		return this
	}

	/**
	 * Set slots.
	 * @returns this (for chaining)
	 */
	setSlots(slots: Slots): this {
		this.options = { ...this.options, slots: { ...this.options.slots, ...slots } }

		return this
	}

	// ========== Protected Methods ==========

	/** Ensure DOM element exists */
	protected _ensureElement(): void {
		if (this.el) return

		const target = resolveTarget(this.options.target)

		if (target instanceof Element) {
			this.el = target as HTMLElement
			this._autoCreatedTarget = false
		} else {
			this.el = createElement(this.options.tagName || 'div', {
				'data-mount-id': this.id,
			})
			this._autoCreatedTarget = true
		}
	}

	/** Append element to DOM */
	protected _appendElementToDOM(): void {
		if (!this.el || !this._autoCreatedTarget) return
		appendTo(this.el, null)
	}

	/** Resolve promise (only once) */
	protected _resolvePromise(value?: any): void {
		if (this._resolved) return
		this._resolved = true
		this._resolve(value)
	}

	/** Reject promise */
	protected _rejectPromise(error?: any): void {
		this._reject(error)
	}

	/**
	 * Merge listeners with props for Vue 3.
	 * Converts 'close' -> 'onClose', 'custom-event' -> 'onCustomEvent'
	 */
	protected _mergeListenersToProps(listeners: Record<string, Listener>): Record<string, any> {
		const result: Record<string, any> = {}

		Object.entries(listeners).forEach(([event, handler]) => {
			result[eventToPropName(event)] = (...args: any[]) => {
				if (typeof handler === 'function') {
					handler(...args)
				}
			}
		})

		return result
	}

	// ========== Static Methods ==========

	/** Get all active instances */
	static get instances(): MountBase[] {
		return Array.from(instances)
	}

	/** Unmount all instances */
	static unmountAll(): void {
		instances.forEach(instance => instance.unmount())
	}

	/** Get instance by ID */
	static getById(id: string): MountBase | undefined {
		return Array.from(instances).find(instance => instance.id === id)
	}
}

// ========== Exported Functions ==========

/** Get all active instances */
export function getInstances(): MountBase[] {
	return Array.from(instances)
}

/** Unmount all instances */
export function unmountAll(): void {
	MountBase.unmountAll()
}

/** Get instance by ID */
export function getInstanceById(id: string): MountBase | undefined {
	return MountBase.getById(id)
}
