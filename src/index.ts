import type { App, ComponentPublicInstance, Ref, VNode, VNodeProps } from 'vue-demi'
import { createVNode, defineAsyncComponent, isVue2, render, Vue2 } from 'vue-demi'

export type CreateVNodeParameters = Parameters<typeof createVNode>
export type Component = CreateVNodeParameters['0'] | (() => Promise<Component>)
export type Data = Record<string, unknown>
export type Listener = (...args: any[]) => void
export type Listeners = Record<string, Listener>

export interface Slots {
	default?: VNode | VNode[]
	[key: string]: VNode | VNode[] | undefined
}

export interface MountHooks {
	/** 挂载前回调 / Callback before mount */
	onBeforeMount?: (instance: Mount) => void
	/** 挂载后回调 / Callback after mount */
	onMounted?: (instance: Mount) => void
	/** 卸载前回调 / Callback before unmount */
	onBeforeUnmount?: (instance: Mount) => void
	/** 卸载后回调 / Callback after unmount */
	onUnmounted?: (instance: Mount) => void
}

export interface KeepAliveOptions {
	/** 是否启用 KeepAlive / Enable KeepAlive */
	enabled?: boolean
	/** 包含的组件 / Components to include */
	include?: string | RegExp | string[]
	/** 排除的组件 / Components to exclude */
	exclude?: string | RegExp | string[]
	/** 最大缓存数 / Max cache count */
	max?: number
}

export interface Options<TContext = Record<string, unknown>> extends MountHooks {
	/** props 数据 / Props data */
	props?: (Data & VNodeProps) | null
	/** 子节点 / Children nodes */
	children?: unknown
	/** 补丁标志 / Patch flag */
	patchFlag?: number
	/** 动态 props / Dynamic props */
	dynamicProps?: string[] | null
	/** 是否为块节点 / Is block node */
	isBlockNode?: boolean
	/** 挂载目标 / Mount target */
	target?: Element | ShadowRoot | string
	/** 容器标签名 / Container tag name */
	tagName?: string
	/** Vue 3 应用实例 / Vue 3 app instance */
	app?: App
	/** Vue 2 上下文 / Vue 2 context */
	context?: TContext & {
		router?: unknown
		store?: unknown
		i18n?: unknown
	}
	/** 父组件实例 / Parent component instance */
	parent?: unknown
	/** 事件监听器 / Event listeners */
	listeners?: Listeners
	/** 事件监听器（别名） / Event listeners (alias) */
	on?: Listeners
	/** 插槽 / Slots */
	slots?: Slots
	/** 组件实例引用 / Component instance ref */
	ref?: Ref<ComponentPublicInstance | null>
	/** KeepAlive 配置 / KeepAlive options */
	keepAlive?: KeepAliveOptions | boolean
}

// 实例管理
const instances: Set<Mount> = new Set()
let instanceId = 0

class Mount {
	/** VNode 实例 / VNode instance */
	vNode: VNode | typeof Vue2 | null = null
	/** 挂载目标 / Mount target */
	target: Element | ShadowRoot
	/** 选项 / Options */
	options: Options = {}
	/** 实例 ID / Instance ID */
	readonly id: number
	/** 组件实例 / Component instance */
	componentInstance: ComponentPublicInstance | null = null

	private seed = 1

	constructor(component: Component, options: Options = {}) {
		if (typeof document === 'undefined') {
			throw new TypeError('This plugin works in browser')
		}
		this.id = ++instanceId
		this.options = options
		this.target =
			(typeof options.target === 'string' ? document.querySelector(options.target) : options.target) ||
			document.createElement(options.tagName || 'div')

		// 注册实例
		instances.add(this)

		// 处理异步组件
		if (typeof component === 'function' && component.constructor.name === 'AsyncFunction') {
			component = defineAsyncComponent(component as any)
		}

		this.vNode = this.createVM(component, options)
	}

	/**
	 * 创建 VNode
	 * @internal
	 */
	createVM(
		component: Component,
		{
			props,
			children,
			patchFlag,
			dynamicProps,
			isBlockNode,
			app,
			context,
			parent,
			listeners,
			on,
			slots,
		}: Options = {},
	): VNode | typeof Vue2 {
		let vNode: VNode | typeof Vue2

		// 合并监听器
		const mergedListeners = { ...listeners, ...on }

		if (isVue2) {
			const VueConstructor = Vue2.extend(Object.assign({}, context || {}, component))

			vNode = new VueConstructor({
				parent,
				propsData: props,
			}) as typeof Vue2
			;(vNode as any).id = `mount-plugin-${this.seed++}`

			// Vue 2 事件监听
			if (Object.keys(mergedListeners).length > 0) {
				Object.entries(mergedListeners).forEach(([event, handler]) => {
					;(vNode as any).$on(event, handler)
				})
			}

			return vNode
		} else {
			// Vue 3
			// 合并 props 和事件监听器
			const mergedProps = {
				...props,
				...Object.fromEntries(
					Object.entries(mergedListeners).map(([event, handler]) => [`on${event}`, handler]),
				),
			}

			// 处理 slots
			const mergedChildren = slots ? Object.assign({}, slots, children ? { default: children } : {}) : children

			vNode = createVNode(component, mergedProps, mergedChildren, patchFlag, dynamicProps, isBlockNode)

			// 设置上下文
			if (app?._context) {
				;(vNode as VNode).appContext = app._context
			}

			return vNode
		}
	}

	/**
	 * 挂载组件 / Mount the component
	 */
	mount(): this {
		// 触发 onBeforeMount
		this.options.onBeforeMount?.(this)

		// 如果没有指定 target，添加到 body
		if (!this.options.target) {
			document.body.appendChild(this.target)
		}

		if (isVue2) {
			this.vNode && this.vNode.$mount(this.target)
			this.componentInstance = this.vNode as unknown as ComponentPublicInstance
		} else {
			render(this.vNode, this.target)
			// 获取组件实例
			this.componentInstance = (this.vNode as VNode).component?.proxy ?? null
		}

		// 设置 ref
		if (this.options.ref) {
			this.options.ref.value = this.componentInstance
		}

		// 触发 onMounted
		this.options.onMounted?.(this)

		return this
	}

	/**
	 * 卸载组件 / Unmount the component
	 */
	unmount(): void {
		// 触发 onBeforeUnmount
		this.options.onBeforeUnmount?.(this)

		// 清除 ref
		if (this.options.ref) {
			this.options.ref.value = null
		}

		if (isVue2) {
			this.vNode?.$destroy()
			if (this.vNode?.$el && document.body.contains(this.vNode.$el)) {
				document.body.removeChild(this.vNode.$el)
			}
		} else {
			render(null, this.target)
			if (document.body.contains(this.target)) {
				document.body.removeChild(this.target)
			}
		}

		this.vNode = null
		this.target = null as unknown as Element | ShadowRoot
		this.componentInstance = null

		// 从实例管理中移除
		instances.delete(this)

		// 触发 onUnmounted
		this.options.onUnmounted?.(this)
	}

	/**
	 * 卸载组件（别名）/ Unmount the component (alias)
	 */
	destroy = this.unmount

	/**
	 * 卸载组件（别名）/ Unmount the component (alias)
	 */
	remove = this.unmount

	// ========== 链式调用 API ==========

	/**
	 * 设置 props / Set props
	 */
	setProps(props: Data): this {
		this.options = { ...this.options, props: { ...this.options.props, ...props } }

		return this
	}

	/**
	 * 设置事件监听器 / Set event listeners
	 */
	setListeners(listeners: Listeners): this {
		this.options = { ...this.options, listeners: { ...this.options.listeners, ...listeners } }

		return this
	}

	/**
	 * 设置事件监听器（别名）/ Set event listeners (alias)
	 */
	on = this.setListeners

	/**
	 * 设置插槽 / Set slots
	 */
	setSlots(slots: Slots): this {
		this.options = { ...this.options, slots: { ...this.options.slots, ...slots } }

		return this
	}

	/**
	 * 设置目标 / Set target
	 */
	setTarget(target: Element | ShadowRoot | string): this {
		this.options = { ...this.options, target }

		return this
	}

	/**
	 * 设置生命周期钩子 / Set lifecycle hooks
	 */
	setHooks(hooks: MountHooks): this {
		this.options = { ...this.options, ...hooks }

		return this
	}

	// ========== 静态方法 ==========

	/**
	 * 获取所有活动实例 / Get all active instances
	 */
	static get instances(): Mount[] {
		return Array.from(instances)
	}

	/**
	 * 卸载所有实例 / Unmount all instances
	 */
	static unmountAll(): void {
		instances.forEach(instance => instance.unmount())
	}

	/**
	 * 卸载所有实例（别名）/ Unmount all instances (alias)
	 */
	static destroyAll = Mount.unmountAll

	/**
	 * 根据 ID 获取实例 / Get instance by ID
	 */
	static getById(id: number): Mount | undefined {
		return Array.from(instances).find(instance => instance.id === id)
	}
}

export default Mount
