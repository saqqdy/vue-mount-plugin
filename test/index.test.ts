import type { Component, MountHooks, Options, Slots } from '../src/index'

import { afterEach, describe, expect, it, vi } from 'vitest'

import Mount from '../src/index'
import { noop, withFunctionInstall, withInstall, withNoopInstall } from '../src/utils/vue'

describe('Mount class', () => {
	it('should throw error in non-browser environment', async () => {
		const originalDocument = globalThis.document

		// @ts-expect-error - testing non-browser environment
		delete globalThis.document

		// Need to re-import to get the error
		vi.resetModules()
		const MountModule = await import('../src/index')
		const MountClass = MountModule.default

		expect(() => new MountClass({} as any)).toThrow('This plugin works in browser')

		globalThis.document = originalDocument
	})

	it('should create instance with default options', () => {
		const component = { template: '<div>test</div>' }
		const instance = new Mount(component as any)

		expect(instance).toBeDefined()
		expect(instance.target).toBeDefined()
		expect(instance.vNode).toBeDefined()
		expect(instance.id).toBeGreaterThan(0)

		instance.unmount()
	})

	it('should create instance with custom tagName', () => {
		const component = { template: '<div>test</div>' }
		const instance = new Mount(component as any, { tagName: 'span' })

		expect(instance).toBeDefined()
		expect(instance.target.tagName).toBe('SPAN')

		instance.unmount()
	})

	it('should create instance with custom target', () => {
		const mockTarget = document.createElement('div')
		const component = { template: '<div>test</div>' }
		const instance = new Mount(component as any, { target: mockTarget })

		expect(instance.target).toBe(mockTarget)

		instance.unmount()
	})

	it('should create instance with target as string selector', () => {
		const el = document.createElement('div')

		el.id = 'app'
		document.body.appendChild(el)

		const component = { template: '<div>test</div>' }
		const instance = new Mount(component as any, { target: '#app' })

		expect(instance.target).toBe(el)

		// unmount will remove the element from body, so we don't need to manually remove
		instance.unmount()
	})

	it('should have mount and unmount methods', () => {
		const component = { template: '<div>test</div>' }
		const instance = new Mount(component as any)

		expect(typeof instance.mount).toBe('function')
		expect(typeof instance.unmount).toBe('function')
		expect(typeof instance.destroy).toBe('function')
		expect(typeof instance.remove).toBe('function')

		instance.unmount()
	})

	it('should create instance with null target and use createElement', () => {
		const component = { template: '<div>test</div>' }
		const instance = new Mount(component as any, { target: '#nonexistent' })

		expect(instance).toBeDefined()
		expect(instance.target.tagName).toBe('DIV')

		instance.unmount()
	})
})

describe('Mount options', () => {
	it('should accept props option', () => {
		const component = { props: ['msg'], template: '<div>{{ msg }}</div>' }
		const instance = new Mount(component as any, {
			props: { msg: 'Hello' },
		})

		expect(instance).toBeDefined()

		instance.unmount()
	})

	it('should accept parent option', () => {
		const component = { template: '<div>test</div>' }
		const mockParent = { $root: {} }
		const instance = new Mount(component as any, {
			parent: mockParent,
		})

		expect(instance).toBeDefined()

		instance.unmount()
	})

	it('should accept children option', () => {
		const component = { template: '<div><slot /></div>' }
		const instance = new Mount(component as any, {
			children: 'slot content',
		})

		expect(instance).toBeDefined()

		instance.unmount()
	})

	it('should accept listeners option', () => {
		const component = { template: '<div>test</div>' }
		const instance = new Mount(component as any, {
			listeners: { click: vi.fn() },
		})

		expect(instance).toBeDefined()

		instance.unmount()
	})

	it('should accept on option (listeners alias)', () => {
		const component = { template: '<div>test</div>' }
		const instance = new Mount(component as any, {
			on: { click: vi.fn() },
		})

		expect(instance).toBeDefined()

		instance.unmount()
	})

	it('should merge listeners and on options', () => {
		const clickHandler1 = vi.fn()
		const clickHandler2 = vi.fn()
		const component = { template: '<div>test</div>' }
		const instance = new Mount(component as any, {
			listeners: { click: clickHandler1 },
			on: { submit: clickHandler2 },
		})

		expect(instance).toBeDefined()

		instance.unmount()
	})

	it('should accept slots option', () => {
		const component = { template: '<div><slot /></div>' }
		const instance = new Mount(component as any, {
			slots: { default: [] },
		})

		expect(instance).toBeDefined()

		instance.unmount()
	})

	it('should accept keepAlive option', () => {
		const component = { template: '<div>test</div>' }
		const instance = new Mount(component as any, {
			keepAlive: true,
		})

		expect(instance).toBeDefined()

		instance.unmount()
	})

	it('should accept keepAlive options object', () => {
		const component = { template: '<div>test</div>' }
		const instance = new Mount(component as any, {
			keepAlive: { enabled: true, max: 5 },
		})

		expect(instance).toBeDefined()

		instance.unmount()
	})

	it('should accept app option', () => {
		const component = { template: '<div>test</div>' }
		const mockApp = { _context: { provides: {} } }
		const instance = new Mount(component as any, {
			app: mockApp as any,
		})

		expect(instance).toBeDefined()

		instance.unmount()
	})

	it('should accept context option', () => {
		const component = { template: '<div>test</div>' }
		const instance = new Mount(component as any, {
			context: { router: {}, store: {} },
		})

		expect(instance).toBeDefined()

		instance.unmount()
	})

	it('should accept ref option', () => {
		const component = { template: '<div>test</div>' }
		const ref = { value: null }
		const instance = new Mount(component as any, {
			ref: ref as any,
		})

		expect(instance).toBeDefined()

		instance.unmount()
	})

	it('should accept patchFlag and dynamicProps options', () => {
		const component = { template: '<div>test</div>' }
		const instance = new Mount(component as any, {
			patchFlag: 1,
			dynamicProps: ['class'],
		})

		expect(instance).toBeDefined()

		instance.unmount()
	})

	it('should accept isBlockNode option', () => {
		const component = { template: '<div>test</div>' }
		const instance = new Mount(component as any, {
			isBlockNode: true,
		})

		expect(instance).toBeDefined()

		instance.unmount()
	})

	it('should accept lifecycle hooks', () => {
		const hooks: MountHooks = {
			onBeforeMount: vi.fn(),
			onMounted: vi.fn(),
			onBeforeUnmount: vi.fn(),
			onUnmounted: vi.fn(),
		}

		const component = { template: '<div>test</div>' }
		const instance = new Mount(component as any, hooks)

		expect(instance).toBeDefined()

		instance.unmount()
	})
})

describe('Chained API', () => {
	it('should support setProps chaining', () => {
		const component = { template: '<div>test</div>' }
		const instance = new Mount(component as any)

		const result = instance.setProps({ foo: 'bar' })

		expect(result).toBe(instance)

		instance.unmount()
	})

	it('should support setListeners chaining', () => {
		const component = { template: '<div>test</div>' }
		const instance = new Mount(component as any)

		const result = instance.setListeners({ click: vi.fn() })

		expect(result).toBe(instance)

		instance.unmount()
	})

	it('should support on method (setListeners alias)', () => {
		const component = { template: '<div>test</div>' }
		const instance = new Mount(component as any)

		const result = instance.on({ click: vi.fn() })

		expect(result).toBe(instance)

		instance.unmount()
	})

	it('should support setSlots chaining', () => {
		const component = { template: '<div>test</div>' }
		const instance = new Mount(component as any)

		const result = instance.setSlots({ default: [] })

		expect(result).toBe(instance)

		instance.unmount()
	})

	it('should support setTarget chaining', () => {
		const component = { template: '<div>test</div>' }
		const instance = new Mount(component as any)

		const result = instance.setTarget('#app')

		expect(result).toBe(instance)

		instance.unmount()
	})

	it('should support setHooks chaining', () => {
		const component = { template: '<div>test</div>' }
		const instance = new Mount(component as any)

		const result = instance.setHooks({ onMounted: vi.fn() })

		expect(result).toBe(instance)

		instance.unmount()
	})

	it('should support full chaining', () => {
		const component = { template: '<div>test</div>' }
		const instance = new Mount(component as any)
			.setProps({ title: 'Hello' })
			.setListeners({ click: vi.fn() })
			.setTarget('#app')

		expect(instance).toBeDefined()

		instance.unmount()
	})

	it('should merge props in setProps', () => {
		const component = { template: '<div>test</div>' }
		const instance = new Mount(component as any, { props: { a: 1 } })

		instance.setProps({ b: 2 })

		expect((instance.options.props as any).a).toBe(1)
		expect((instance.options.props as any).b).toBe(2)

		instance.unmount()
	})

	it('should merge listeners in setListeners', () => {
		const component = { template: '<div>test</div>' }
		const instance = new Mount(component as any, { listeners: { click: vi.fn() } })

		instance.setListeners({ submit: vi.fn() })

		expect(instance.options.listeners?.click).toBeDefined()
		expect(instance.options.listeners?.submit).toBeDefined()

		instance.unmount()
	})
})

describe('Instance management', () => {
	afterEach(() => {
		Mount.unmountAll()
	})

	it('should track instances', () => {
		const component = { template: '<div>test</div>' }
		const instance1 = new Mount(component as any)
		const instance2 = new Mount(component as any)

		expect(Mount.instances.length).toBeGreaterThanOrEqual(2)
		expect(Mount.instances).toContain(instance1)
		expect(Mount.instances).toContain(instance2)
	})

	it('should get instance by id', () => {
		const component = { template: '<div>test</div>' }
		const instance = new Mount(component as any)

		const found = Mount.getById(instance.id)

		expect(found).toBe(instance)
	})

	it('should return undefined for non-existent id', () => {
		const found = Mount.getById(99999)

		expect(found).toBeUndefined()
	})

	it('should unmount all instances', () => {
		const component = { template: '<div>test</div>' }

		const instance1 = new Mount(component as any)
		const instance2 = new Mount(component as any)

		expect(Mount.instances.length).toBeGreaterThanOrEqual(2)
		expect(Mount.instances).toContain(instance1)
		expect(Mount.instances).toContain(instance2)

		Mount.unmountAll()

		expect(Mount.instances).toHaveLength(0)
	})

	it('should have destroyAll as alias for unmountAll', () => {
		expect(Mount.destroyAll).toBe(Mount.unmountAll)
	})
})

describe('mount method', () => {
	afterEach(() => {
		Mount.unmountAll()
	})

	it('should call onBeforeMount hook', () => {
		const onBeforeMount = vi.fn()
		const component = { template: '<div>test</div>' }
		const instance = new Mount(component as any, { onBeforeMount })

		instance.mount()

		expect(onBeforeMount).toHaveBeenCalledWith(instance)
	})

	it('should call onMounted hook', () => {
		const onMounted = vi.fn()
		const component = { template: '<div>test</div>' }
		const instance = new Mount(component as any, { onMounted })

		instance.mount()

		expect(onMounted).toHaveBeenCalledWith(instance)
	})

	it('should append to body when no target specified', () => {
		const component = { template: '<div>test</div>' }
		const instance = new Mount(component as any)

		instance.mount()

		expect(document.body.contains(instance.target)).toBeTruthy()
	})

	it('should not append to body when target is specified', () => {
		const customTarget = document.createElement('div')

		document.body.appendChild(customTarget)

		const component = { template: '<div>test</div>' }
		const instance = new Mount(component as any, { target: customTarget })

		instance.mount()

		expect(instance.target).toBe(customTarget)
	})

	it('should return this for chaining', () => {
		const component = { template: '<div>test</div>' }
		const instance = new Mount(component as any)

		const result = instance.mount()

		expect(result).toBe(instance)
	})

	it('should set componentInstance after mount', () => {
		const component = { template: '<div>test</div>' }
		const instance = new Mount(component as any)

		instance.mount()

		expect(instance.componentInstance).toBeDefined()
	})
})

describe('unmount method', () => {
	afterEach(() => {
		Mount.unmountAll()
	})

	it('should call onBeforeUnmount hook', () => {
		const onBeforeUnmount = vi.fn()
		const component = { template: '<div>test</div>' }
		const instance = new Mount(component as any, { onBeforeUnmount })

		instance.mount()
		instance.unmount()

		expect(onBeforeUnmount).toHaveBeenCalledWith(instance)
	})

	it('should call onUnmounted hook', () => {
		const onUnmounted = vi.fn()
		const component = { template: '<div>test</div>' }
		const instance = new Mount(component as any, { onUnmounted })

		instance.mount()
		instance.unmount()

		expect(onUnmounted).toHaveBeenCalled()
	})

	it('should remove from instances set', () => {
		const component = { template: '<div>test</div>' }
		const instance = new Mount(component as any)

		instance.mount()

		const countBefore = Mount.instances.length

		instance.unmount()

		expect(Mount.instances).toHaveLength(countBefore - 1)
	})

	it('should clear componentInstance', () => {
		const component = { template: '<div>test</div>' }
		const instance = new Mount(component as any)

		instance.mount()
		instance.unmount()

		expect(instance.componentInstance).toBeNull()
	})

	it('destroy should be alias for unmount', () => {
		const component = { template: '<div>test</div>' }
		const instance = new Mount(component as any)

		expect(instance.destroy).toBe(instance.unmount)

		instance.unmount()
	})

	it('remove should be alias for unmount', () => {
		const component = { template: '<div>test</div>' }
		const instance = new Mount(component as any)

		expect(instance.remove).toBe(instance.unmount)

		instance.unmount()
	})
})

describe('Async component support', () => {
	afterEach(() => {
		Mount.unmountAll()
	})

	it('should handle async component', () => {
		const asyncComponent = async (): Promise<{ template: string }> => ({ template: '<div>async</div>' })
		const instance = new Mount(asyncComponent as any)

		expect(instance).toBeDefined()
		expect(instance.vNode).toBeDefined()
	})
})

describe('Ref support', () => {
	afterEach(() => {
		Mount.unmountAll()
	})

	it('should set ref value on mount', () => {
		const ref = { value: null as any }
		const component = { template: '<div>test</div>' }
		const instance = new Mount(component as any, { ref: ref as any })

		instance.mount()

		expect(ref.value).toBe(instance.componentInstance)
	})

	it('should clear ref value on unmount', () => {
		const ref = { value: null as any }
		const component = { template: '<div>test</div>' }
		const instance = new Mount(component as any, { ref: ref as any })

		instance.mount()
		instance.unmount()

		expect(ref.value).toBeNull()
	})
})

describe('TypeScript types', () => {
	it('should export Options interface', () => {
		// Type checking - if this compiles, the types are correct
		const options: Options = {
			props: { foo: 'bar' },
			tagName: 'div',
		}

		expect(options).toBeDefined()
	})

	it('should export Component type', () => {
		// Type checking
		const component: Component = { template: '<div/>' }

		expect(component).toBeDefined()
	})

	it('should export Slots type', () => {
		// Type checking
		const slots: Slots = { default: [] }

		expect(slots).toBeDefined()
	})

	it('should export MountHooks type', () => {
		// Type checking
		const hooks: MountHooks = {
			onMounted: (): void => {},
		}

		expect(hooks).toBeDefined()
	})
})

describe('Vue utils', () => {
	it('noop should be a function', (): void => {
		expect(typeof noop).toBe('function')
		expect(noop()).toBeUndefined()
	})

	it('withInstall should add install method', (): void => {
		const component = { name: 'TestComponent' } as any
		const result = withInstall(component)

		expect(result.install).toBeDefined()
		expect(typeof result.install).toBe('function')
		expect(result.name).toBe('TestComponent')
	})

	it('withInstall should handle extra components', (): void => {
		const component = { name: 'TestComponent' } as any
		const extra = { SubComponent: { name: 'SubComponent' } }
		const result = withInstall(component, extra)

		expect((result as any).SubComponent).toBeDefined()
	})

	it('withFunctionInstall should add install method', (): void => {
		const component = {} as any
		const result = withFunctionInstall(component, '$test')

		expect(result.install).toBeDefined()
		expect(typeof result.install).toBe('function')
	})

	it('withNoopInstall should add noop install method', (): void => {
		const component = { name: 'TestComponent' } as any
		const result = withNoopInstall(component)

		expect(result.install).toBe(noop)
		expect(result.name).toBe('TestComponent')
	})

	it('withInstall install should register component to app', (): void => {
		const component = { name: 'TestComponent' } as any
		const result = withInstall(component)

		const mockApp = { component: vi.fn() } as any

		result.install(mockApp)

		expect(mockApp.component).toHaveBeenCalledWith('TestComponent', component)
	})

	it('withFunctionInstall install should set global property', (): void => {
		const component = {} as any
		const result = withFunctionInstall(component, '$test')

		const mockApp = {
			_context: {},
			config: { globalProperties: {} as any },
		} as any

		result.install(mockApp)

		expect(mockApp.config.globalProperties.$test).toBe(component)
		expect(result._context).toBe(mockApp._context)
	})
})

describe('Edge cases', () => {
	afterEach(() => {
		Mount.unmountAll()
	})

	it('should handle empty listeners object', () => {
		const component = { template: '<div>test</div>' }
		const instance = new Mount(component as any, { listeners: {} })

		expect(instance).toBeDefined()

		instance.unmount()
	})

	it('should handle null props', () => {
		const component = { template: '<div>test</div>' }
		const instance = new Mount(component as any, { props: null })

		expect(instance).toBeDefined()

		instance.unmount()
	})

	it('should handle empty slots object', () => {
		const component = { template: '<div>test</div>' }
		const instance = new Mount(component as any, { slots: {} })

		expect(instance).toBeDefined()

		instance.unmount()
	})

	it('should handle children with slots', () => {
		const component = { template: '<div><slot /></div>' }
		const instance = new Mount(component as any, {
			children: 'content',
			slots: { header: [] as any },
		})

		expect(instance).toBeDefined()

		instance.unmount()
	})

	it('should mount with custom target element', () => {
		const customTarget = document.createElement('section')

		document.body.appendChild(customTarget)

		const component = { template: '<div>test</div>' }
		const instance = new Mount(component as any, { target: customTarget })

		instance.mount()

		expect(instance.target).toBe(customTarget)
	})

	it('should handle multiple unmountAll calls safely', () => {
		Mount.unmountAll()
		Mount.unmountAll()

		expect(Mount.instances).toHaveLength(0)
	})

	it('should handle instance with all options', () => {
		const ref = { value: null as any }
		const component = { template: '<div>test</div>' }
		const instance = new Mount(component as any, {
			props: { title: 'Test' },
			listeners: { click: vi.fn() },
			on: { close: vi.fn() },
			slots: { default: [] as any },
			ref: ref as any,
			keepAlive: true,
			tagName: 'article',
			onBeforeMount: vi.fn(),
			onMounted: vi.fn(),
			onBeforeUnmount: vi.fn(),
			onUnmounted: vi.fn(),
		})

		instance.mount()

		expect(instance).toBeDefined()
		expect(ref.value).toBe(instance.componentInstance)

		instance.unmount()
	})

	it('should generate unique IDs for each instance', () => {
		const component = { template: '<div>test</div>' }
		const instance1 = new Mount(component as any)
		const instance2 = new Mount(component as any)

		expect(instance1.id).not.toBe(instance2.id)

		instance1.unmount()
		instance2.unmount()
	})

	it('should handle chained mount', () => {
		const component = { template: '<div>test</div>' }
		const instance = new Mount(component as any).mount()

		expect(instance.componentInstance).toBeDefined()

		instance.unmount()
	})

	it('should handle chained setProps and mount', () => {
		const component = { props: ['msg'], template: '<div>{{ msg }}</div>' }
		const instance = new Mount(component as any).setProps({ msg: 'Hello' }).mount()

		expect(instance.componentInstance).toBeDefined()

		instance.unmount()
	})

	it('should handle empty context', () => {
		const component = { template: '<div>test</div>' }
		const instance = new Mount(component as any, { context: {} })

		expect(instance).toBeDefined()

		instance.unmount()
	})
})
