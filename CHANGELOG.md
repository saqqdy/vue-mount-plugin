# Changelog

All notable changes to this project will be documented in this file.

## [4.0.0] - 2025-03-18

### Added

- **Lifecycle Hooks**: `onBeforeMount`, `onMounted`, `onBeforeUnmount`, `onUnmounted` callbacks
- **Event Listeners**: `listeners` and `on` options for component event handling
- **Slots Support**: `slots` option to pass slot content to components
- **Ref Support**: `ref` option to get component instance reference
- **KeepAlive Options**: `keepAlive` option interface for component caching
- **Async Components**: Support for async components via function constructor
- **Method Aliases**: `destroy()` and `remove()` as aliases for `unmount()`
- **Chained API**: `setProps()`, `setListeners()`, `on()`, `setSlots()`, `setTarget()`, `setHooks()` methods
- **Instance Management**: Static `instances` getter, `unmountAll()`, `destroyAll()`, `getById()` methods
- **TypeScript Generics**: `Options<TContext>` with generic context type
- ESM module support (`"type": "module"` in package.json)
- ES5 build output (`dist/index.es5.js`, `dist/index.es5.min.js`) for legacy browser support
- `build:es5` script for ES5 compatible builds
- Comprehensive test coverage (86%+) with Vitest and jsdom

### Changed

- **Build System**: Migrate build scripts to use `tsx` instead of `rollup -c` with typescript plugin
- **Testing**: Migrate from Jest to Vitest with 73 test cases
- **Linting**: Migrate from `.eslintrc.js` to `eslint.config.mjs` (ESLint 9 flat config)
- **Dependencies**: Major version upgrades:
  - ESLint 8.x → 9.x
  - TypeScript 5.0.x → 5.9.x
  - Vitest (new) replacing Jest
  - All rollup plugins updated to latest
- **Code Refactoring**: Improved Vue 2 compatibility with wrapper element pattern

### Fixed

- IIFE build now correctly keeps `vue/vue-demi` as external dependencies (reduced from 240KB to 7KB)
- TypeScript plugin warning about temporary config files
- `mount()` method now returns `this` for potential chaining
- Vue 2 `$mount` no longer replaces target element when using `setTarget()`
- Vue 2 unmount now correctly removes wrapper element
- Vue 2 re-mount after unmount now works correctly
- Import `createVNode` and `render` from `vue-demi` now works in both Vue 2 and Vue 3

### Breaking Changes

- Minimum Node.js version: `>=12.20` → `>=14.14.0`
- Build output file names changed:

  | Old | New |
  |-----|-----|
  | `dist/index.esm-browser.js` | `dist/index.iife.js` |
  | `dist/index.esm-browser.prod.js` | `dist/index.iife.min.js` |
  | `dist/index.esm-bundler.js` | `dist/index.mjs` |
  | `dist/index.cjs.js` | `dist/index.cjs` |
  | `dist/index.global.js` | removed |
  | `dist/index.global.prod.js` | removed |

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
