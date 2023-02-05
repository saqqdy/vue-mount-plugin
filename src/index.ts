import { type App, type VNode, createVNode, extend, isVue2, ref, render } from 'vue-demi'
import { v4 as uuidv4 } from 'uuid'

export type CreateVNodeParameters = Parameters<typeof createVNode>
export type Component = CreateVNodeParameters['0']
export interface Options {
	props?: CreateVNodeParameters['1']
	children?: CreateVNodeParameters['2']
	target?: HTMLDivElement | null
	app?: App
}

class Instance {
	instance: VNode | null = null
	target: HTMLDivElement | null = null
	constructor(component: Component, { props, children, target, app }: Options = {}) {
		if (target) this.target = target
		else if (typeof document !== 'undefined') {
			this.target = document.createElement('div')
			document.body.appendChild(this.target)
		}
		// this.target.id = uuidv4()
		this.instance = createVNode(
			component,
			props,
			children
			// patchFlag,
			// dynamicProps,
			// isBlockNode
		)
		// set context
		if (app?._context) this.instance.appContext = app._context
	}

	get createMountTarget(el) {
		if (isVue2) {
			const VueConstructor = extend(
				Object.assign(
					{
						// router: proxy.$router,
						// store: proxy.$store,
						// i18n: proxy.$i18n
					},
					template
				)
			)
			return new VueConstructor({
				parent: proxy,
				el,
				propsData
			})
		}
	}

	get show() {
		render(this.instance, this.target)
	}

	get hide() {
		render(null, this.target)
		document.body.removeChild(this.target)
		this.target = null
		this.instance = null
		delete this.target
		delete this.instance
	}
	// get mount() {}
	// get destroy() {
	//     if (target) render(null, target)
	//     target = null
	//     instance = null
	// }
}

// const mount = (component, { props, children, target, app } = {}) => {
// 	// let instance = createVNode(component, props, children)
// 	if (target) render(instance, target)
// 	else if (typeof document !== 'undefined')
// 		render(instance, (target = document.createElement('div')))

// 	// const show = () => {
// 	//     if (target) render(instance, target)
// 	//     target = null
// 	//     instance = null
// 	// }

// 	const destroy = () => {
// 		if (target) render(null, target)
// 		target = null
// 		instance = null
// 	}

// 	return { instance, destroy, target }
// }

/**
 * mount component
 *
 * @param path - file path
 * @returns - result
 */
// export function mount(path: string): unknown | null {
// 	return ref(true)
// }

// import { createVNode, render } from 'vue'

// export function mount(component, { props, children, element, app } = {}) {
//   let el = element

//   let vNode = createVNode(component, props, children)
//   if (app && app._context) vNode.appContext = app._context
//   if (el) render(vNode, el)
//   else if (typeof document !== 'undefined' ) render(vNode, el = document.createElement('div'))

//   const destroy = () => {
//     if (el) render(null, el)
//     el = null
//     vNode = null
//   }

//   return { vNode, destroy, el }
// }

export default Instance
