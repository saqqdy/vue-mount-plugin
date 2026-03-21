import type { App, AppContext, ComponentPublicInstance, Ref, VNode, VNodeProps } from 'vue-demi'

// ==================== Basic Types ====================

export type Data = Record<string, unknown>
export type Listener = (...args: any[]) => void
export type Listeners = Record<string, Listener | Listener[]>

export interface Slots {
	default?: VNode | VNode[]
	[key: string]: VNode | VNode[] | undefined
}

// ==================== Lifecycle Hooks ====================

export interface LifecycleHooks {
	/** Callback before mount */
	onBeforeMount?: (instance: MountInstance) => void
	/** Callback after mount */
	onMounted?: (instance: MountInstance) => void
	/** Callback before unmount */
	onBeforeUnmount?: (instance: MountInstance) => void
	/** Callback after unmount */
	onUnmounted?: (instance: MountInstance) => void
}

// ==================== Transition Options ====================

export interface TransitionOptions {
	/** Transition name */
	name?: string
	/** Apply transition on initial render */
	appear?: boolean
	/** Use CSS transitions */
	css?: boolean
	/** Enter class name */
	enterClass?: string
	/** Leave class name */
	leaveClass?: string
	/** Enter active class name */
	enterActiveClass?: string
	/** Leave active class name */
	leaveActiveClass?: string
	/** Enter to class name */
	enterToClass?: string
	/** Leave to class name */
	leaveToClass?: string
}

// ==================== KeepAlive Options ====================

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

// ==================== Context Options ====================

export interface ContextOptions {
	/** Vue Router instance */
	router?: unknown
	/** Vuex/Pinia store instance */
	store?: unknown
	/** Vue I18n instance */
	i18n?: unknown
	/** Other context properties */
	[key: string]: unknown
}

// ==================== Mount Options ====================

export interface MountOptions<TContext = ContextOptions> extends LifecycleHooks {
	// ========== Basic Configuration ==========
	/** Mount target container, supports selector or Element */
	target?: string | Element | ShadowRoot | null
	/** Container tag name, default 'div' */
	tagName?: string
	/** Whether to replace target content, default false */
	replace?: boolean

	// ========== Component Configuration ==========
	/** Props to pass to the component */
	props?: (Data & VNodeProps) | null
	/** Children nodes */
	children?: unknown
	/** Patch flag for VNode optimization */
	patchFlag?: number
	/** Dynamic props for VNode optimization */
	dynamicProps?: string[] | null
	/** Is block node flag */
	isBlockNode?: boolean

	// ========== Event Configuration ==========
	/** Event listeners */
	listeners?: Listeners
	/** Event listeners (alias for listeners) */
	on?: Listeners

	// ========== Slots Configuration ==========
	/** Slots content */
	slots?: Slots

	// ========== Context Configuration ==========
	/** Vue 3 app instance */
	app?: App
	/** Vue 2 context (router, store, i18n) */
	context?: TContext
	/** Parent component instance (for context inheritance) */
	parent?: unknown
	/** Component instance ref */
	ref?: Ref<ComponentPublicInstance | null>

	// ========== Advanced Configuration ==========
	/** z-index level */
	zIndex?: number
	/** Singleton mode - only one instance per key */
	singleton?: boolean | string
	/** Animation class or options */
	transition?: string | TransitionOptions
	/** Delay mount time (ms) */
	delay?: number
	/** KeepAlive options */
	keepAlive?: KeepAliveOptions | boolean
}

// ==================== Mount Instance ====================

export interface MountInstance<T = ComponentPublicInstance> {
	// ========== Properties ==========
	/** Vue component instance */
	vm: T | null
	/** DOM element */
	el: HTMLElement | null
	/** Whether mounted */
	mounted: boolean
	/** Unique ID */
	id: string
	/** Options */
	options: MountOptions

	// ========== Methods ==========
	/** Update props */
	setProps: (props: Partial<Data>) => MountInstance<T>
	/** Show/mount the component */
	show: () => MountInstance<T>
	/** Hide the component (keep instance) */
	hide: () => MountInstance<T>
	/** Unmount and destroy */
	unmount: () => void
	/** Add event listener */
	on: (event: string, handler: Listener) => MountInstance<T>
	/** Remove event listener */
	off: (event: string, handler?: Listener) => MountInstance<T>
	/** Emit event */
	emit: (event: string, ...args: any[]) => MountInstance<T>
	/** Wait for close event (Promise support) */
	then: <TResult = void>(resolve: (value: any) => TResult) => Promise<TResult>
	/** Set target */
	setTarget: (target: string | Element | ShadowRoot) => MountInstance<T>
	/** Set lifecycle hooks */
	setHooks: (hooks: LifecycleHooks) => MountInstance<T>
	/** Set slots */
	setSlots: (slots: Slots) => MountInstance<T>
}

// ==================== Global Configuration ====================

export interface GlobalConfig extends Partial<MountOptions> {
	/** Default z-index */
	zIndex?: number
	/** Default container */
	container?: string | Element | null
	/** Default transition */
	transition?: string | TransitionOptions
	/** Global context */
	context?: ContextOptions
	/** Plugin installed flag */
	installed?: boolean
}

// ==================== Plugin Types ====================

export type Component = any // Component type that works with both Vue 2 and Vue 3

export interface MountPluginOptions extends GlobalConfig {
	/** Plugin name for global property */
	name?: string
}

// ==================== Export Types ====================

export type { App, AppContext, ComponentPublicInstance, Ref, VNode }
