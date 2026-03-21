import type { Listener } from '../types'

/** Instance counter for unique IDs */
let instanceCounter = 0

/**
 * Simple event emitter for Mount instance.
 * Supports on/off/emit pattern with error handling.
 */
export class EventEmitter {
	private events = new Map<string, Set<Listener>>()

	/** Add event listener */
	on(event: string, handler: Listener): this {
		if (!this.events.has(event)) {
			this.events.set(event, new Set())
		}
		this.events.get(event)!.add(handler)

		return this
	}

	/** Remove event listener (all listeners if handler not provided) */
	off(event: string, handler?: Listener): this {
		if (handler) {
			this.events.get(event)?.delete(handler)
		} else {
			this.events.delete(event)
		}

		return this
	}

	/** Emit event with arguments */
	emit(event: string, ...args: any[]): this {
		this.events.get(event)?.forEach(handler => {
			try {
				handler(...args)
			} catch (error) {
				console.error(`Error in event handler for "${event}":`, error)
			}
		})

		return this
	}

	/** Check if has listeners for event */
	has(event: string): boolean {
		return this.events.has(event) && this.events.get(event)!.size > 0
	}

	/** Clear all listeners */
	clear(): void {
		this.events.clear()
	}

	/** Get all event names */
	eventNames(): string[] {
		return Array.from(this.events.keys())
	}
}

/** Create a unique ID for mount instances */
export function createInstanceId(): string {
	return `mount-${++instanceCounter}-${Date.now().toString(36)}`
}

/** Capitalize first letter of a string */
export function capitalize(str: string): string {
	return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Convert kebab-case to camelCase.
 * @example 'custom-event' -> 'customEvent'
 */
export function toCamelCase(str: string): string {
	return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
}

/**
 * Convert event name to Vue 3 handler prop name.
 * @example 'close' -> 'onClose', 'custom-event' -> 'onCustomEvent'
 */
export function eventToPropName(event: string): string {
	return `on${capitalize(toCamelCase(event))}`
}
