import type { MountOptions } from '../src/types'

import { afterEach, describe, expect, it, vi } from 'vitest'
import { clearSingletons, createMount, getActiveInstanceIds, getInstanceById, getInstances, globalConfig, hasSingleton, isMounted, mount, MountPlugin, setGlobalConfig, unmountAll } from '../src/index'

const TestComponent = { template: '<div>test</div>' }

describe('createMount function', () => {
	afterEach(unmountAll)

	it('should create a Mount instance', () => {
		const instance = createMount(TestComponent as any)

		expect(instance).toBeDefined()
		expect(instance.id).toBeDefined()
		expect(typeof instance.id).toBe('string')
		expect(instance.mounted).toBeFalsy()
	})

	it('should create instance with options', () => {
		const options: MountOptions = {
			props: { title: 'Hello' },
			tagName: 'section',
			zIndex: 1000,
		}
		const instance = createMount(TestComponent as any, options)

		expect(instance).toBeDefined()
		expect(instance.options.props).toEqual({ title: 'Hello' })
	})
})

describe('mount function', () => {
	afterEach(unmountAll)

	it('should create and show the component', () => {
		const instance = mount(TestComponent as any)

		expect(instance).toBeDefined()
		expect(instance.mounted).toBeTruthy()
	})

	it('should create instance with options and show it', () => {
		const component = { props: ['msg'], template: '<div>{{ msg }}</div>' }
		const instance = mount(component as any, { props: { msg: 'Hello' } })

		expect(instance).toBeDefined()
		expect(instance.mounted).toBeTruthy()
	})
})

describe('MountInstance show/hide methods', () => {
	afterEach(unmountAll)

	it('should show the component', () => {
		const instance = createMount(TestComponent as any)

		expect(instance.mounted).toBeFalsy()

		instance.show()

		expect(instance.mounted).toBeTruthy()
	})

	it('should hide the component (keep instance)', () => {
		const instance = mount(TestComponent as any)

		expect(instance.mounted).toBeTruthy()

		instance.hide()

		expect(instance.mounted).toBeTruthy()
	})

	it('should show again after hide', () => {
		const instance = mount(TestComponent as any)

		instance.hide()
		instance.show()

		expect(instance.mounted).toBeTruthy()
	})
})

describe('MountInstance Promise support', () => {
	afterEach(unmountAll)

	it('should support then method', () => {
		const instance = createMount(TestComponent as any)

		expect(typeof instance.then).toBe('function')
	})

	it('should resolve promise when resolve is called', async () => {
		const instance = createMount(TestComponent as any) as any

		const promise = instance._promise

		instance._resolvePromise('result')

		const result = await promise

		expect(result).toBe('result')
	})

	it('should support catch method', () => {
		const instance = createMount(TestComponent as any)

		expect(typeof instance.catch).toBe('function')
	})

	it('should support finally method', () => {
		const instance = createMount(TestComponent as any)

		expect(typeof instance.finally).toBe('function')
	})
})

describe('MountInstance event system', () => {
	afterEach(unmountAll)

	it('should add event listener with on method', () => {
		const instance = createMount(TestComponent as any)
		const handler = vi.fn()

		instance.on('test', handler)
		instance.emit('test', 'data')

		expect(handler).toHaveBeenCalledWith('data')
	})

	it('should remove event listener with off method', () => {
		const instance = createMount(TestComponent as any)
		const handler = vi.fn()

		instance.on('test', handler)
		instance.off('test', handler)
		instance.emit('test')

		expect(handler).not.toHaveBeenCalled()
	})

	it('should emit events', () => {
		const instance = createMount(TestComponent as any)
		const handler = vi.fn()

		instance.on('custom', handler)
		instance.emit('custom', 'arg1', 'arg2')

		expect(handler).toHaveBeenCalledWith('arg1', 'arg2')
	})

	it('should return this for chaining', () => {
		const instance = createMount(TestComponent as any)

		const result = instance.on('test', vi.fn()).off('test').emit('test')

		expect(result).toBe(instance)
	})

	it('should clear events on unmount', () => {
		const instance = createMount(TestComponent as any)
		const handler = vi.fn()

		instance.on('test', handler)
		instance.unmount()
		instance.emit('test')

		expect(handler).not.toHaveBeenCalled()
	})
})

describe('MountInstance chained API', () => {
	afterEach(unmountAll)

	it('should support setProps chaining', () => {
		const instance = createMount(TestComponent as any)

		const result = instance.setProps({ foo: 'bar' })

		expect(result).toBe(instance)
		expect(instance.options.props).toEqual({ foo: 'bar' })
	})

	it('should merge props in setProps', () => {
		const instance = createMount(TestComponent as any, { props: { a: 1 } })

		instance.setProps({ b: 2 })

		expect((instance.options.props as any).a).toBe(1)
		expect((instance.options.props as any).b).toBe(2)
	})

	it('should support setTarget chaining', () => {
		const instance = createMount(TestComponent as any)

		const result = instance.setTarget('#app')

		expect(result).toBe(instance)
	})

	it('should support setSlots chaining', () => {
		const instance = createMount(TestComponent as any)

		const result = instance.setSlots({ default: [] as any })

		expect(result).toBe(instance)
	})

	it('should support full chaining', () => {
		const instance = createMount(TestComponent as any)
			.setProps({ title: 'Hello' })
			.on('click', vi.fn())
			.setTarget('#app')

		expect(instance).toBeDefined()
	})
})

describe('MountInstance lifecycle hooks', () => {
	afterEach(unmountAll)

	it('should call onBeforeMount hook', () => {
		const onBeforeMount = vi.fn()
		const instance = createMount(TestComponent as any, { onBeforeMount })

		instance.show()

		expect(onBeforeMount).toHaveBeenCalledWith(instance)
	})

	it('should call onMounted hook', () => {
		const onMounted = vi.fn()
		const instance = createMount(TestComponent as any, { onMounted })

		instance.show()

		expect(onMounted).toHaveBeenCalledWith(instance)
	})

	it('should call onBeforeUnmount hook', () => {
		const onBeforeUnmount = vi.fn()
		const instance = mount(TestComponent as any, { onBeforeUnmount })

		instance.unmount()

		expect(onBeforeUnmount).toHaveBeenCalledWith(instance)
	})

	it('should call onUnmounted hook', () => {
		const onUnmounted = vi.fn()
		const instance = mount(TestComponent as any, { onUnmounted })

		instance.unmount()

		expect(onUnmounted).toHaveBeenCalledWith(instance)
	})

	it('should support setHooks method', () => {
		const instance = createMount(TestComponent as any)

		const result = instance.setHooks({ onMounted: vi.fn() })

		expect(result).toBe(instance)
	})
})

describe('Instance management', () => {
	afterEach(unmountAll)

	it('should track instances', () => {
		const instance1 = createMount(TestComponent as any)
		const instance2 = createMount(TestComponent as any)

		const instances = getInstances()

		expect(instances.length).toBeGreaterThanOrEqual(2)
		expect(instances).toContain(instance1)
		expect(instances).toContain(instance2)
	})

	it('should get instance by id', () => {
		const instance = createMount(TestComponent as any)

		const found = getInstanceById(instance.id)

		expect(found).toBe(instance)
	})

	it('should return undefined for non-existent id', () => {
		const found = getInstanceById('non-existent-id')

		expect(found).toBeUndefined()
	})

	it('should unmount all instances', () => {
		createMount(TestComponent as any)
		createMount(TestComponent as any)

		expect(getInstances().length).toBeGreaterThanOrEqual(2)

		unmountAll()

		expect(getInstances()).toHaveLength(0)
	})
})

describe('Global configuration', () => {
	afterEach(() => {
		setGlobalConfig({ zIndex: undefined })
	})

	it('should set global config', () => {
		setGlobalConfig({ zIndex: 2000 })

		expect(globalConfig.zIndex).toBe(2000)
	})

	it('should merge options with global config', () => {
		setGlobalConfig({ zIndex: 3000 })

		const instance = createMount(TestComponent as any)

		expect(instance.options.zIndex).toBe(3000)
	})
})

describe('MountPlugin', () => {
	it('should have install method', () => {
		expect(typeof MountPlugin.install).toBe('function')
	})

	it('should install plugin to app', () => {
		const mockApp = {
			config: { globalProperties: {} as any },
		} as any

		MountPlugin.install(mockApp)

		expect(mockApp.config.globalProperties.$show).toBeDefined()
	})

	it('should install with custom name', () => {
		const mockApp = {
			config: { globalProperties: {} as any },
		} as any

		MountPlugin.install(mockApp, { name: '$customMount' })

		expect(mockApp.config.globalProperties.$customMount).toBeDefined()
	})
})

describe('Edge cases', () => {
	afterEach(unmountAll)

	it('should handle empty options', () => {
		const instance = createMount(TestComponent as any, {})

		expect(instance).toBeDefined()
	})

	it('should handle multiple show calls', () => {
		const instance = createMount(TestComponent as any)

		instance.show()
		instance.show()

		expect(instance.mounted).toBeTruthy()
	})

	it('should handle unmount when not mounted', () => {
		const instance = createMount(TestComponent as any)

		instance.unmount()
	})

	it('should handle multiple unmount calls', () => {
		const instance = createMount(TestComponent as any)

		instance.show()
		instance.unmount()
		instance.unmount()

		expect(instance.mounted).toBeFalsy()
	})

	it('should generate unique IDs', () => {
		const instance1 = createMount(TestComponent as any)
		const instance2 = createMount(TestComponent as any)

		expect(instance1.id).not.toBe(instance2.id)
	})

	it('should have destroy and remove aliases', () => {
		const instance = createMount(TestComponent as any)

		expect(instance.destroy).toBe(instance.unmount)
		expect(instance.remove).toBe(instance.unmount)
	})
})

describe('EventEmitter', () => {
	afterEach(unmountAll)

	it('should handle multiple listeners for same event', () => {
		const instance = createMount(TestComponent as any)
		const handler1 = vi.fn()
		const handler2 = vi.fn()

		instance.on('test', handler1)
		instance.on('test', handler2)
		instance.emit('test')

		expect(handler1).toHaveBeenCalled()
		expect(handler2).toHaveBeenCalled()
	})

	it('should remove all listeners for event when no handler provided', () => {
		const instance = createMount(TestComponent as any)
		const handler = vi.fn()

		instance.on('test', handler)
		instance.off('test')
		instance.emit('test')

		expect(handler).not.toHaveBeenCalled()
	})
})

describe('Singleton mode', () => {
	afterEach(() => {
		unmountAll()
		clearSingletons()
	})

	it('should create singleton instance', () => {
		const instance = mount(TestComponent as any, { singleton: true })

		expect(instance).toBeDefined()
		expect(instance.mounted).toBeTruthy()
	})

	it('should replace existing singleton with same key', () => {
		const instance1 = mount(TestComponent as any, { singleton: 'my-toast' })
		const instance2 = mount(TestComponent as any, { singleton: 'my-toast' })

		expect(instance1).not.toBe(instance2)
		expect(instance1.mounted).toBeFalsy() // instance1 should be unmounted
		expect(instance2.mounted).toBeTruthy()
	})

	it('should allow different singleton keys', () => {
		const instance1 = mount(TestComponent as any, { singleton: 'toast-1' })
		const instance2 = mount(TestComponent as any, { singleton: 'toast-2' })

		expect(instance1.mounted).toBeTruthy()
		expect(instance2.mounted).toBeTruthy()
	})

	it('should check singleton existence', () => {
		mount(TestComponent as any, { singleton: 'test-key' })

		expect(hasSingleton('test-key')).toBeTruthy()
		expect(hasSingleton('non-existent')).toBeFalsy()
	})

	it('should clear all singletons', () => {
		mount(TestComponent as any, { singleton: 'key1' })
		mount(TestComponent as any, { singleton: 'key2' })

		clearSingletons()

		expect(hasSingleton('key1')).toBeFalsy()
		expect(hasSingleton('key2')).toBeFalsy()
	})
})

describe('isMounted function', () => {
	afterEach(unmountAll)

	it('should return true for mounted instance', () => {
		const instance = mount(TestComponent as any)

		expect(isMounted(instance.id)).toBeTruthy()
	})

	it('should return false for unmounted instance', () => {
		const instance = createMount(TestComponent as any)

		expect(isMounted(instance.id)).toBeFalsy()
	})

	it('should return false for non-existent id', () => {
		expect(isMounted('non-existent')).toBeFalsy()
	})
})

describe('getActiveInstanceIds function', () => {
	afterEach(unmountAll)

	it('should return all active instance IDs', () => {
		const instance1 = mount(TestComponent as any)
		const instance2 = mount(TestComponent as any)

		const ids = getActiveInstanceIds()

		expect(ids).toContain(instance1.id)
		expect(ids).toContain(instance2.id)
	})
})
