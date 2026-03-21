# Migration from v3.x to v4.0

This guide helps you migrate from vue-mount-plugin v3.x to v4.0.

## Overview

v4.0 is a major rewrite with a cleaner functional API. The main change is moving from a class-based API to function-based API.

## Quick Migration Checklist

- [ ] Replace `new Mount()` with `mount()` or `createMount()`
- [ ] Update property names (`id` is now string, `componentInstance` → `vm`)
- [ ] Update method calls (`.mount()` → `.show()`)
- [ ] Update static method calls (`Mount.instances` → `getInstances()`)
- [ ] Update build file paths if using CDN

## Breaking Changes

### API Change: Class → Functions

**v3.x**
```typescript
import Mount from 'vue-mount-plugin'

const instance = new Mount(Component, options)
instance.mount()
```

**v4.0**
```typescript
import { mount, createMount } from 'vue-mount-plugin'

// Create and show immediately
const instance = mount(Component, options)

// Or create only, show later
const instance = createMount(Component, options)
instance.show()
```

### Method Renamed

**v3.x**
```typescript
instance.mount()    // Show the component
```

**v4.0**
```typescript
instance.show()     // Show the component
```

### Property Changes

| v3.x | v4.0 | Notes |
|------|------|-------|
| `instance.id` (number) | `instance.id` (string) | Now string for better uniqueness |
| `instance.componentInstance` | `instance.vm` | Renamed |
| `instance.vNode` | - | Removed |
| `instance.target` | `instance.el` | Renamed |
| - | `instance.mounted` | New: boolean state |

### Static Methods → Functions

**v3.x**
```typescript
Mount.instances
Mount.getById(1)
Mount.unmountAll()
```

**v4.0**
```typescript
import { getInstances, getInstanceById, unmountAll } from 'vue-mount-plugin'

getInstances()
getInstanceById('mount-1-xxx')
unmountAll()
```

## Code Migration Examples

### Basic Usage

**v3.x**
```typescript
import Mount from 'vue-mount-plugin'

const instance = new Mount(Modal, { parent: this.$root })
instance.mount()
instance.unmount()
```

**v4.0**
```typescript
import { mount } from 'vue-mount-plugin'

const instance = mount(Modal, { app: this.$root })
instance.unmount()
```

### Deferred Mount

**v3.x**
```typescript
const instance = new Mount(Modal, options)
// ... later
instance.mount()
```

**v4.0**
```typescript
import { createMount } from 'vue-mount-plugin'

const instance = createMount(Modal, options)
// ... later
instance.show()
```

### Instance Management

**v3.x**
```typescript
const all = Mount.instances
const found = Mount.getById(1)
Mount.unmountAll()
```

**v4.0**
```typescript
import { getInstances, getInstanceById, unmountAll } from 'vue-mount-plugin'

const all = getInstances()
const found = getInstanceById('mount-1-xxx')
unmountAll()
```

### Access Component Instance

**v3.x**
```typescript
const instance = new Mount(Modal)
instance.mount()
console.log(instance.componentInstance)
```

**v4.0**
```typescript
const instance = mount(Modal)
console.log(instance.vm)
```

### Event Listeners

**v3.x**
```typescript
const instance = new Mount(Modal, {
  listeners: { close: handleClose }
})
instance.mount()
```

**v4.0 - Option 1**
```typescript
const instance = mount(Modal, {
  listeners: { close: handleClose }
})
```

**v4.0 - Option 2 (New!)**
```typescript
const instance = mount(Modal)
instance.on('close', handleClose)
```

### Chained API

**v3.x**
```typescript
const instance = new Mount(Modal)
  .setProps({ title: 'Hello' })
  .setTarget('#container')
  .mount()
```

**v4.0**
```typescript
const instance = createMount(Modal)
  .setProps({ title: 'Hello' })
  .setTarget('#container')
  .show()
```

## New Features in v4.0

### Singleton Mode

```typescript
mount(Toast, {
  singleton: true,
  props: { message: 'Hello' }
})
```

### Promise Support

```typescript
const result = await mount(ConfirmDialog, {
  props: { message: 'Are you sure?' }
})
```

### hide() Method

```typescript
const instance = mount(Modal)
instance.hide()    // Hidden but instance preserved
instance.show()    // Show again
```

### useMount Composable

```typescript
const { mount, unmountAll, count } = useMount()
const instance = mount(Modal) // Auto cleanup on unmount
```

### Global Configuration

```typescript
setGlobalConfig({ zIndex: 2000 })
mount(Modal) // Uses global config
```

## Build Output Changes

| v3.x | v4.0 |
|------|------|
| `dist/index.esm-browser.js` | `dist/index.iife.js` |
| `dist/index.esm-browser.prod.js` | `dist/index.iife.min.js` |
| `dist/index.esm-bundler.js` | `dist/index.mjs` |
| `dist/index.cjs.js` | `dist/index.cjs` |
| `dist/index.global.js` | removed |
| `dist/index.global.prod.js` | removed |

## CDN Migration

**v3.x**
```html
<script src="//unpkg.com/vue-mount-plugin@3/dist/index.esm-browser.prod.js"></script>
```

**v4.0**
```html
<script src="//unpkg.com/vue-mount-plugin@4/dist/index.iife.min.js"></script>
```

## Node.js Version

Minimum Node.js version: `>=14.14.0` (was `>=12.20`)

## Migration Script

Use these regex replacements for large projects:

| Find | Replace |
|------|---------|
| `new Mount\(([^)]+)\)` | `mount($1)` |
| `\.mount\(\)` | `.show()` |
| `Mount\.instances` | `getInstances()` |
| `Mount\.getById\(([^)]+)\)` | `getInstanceById($1)` |
| `Mount\.unmountAll\(\)` | `unmountAll()` |
| `\.componentInstance` | `.vm` |
| `\.target` | `.el` |
