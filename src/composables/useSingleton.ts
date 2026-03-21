import type { MountInstance } from '../types'

/**
 * Singleton instances storage
 */
const singletonInstances = new Map<string | symbol, MountInstance>()

/**
 * Singleton key generator for components
 */
const componentKeys = new WeakMap<any, symbol>()

function getComponentKey(component: any): symbol {
	if (!componentKeys.has(component)) {
		componentKeys.set(component, Symbol(component.name || 'anonymous'))
	}

	return componentKeys.get(component)!
}

/**
 * Get singleton key from component and options
 */
export function getSingletonKey(component: any, singleton?: boolean | string): string | symbol | undefined {
	if (singleton === false) return undefined
	if (typeof singleton === 'string') return singleton
	if (singleton === true) return getComponentKey(component)

	return undefined
}

/**
 * Get singleton instance by key
 */
export function getSingleton(key: string | symbol): MountInstance | undefined {
	return singletonInstances.get(key)
}

/**
 * Set singleton instance
 * If an instance already exists, it will be unmounted first
 */
export function setSingleton(key: string | symbol, instance: MountInstance): void {
	const existing = singletonInstances.get(key)

	if (existing && existing !== instance) {
		existing.unmount()
	}
	singletonInstances.set(key, instance)
}

/**
 * Remove singleton instance
 */
export function removeSingleton(key: string | symbol): void {
	singletonInstances.delete(key)
}

/**
 * Clear all singleton instances
 */
export function clearSingletons(): void {
	singletonInstances.forEach(instance => instance.unmount())
	singletonInstances.clear()
}

/**
 * Check if singleton exists
 */
export function hasSingleton(key: string | symbol): boolean {
	return singletonInstances.has(key)
}

/**
 * Get all singleton keys
 */
export function getSingletonKeys(): (string | symbol)[] {
	return Array.from(singletonInstances.keys())
}
