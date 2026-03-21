/** Check if running in browser environment */
export function isBrowser(): boolean {
	return typeof document !== 'undefined'
}

/**
 * Resolve target element from selector string or Element.
 * @returns Element, ShadowRoot, or null if not found
 */
export function resolveTarget(target: string | Element | ShadowRoot | null | undefined): Element | ShadowRoot | null {
	if (!target) return null

	if (typeof target === 'string') {
		if (!isBrowser()) return null

		return document.querySelector(target)
	}

	return target
}

/**
 * Create a new DOM element with optional attributes.
 * @throws TypeError if not in browser
 */
export function createElement(tagName: string = 'div', attributes?: Record<string, string>): HTMLElement {
	if (!isBrowser()) {
		throw new TypeError('This plugin works in browser')
	}

	const el = document.createElement(tagName)

	if (attributes) {
		Object.entries(attributes).forEach(([key, value]) => {
			el.setAttribute(key, value)
		})
	}

	return el
}

/**
 * Append element to target (defaults to document.body).
 */
export function appendTo(element: Element, target: Element | ShadowRoot | string | null): void {
	if (!isBrowser()) return

	const resolvedTarget = resolveTarget(target)

	if (resolvedTarget) {
		resolvedTarget.appendChild(element)
	} else {
		document.body.appendChild(element)
	}
}

/** Remove element from DOM */
export function removeElement(element: Element): void {
	element.parentNode?.removeChild(element)
}

/** Check if element is in DOM */
export function isInDOM(element: Element): boolean {
	return document.body.contains(element)
}

/** Set z-index on element */
export function setZIndex(element: HTMLElement, zIndex: number | undefined): void {
	if (zIndex !== undefined) {
		element.style.zIndex = String(zIndex)
	}
}
