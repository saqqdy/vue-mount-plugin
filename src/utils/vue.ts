import type { App, AppContext, Plugin } from 'vue-demi'

export type SFCWithInstall<T> = T &
	Plugin & {
		name: string
	}
export type SFCInstallWithContext<T> = SFCWithInstall<T> & {
	_context: AppContext | null
}

export const noop = (): void => {}

export function withInstall<T, E extends Record<string, unknown>>(component: T, extra?: E) {
	/* c8 ignore next */
	;(component as SFCWithInstall<T>).install = (app: App): void => {
		for (const comp of [component, ...Object.values(extra ?? {})] as SFCWithInstall<T>[]) {
			app.component(comp.name, comp)
		}
	}
	if (extra) {
		for (const [key, comp] of Object.entries(extra)) {
			;(component as any)[key] = comp
		}
	}
	return component as SFCWithInstall<T>
}

export function withFunctionInstall<T>(component: T, name: string) {
	/* c8 ignore next */
	;(component as SFCInstallWithContext<T>).install = (app: App): void => {
		;(component as SFCInstallWithContext<T>)._context = app._context
		app.config.globalProperties[name] = component
	}
	return component as SFCInstallWithContext<T>
}

export function withNoopInstall<T>(component: T) {
	/* c8 ignore next */
	;(component as SFCWithInstall<T>).install = noop
	return component as SFCWithInstall<T>
}
