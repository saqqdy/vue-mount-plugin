# createMount()

Create a Mount instance without showing it. Use this for manual control over the show/hide/unmount lifecycle.

## Signature

```typescript
function createMount<T = any>(
  component: Component,
  options?: MountOptions
): MountInstance<T>
```

## Parameters

### component

- **Type**: `Component`
- **Required**: Yes

The Vue component to mount.

### options

- **Type**: `MountOptions`
- **Required**: No
- **Default**: `{}`

Mount configuration options.

## Returns

Returns a `MountInstance` that is NOT shown (`mounted: false`).

## Example

### Basic Usage

```typescript
import { createMount } from 'vue-mount-plugin'
import Modal from './Modal.vue'

const instance = createMount(Modal, {
  props: { title: 'Hello World' }
})

console.log(instance.mounted) // false

// Show when needed
instance.show()

console.log(instance.mounted) // true
```

### Full Lifecycle Control

```typescript
const instance = createMount(Modal, {
  props: { title: 'Manual Control' }
})

// Not shown yet
instance.show()  // Mount and show
instance.hide()  // Hide but keep instance
instance.show()  // Show again
instance.unmount() // Destroy completely
```

### Chained Configuration

```typescript
const instance = createMount(Modal)
  .setProps({ title: 'Hello' })
  .on('close', handleClose)
  .setTarget('#container')
  .setHooks({ onMounted: () => console.log('Ready') })

// Show when ready
instance.show()
```

## When to Use

Use `createMount()` instead of `mount()` when:

- You need to configure the instance before showing
- You want to show/hide multiple times without recreating
- You need access to the instance before it's mounted
- You're implementing a persistent UI element

## See Also

- [mount()](/api/mount) - Create and show immediately
- [MountInstance](/api/instance) - Instance API
