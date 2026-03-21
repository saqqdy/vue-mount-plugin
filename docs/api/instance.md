# MountInstance

The MountInstance interface represents a mounted component instance.

## Properties

### id

- **Type**: `string` (readonly)
- **Description**: Unique identifier for this instance

```typescript
console.log(instance.id) // 'mount-1-abc123'
```

### mounted

- **Type**: `boolean` (readonly)
- **Description**: Whether the component is currently mounted

```typescript
console.log(instance.mounted) // true or false
```

### el

- **Type**: `HTMLElement | null` (readonly)
- **Description**: The DOM element containing the component

```typescript
if (instance.el) {
  instance.el.style.opacity = '0.5'
}
```

### vm

- **Type**: `ComponentPublicInstance | null` (readonly)
- **Description**: The Vue component instance

```typescript
// Access component data/methods
console.log(instance.vm?.someData)
instance.vm?.someMethod()
```

### options

- **Type**: `MountOptions`
- **Description**: The merged options (global + instance)

```typescript
console.log(instance.options.props)
console.log(instance.options.zIndex)
```

## Methods

### show()

Show/mount the component. Returns `this` for chaining.

```typescript
instance.show()
```

### hide()

Hide the component but keep the instance. Returns `this` for chaining.

```typescript
instance.hide()
```

### unmount()

Unmount and destroy the component completely.

```typescript
instance.unmount()
```

### destroy()

Alias for `unmount()`.

```typescript
instance.destroy()
```

### remove()

Alias for `unmount()`.

```typescript
instance.remove()
```

### setProps()

Update component props. Returns `this` for chaining.

```typescript
instance.setProps({ title: 'New Title' })
instance.setProps({ loading: true, data: newData })
```

### setTarget()

Set mount target. Returns `this` for chaining.

```typescript
instance.setTarget('#container')
instance.setTarget(document.body)
```

### setSlots()

Set slots. Returns `this` for chaining.

```typescript
import { h } from 'vue'

instance.setSlots({
  default: [h('p', 'Content')],
  header: [h('h2', 'Title')]
})
```

### setHooks()

Set lifecycle hooks. Returns `this` for chaining.

```typescript
instance.setHooks({
  onMounted: (inst) => console.log('Mounted'),
  onUnmounted: (inst) => console.log('Unmounted')
})
```

### on()

Add event listener. Returns `this` for chaining.

```typescript
instance.on('close', () => {
  console.log('Closed')
})
```

### off()

Remove event listener. Returns `this` for chaining.

```typescript
const handler = () => console.log('Event')
instance.on('event', handler)
instance.off('event', handler) // Remove specific
instance.off('event') // Remove all for this event
```

### emit()

Emit event. Returns `this` for chaining.

```typescript
instance.emit('custom-event', data1, data2)
```

## Promise Methods

### then()

Wait for close event.

```typescript
const result = await instance
```

### catch()

Handle promise rejection.

```typescript
instance.catch(error => {
  console.error('Error:', error)
})
```

### finally()

Run cleanup after promise settles.

```typescript
instance.finally(() => {
  console.log('Done')
})
```

## Type Definition

```typescript
interface MountInstance<T = ComponentPublicInstance> {
  // Properties
  vm: T | null
  el: HTMLElement | null
  mounted: boolean
  id: string
  options: MountOptions

  // Methods
  setProps: (props: Partial<Data>) => MountInstance<T>
  show: () => MountInstance<T>
  hide: () => MountInstance<T>
  unmount: () => void
  on: (event: string, handler: Listener) => MountInstance<T>
  off: (event: string, handler?: Listener) => MountInstance<T>
  emit: (event: string, ...args: any[]) => MountInstance<T>
  then: <TResult = void>(resolve: (value: any) => TResult) => Promise<TResult>
  setTarget: (target: string | Element | ShadowRoot) => MountInstance<T>
  setHooks: (hooks: LifecycleHooks) => MountInstance<T>
  setSlots: (slots: Slots) => MountInstance<T>
}
```
