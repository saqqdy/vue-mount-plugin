import type { Component, Options } from '../src/index'

import { describe, expect, it, vi } from 'vitest'

// Mock browser environment
globalThis.document = {
	body: {
		appendChild: vi.fn(),
		removeChild: vi.fn(),
	},
	createElement: vi.fn(tag => ({
		appendChild: vi.fn(),
		removeChild: vi.fn(),
		tagName: tag.toUpperCase(),
	})),
	querySelector: vi.fn(),
} as any

describe('Mount class', () => {
	it('should throw error in non-browser environment', async () => {
		const originalDocument = globalThis.document

		// @ts-expect-error - testing non-browser environment
		delete globalThis.document

		// Need to re-import to get the error
		vi.resetModules()
		const { default: Mount } = await import('../src/index')

		expect(() => new Mount({} as any)).toThrow('This plugin works in browser')

		globalThis.document = originalDocument
	})

	it('should create instance with default options', async () => {
		vi.resetModules()
		const { default: Mount } = await import('../src/index')

		const component = { template: '<div>test</div>' }
		const instance = new Mount(component as any)

		expect(instance).toBeDefined()
		expect(instance.target).toBeDefined()
		expect(instance.vNode).toBeDefined()
	})

	it('should create instance with custom tagName', async () => {
		vi.resetModules()
		const { default: Mount } = await import('../src/index')

		const component = { template: '<div>test</div>' }
		const instance = new Mount(component as any, { tagName: 'span' })

		expect(instance).toBeDefined()
		expect(document.createElement).toHaveBeenCalledWith('span')
	})

	it('should create instance with custom target', async () => {
		vi.resetModules()
		const { default: Mount } = await import('../src/index')

		const mockTarget = { tagName: 'DIV' } as any
		const component = { template: '<div>test</div>' }
		const instance = new Mount(component as any, { target: mockTarget })

		expect(instance.target).toBe(mockTarget)
	})

	it('should have mount and unmount methods', async () => {
		vi.resetModules()
		const { default: Mount } = await import('../src/index')

		const component = { template: '<div>test</div>' }
		const instance = new Mount(component as any)

		expect(typeof instance.mount).toBe('function')
		expect(typeof instance.unmount).toBe('function')
	})
})

describe('Mount options', () => {
	it('should accept props option', async () => {
		vi.resetModules()
		const { default: Mount } = await import('../src/index')

		const component = { props: ['msg'], template: '<div>{{ msg }}</div>' }
		const instance = new Mount(component as any, {
			props: { msg: 'Hello' },
		})

		expect(instance).toBeDefined()
	})

	it('should accept parent option', async () => {
		vi.resetModules()
		const { default: Mount } = await import('../src/index')

		const component = { template: '<div>test</div>' }
		const mockParent = { $root: {} }
		const instance = new Mount(component as any, {
			parent: mockParent,
		})

		expect(instance).toBeDefined()
	})

	it('should accept children option', async () => {
		vi.resetModules()
		const { default: Mount } = await import('../src/index')

		const component = { template: '<div><slot /></div>' }
		const instance = new Mount(component as any, {
			children: 'slot content',
		})

		expect(instance).toBeDefined()
	})
})

describe('TypeScript types', () => {
	it('should export Options interface', async () => {
		vi.resetModules()
		await import('../src/index')

		// Type checking - if this compiles, the types are correct
		const options: Options = {
			props: { foo: 'bar' },
			tagName: 'div',
		}

		expect(options).toBeDefined()
	})

	it('should export Component type', async () => {
		vi.resetModules()
		await import('../src/index')

		// Type checking
		const component: Component = { template: '<div/>' }

		expect(component).toBeDefined()
	})
})
