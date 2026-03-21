# Changelog

All notable changes to this project will be documented in this file.

## [4.0.0] - 2025-03-21

### Added

- **Functional API**: New `mount()` and `createMount()` functions replace class-based API
- **useMount Composable**: Vue 3 Composition API support with auto cleanup
- **Singleton Mode**: `singleton` option for single instance per component/key
- **Promise Support**: `await` mount instance for async result handling
- **Event System**: `on()`, `off()`, `emit()` methods for event handling
- **hide() Method**: Hide component without destroying instance
- **Context Inheritance**: `app` option for Vue 3 context (router, pinia, i18n)
- **Global Configuration**: `setGlobalConfig()` and `globalConfig` for defaults
- **Instance Management**: `getInstances()`, `getInstanceById()`, `unmountAll()`, `isMounted()`
- **TypeScript Support**: Full TypeScript types and generics
- **Lifecycle Hooks**: `onBeforeMount`, `onMounted`, `onBeforeUnmount`, `onUnmounted` callbacks
- **Slots Support**: `slots` option and `setSlots()` method
- **Chained API**: All setters return `this` for chaining
- ES5 build output for legacy browser support

### Changed

- **API Modernization**: Replaced class-based `new Mount()` with functional API
- **Build System**: Migrated to tsdown for faster builds
- **Testing**: Migrated from Jest to Vitest with 43+ test cases
- **Linting**: Migrated to ESLint 9 flat config
- **Code Refactoring**: Improved Vue 2/3 compatibility with shared base class

### Fixed

- IIFE build correctly keeps vue/vue-demi as external dependencies
- Vue 2 context inheritance (router, store, i18n)
- Vue 3 context inheritance via app option
- Memory leaks with proper cleanup on unmount
- Event emitter cleanup on unmount

### Breaking Changes

- API change: `new Mount()` → `mount()` / `createMount()`
- Minimum Node.js version: `>=14.14.0`
- Build output file names changed:

  | Old | New |
  |-----|-----|
  | `dist/index.esm-browser.js` | `dist/index.iife.js` |
  | `dist/index.esm-browser.prod.js` | `dist/index.iife.min.js` |
  | `dist/index.esm-bundler.js` | `dist/index.mjs` |
  | `dist/index.cjs.js` | `dist/index.cjs` |

## [3.1.0] - 2023-05-23

### Fixed

- Fix build outputs

### Changed

- Dependency updates via dependabot

## [3.0.0] - 2023-05-22

### Changed

- New build output structure
- Remove ES5 build (re-added in v4.0.0)
- Dependency updates

## [2.1.1] - 2023-04-04

### Changed

- Optimized build script
- Dependency updates

## [2.1.0] - 2023-04-03

### Added

- ES5 package export

### Changed

- Remove unnecessary banner
- Fix export types
- Dependency updates

## [2.0.0] - 2023-02-16

### Changed

- **Breaking**: `destroy()` method renamed to `unmount()`
- Downgrade to support IE11
- Build output includes IIFE format

## [1.1.0] - 2023-02-15

### Added

- Support for customized `tagName` option
- `target` option accepts string selector

### Fixed

- Fix vNode.id naming

## [1.0.0] - 2023-02-06

### Added

- Initial release
- Support Vue 2.0 and Vue 3.0 via vue-demi
- Mount/unmount Vue components programmatically
