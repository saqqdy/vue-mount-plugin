# mount()

Create a Mount instance and immediately show it.

## Signature

```typescript
function mount<T = any>(
  component: Component,
  options?: MountOptions
): MountInstance<T>
```

## Parameters

### component

- **Type**: `Component`
- **Required**: Yes

The Vue component to mount. Can be:
- A component object
- A `.vue` SFC import
- An async component

### options

- **Type**: `MountOptions`
- **Required**: No
- **Default**: `{}`

Mount configuration options.

## Returns

Returns a `MountInstance` that is already shown (`mounted: true`).

## Example

### Basic Usage

```typescript
import { mount } from 'vue-mount-plugin'
import Modal from './Modal.vue'

const instance = mount(Modal, {
  props: { title: 'Hello World' }
})

console.log(instance.mounted) // true
```

### With Options

```typescript
const instance = mount(Modal, {
  props: { title: 'Hello' },
  zIndex: 2000,
  tagName: 'section',
  on: {
    close: () => console.log('Closed')
  }
})
```

### Async/Await

```typescript
const result = await mount(ConfirmDialog, {
  props: { message: 'Are you sure?' }
})

if (result) {
  // User confirmed
}
```

### Singleton

```typescript
// Only one toast at a time
mount(Toast, {
  singleton: true,
  props: { message: 'Hello' }
})
```

## See Also

- [createMount()](/api/createMount) - Create without showing
- [MountInstance](/api/instance) - Instance API
- [MountOptions](/api/options) - All options
