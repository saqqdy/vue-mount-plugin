import { Vue2, createVNode, isVue2, render } from 'vue-demi'
import type { App, VNode, VNodeProps } from 'vue-demi'

export type CreateVNodeParameters = Parameters<typeof createVNode>
export type Component = CreateVNodeParameters['0']
export type Data = Record<string, unknown>
export interface Options {
	/**
	 * propsData
	 */
	props?: (Data & VNodeProps) | null
	/**
	 * children
	 */
	children?: unknown
	patchFlag?: number
	dynamicProps?: string[] | null
	isBlockNode?: boolean
	/**
	 * mount target
	 */
	target?: Element | ShadowRoot
	/**
	 * tagName of mount target, default: div
	 */
	tagName?: keyof HTMLElementTagNameMap
	/**
	 * vue3.0 app
	 */
	app?: App
	/**
	 * vue2.0 context
	 */
	context?: Data & {
		router: unknown
		store: unknown
		i18n: unknown
	}
	/**
	 * parent context
	 */
	parent?: unknown
}

class Mount {
	vNode: VNode | typeof Vue2 | null = null
	target: Element | ShadowRoot
	options: Options = {}
	seed = 1
	constructor(component: Component, options: Options = {}) {
		if (typeof document === 'undefined') throw new Error('This plugin works in browser')
		this.options = options
		this.target =
			(typeof options.target === 'string'
				? document.querySelector(options.target)
				: options.target) || document.createElement(options.tagName || 'div')
		this.vNode = this.createVM(component, options)
	}

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
			parent
		}: Options = {}
	) {
		let vNode
		if (isVue2) {
			const VueConstructor = Vue2.extend(Object.assign({}, context || {}, component))
			vNode = new VueConstructor({
				parent,
				propsData: props
			})
			vNode.id = 'mount-plugin-' + this.seed++
			return vNode
		} else {
			vNode = createVNode(component, props, children, patchFlag, dynamicProps, isBlockNode)
			// set context
			if (app?._context) vNode.appContext = app._context
			return vNode
		}
	}

	// mount
	mount() {
		// target is not mounted
		!this.options.target && document.body.appendChild(this.target)
		if (isVue2) {
			this.vNode && this.vNode.$mount(this.target)
		} else {
			render(this.vNode, this.target)
		}
	}

	// unmount
	unmount() {
		if (isVue2) {
			this.vNode.$destroy()
			document.body.removeChild(this.vNode.$el)
		} else {
			render(null, this.target)
			document.body.removeChild(this.target)
		}
		this.vNode = null
		this.target = null as unknown as Element | ShadowRoot
	}
}

export default Mount
