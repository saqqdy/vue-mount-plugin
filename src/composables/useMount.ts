import type { MountInstance, MountOptions } from '../types'
import { computed, isVue2, onUnmounted, ref, type Ref } from 'vue-demi'
import { createMount } from '../index'
import { getSingleton, setSingleton } from './useSingleton'

export interface UseMountReturn {
	instances: Ref<MountInstance[]>
	mount: <T = any>(component: any, options?: MountOptions) => MountInstance<T>
	unmount: (instance: MountInstance) => void
	unmountAll: () => void
	getById: (id: string) => MountInstance | undefined
	hasInstances: () => boolean
	count: Ref<number>
}

export interface UseSingletonReturn {
	getOrCreate: <T = any>(key: string, component: any, options?: MountOptions) => MountInstance<T>
}

/**
 * useMount composable for Vue 3 Composition API
 * Provides convenient mount/unmount management with automatic cleanup
 */
export function useMount(): UseMountReturn {
	const instances: Ref<MountInstance[]> = ref([])

	const mount = <T = any>(component: any, options?: MountOptions): MountInstance<T> => {
		const instance = createMount(component, options) as MountInstance<T>

		instances.value.push(instance as MountInstance)
		instance.show()

		return instance
	}

	const unmount = (instance: MountInstance): void => {
		instance.unmount()
		instances.value = instances.value.filter(i => i !== instance)
	}

	const unmountAll = (): void => {
		instances.value.forEach(instance => instance.unmount())
		instances.value = []
	}

	const getById = (id: string): MountInstance | undefined => {
		return instances.value.find(instance => instance.id === id)
	}

	const hasInstances = (): boolean => instances.value.length > 0

	const count = computed(() => instances.value.length)

	// Auto cleanup on component unmount
	if (!isVue2) {
		onUnmounted(unmountAll)
	}

	return {
		instances,
		mount,
		unmount,
		unmountAll,
		getById,
		hasInstances,
		count,
	}
}

/**
 * useSingleton composable for managing singleton instances
 */
export function useSingleton(): UseSingletonReturn {
	const getOrCreate = <T = any>(key: string, component: any, options?: MountOptions): MountInstance<T> => {
		const existing = getSingleton(key)

		if (existing) {
			return existing as MountInstance<T>
		}

		const instance = createMount(component, { ...options, singleton: key }) as MountInstance<T>

		setSingleton(key, instance as MountInstance)
		instance.show()

		return instance
	}

	return { getOrCreate }
}
