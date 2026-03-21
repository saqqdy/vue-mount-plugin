import type { GlobalConfig } from './types'

/**
 * Global configuration storage
 */
export const globalConfig: GlobalConfig = {
	installed: false,
}

/**
 * Set global configuration
 */
export function setGlobalConfig(config: Partial<GlobalConfig>): void {
	Object.assign(globalConfig, config)
}

/**
 * Get global configuration
 */
export function getGlobalConfig(): GlobalConfig {
	return { ...globalConfig }
}

/**
 * Reset global configuration
 */
export function resetGlobalConfig(): void {
	Object.keys(globalConfig).forEach(key => {
		delete (globalConfig as any)[key]
	})
	globalConfig.installed = false
}

/**
 * Merge options with global config
 */
export function mergeWithGlobalConfig<T extends Record<string, any>>(options: T): T {
	return {
		...globalConfig,
		...options,
	}
}
