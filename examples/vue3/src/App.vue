<script setup lang="ts">
import { ref, h, defineAsyncComponent, getCurrentInstance } from 'vue'
import Mount from 'vue-mount-plugin'
import DemoComponent from './components/DemoComponent.vue'
import ModalComponent from './components/ModalComponent.vue'
import SlotComponent from './components/SlotComponent.vue'

const { proxy } = getCurrentInstance()!

// Log for displaying messages
const logs = ref<string[]>([])
const logEl = ref<HTMLElement | null>(null)

const addLog = (message: string, type = ''): void => {
  const timestamp = new Date().toLocaleTimeString()
  logs.value.push(`[${timestamp}] ${message}`)
  // Auto scroll to bottom
  setTimeout(() => {
    if (logEl.value) {
      logEl.value.scrollTop = logEl.value.scrollHeight
    }
  }, 0)
}

const clearLogs = (): void => {
  logs.value = []
}

// 1. Basic Mount/Unmount
let basicInstance: Mount | null = null

const mountBasic = (): void => {
  basicInstance = new Mount(DemoComponent, {
    parent: proxy!.$root,
    props: { title: 'Basic Mount', message: 'Hello from vue-mount-plugin!' },
    listeners: {
      close: () => {
        addLog('close event received', 'event')
        basicInstance?.unmount()
        basicInstance = null
      },
    },
  })
  basicInstance.mount()
  addLog('Basic instance mounted')
}

const unmountBasic = (): void => {
  if (basicInstance) {
    basicInstance.unmount()
    basicInstance = null
    addLog('Basic instance unmounted')
  }
}

// 2. Lifecycle Hooks
let hooksInstance: Mount | null = null

const mountWithHooks = (): void => {
  hooksInstance = new Mount(DemoComponent, {
    parent: proxy!.$root,
    props: { title: 'Lifecycle Hooks', message: 'Watch the console for hooks' },
    listeners: {
      close: () => {
        addLog('close event received', 'event')
        hooksInstance?.unmount()
        hooksInstance = null
      },
    },
    onBeforeMount: (instance) => {
      addLog(`onBeforeMount triggered (id: ${instance.id})`, 'hook')
    },
    onMounted: (instance) => {
      addLog(`onMounted triggered (id: ${instance.id})`, 'hook')
    },
    onBeforeUnmount: (instance) => {
      addLog(`onBeforeUnmount triggered (id: ${instance.id})`, 'hook')
    },
    onUnmounted: () => {
      addLog('onUnmounted triggered', 'hook')
    },
  })
  hooksInstance.mount()
}

const unmountWithHooks = (): void => {
  if (hooksInstance) {
    hooksInstance.unmount()
    hooksInstance = null
  }
}

// 3. Event Listeners
let listenerInstance: Mount | null = null

const mountWithListeners = (): void => {
  listenerInstance = new Mount(DemoComponent, {
    parent: proxy!.$root,
    props: { title: 'Event Listeners', message: 'Click the button in the component!' },
    listeners: {
      close: () => {
        addLog('close event received', 'event')
        listenerInstance?.unmount()
        listenerInstance = null
      },
      submit: (data: unknown) => {
        addLog(`submit event received: ${JSON.stringify(data)}`, 'event')
      },
    },
  })
  listenerInstance.mount()
  addLog('Mounted with event listeners')
}

// 4. Slots
let slotsInstance: Mount | null = null

const mountWithSlots = (): void => {
  slotsInstance = new Mount(SlotComponent, {
    parent: proxy!.$root,
    props: { title: 'Slots Demo' },
    listeners: {
      close: () => {
        addLog('close event received', 'event')
        slotsInstance?.unmount()
        slotsInstance = null
      },
    },
    slots: {
      default: () => h('p', 'This is the default slot content'),
      header: () => h('h4', { style: { color: '#42b883' } }, 'Header Slot'),
      footer: () => h('button', { class: 'secondary' }, 'Footer Button'),
    },
  })
  slotsInstance.mount()
  addLog('Mounted with slots')
}

const unmountSlots = (): void => {
  if (slotsInstance) {
    slotsInstance.unmount()
    slotsInstance = null
  }
}

// 5. Ref Support
const componentRef = ref<any>(null)
let refInstance: Mount | null = null

const mountWithRef = (): void => {
  refInstance = new Mount(DemoComponent, {
    parent: proxy!.$root,
    props: { title: 'Ref Demo', message: 'Check the ref value' },
    ref: componentRef,
    listeners: {
      close: () => {
        addLog('close event received', 'event')
        refInstance?.unmount()
        refInstance = null
      },
    },
  })
  refInstance.mount()
  addLog(`Mounted with ref. componentRef.value: ${componentRef.value ? 'exists' : 'null'}`)
}

const unmountRef = (): void => {
  if (refInstance) {
    refInstance.unmount()
    refInstance = null
    addLog(`Unmounted. componentRef.value: ${componentRef.value ? 'exists' : 'null'}`)
  }
}

// 6. Chained API
let chainedInstance: Mount | null = null

const mountChained = (): void => {
  chainedInstance = new Mount(DemoComponent)
    .setProps({ title: 'Chained API', message: 'Built with method chaining!' })
    .setTarget('#chained-target')
    .setListeners({
      close: () => {
        addLog('Chained instance closed via event')
        chainedInstance?.unmount()
        chainedInstance = null
      },
    })
    .setHooks({
      onMounted: () => addLog('Chained instance mounted', 'hook'),
    })
    .mount()

  addLog('Chained mount complete')
}

const unmountChained = (): void => {
  if (chainedInstance) {
    chainedInstance.unmount()
    chainedInstance = null
  }
}

// 7. Instance Management
const showInstances = (): void => {
  const instances = Mount.instances
  addLog(`Total active instances: ${instances.length}`)
  instances.forEach((instance, index) => {
    addLog(`  Instance ${index + 1}: id=${instance.id}`)
  })
}

const unmountAll = (): void => {
  const count = Mount.instances.length
  Mount.unmountAll()
  basicInstance = null
  hooksInstance = null
  listenerInstance = null
  slotsInstance = null
  refInstance = null
  chainedInstance = null
  asyncInstance = null
  addLog(`Unmounted all ${count} instances`)
}

const getById = (): void => {
  const id = prompt('Enter instance ID:')
  if (id) {
    const instance = Mount.getById(parseInt(id))
    if (instance) {
      addLog(`Found instance with id=${instance.id}`)
    } else {
      addLog(`No instance found with id=${id}`)
    }
  }
}

// 8. Async Component
let asyncInstance: Mount | null = null

const mountAsync = (): void => {
  const AsyncDemo = defineAsyncComponent(() => import('./components/AsyncComponent.vue'))

  asyncInstance = new Mount(AsyncDemo, {
    parent: proxy!.$root,
    props: { title: 'Async Component' },
    listeners: {
      close: () => {
        addLog('close event received', 'event')
        asyncInstance?.unmount()
        asyncInstance = null
      },
    },
  })
  asyncInstance.mount()
  addLog('Async component mounted')
}

const unmountAsync = (): void => {
  if (asyncInstance) {
    asyncInstance.unmount()
    asyncInstance = null
  }
}

// 9. Modal with close
const openModal = (): void => {
  const modal = new Mount(ModalComponent, {
    parent: proxy!.$root,
    props: { title: 'Modal Title' },
    listeners: {
      close: () => {
        addLog('Modal closed')
        modal.unmount()
      },
    },
  })
  modal.mount()
  addLog('Modal opened')
}

// 10. Custom Target
let customTargetInstance: Mount | null = null

const mountToCustomTarget = (): void => {
  customTargetInstance = new Mount(DemoComponent, {
    parent: proxy!.$root,
    props: { title: 'Custom Target', message: 'Mounted to #custom-container' },
    target: '#custom-container',
    listeners: {
      close: () => {
        addLog('close event received', 'event')
        customTargetInstance?.unmount()
        customTargetInstance = null
      },
    },
  })
  customTargetInstance.mount()
  addLog('Mounted to custom target')
}

const unmountCustomTarget = (): void => {
  if (customTargetInstance) {
    customTargetInstance.unmount()
    customTargetInstance = null
  }
}
</script>

<template>
  <div>
    <h1>vue-mount-plugin - Vue 3 Examples</h1>
    <p style="margin-bottom: 12px;">Demonstrating all features of vue-mount-plugin v4.0</p>

    <!-- Log Display -->
    <div class="section log-section">
      <h3>Event Log</h3>
      <div class="log" ref="logEl">
        <div v-for="(log, index) in logs" :key="index" class="log-entry">
          {{ log }}
        </div>
        <div v-if="logs.length === 0" style="color: #999">No events yet...</div>
      </div>
      <button class="secondary" @click="clearLogs">Clear Logs</button>
    </div>

    <!-- 2 Column Layout -->
    <div class="grid">
      <!-- Column 1 -->
      <div class="col">
        <!-- 1. Basic Mount -->
        <div class="section">
          <h3>1. Basic Mount/Unmount</h3>
          <p>Simple component mounting.</p>
          <div class="btn-group">
            <button @click="mountBasic">Mount</button>
            <button class="danger" @click="unmountBasic">Unmount</button>
          </div>
        </div>

        <!-- 2. Lifecycle Hooks -->
        <div class="section">
          <h3>2. Lifecycle Hooks</h3>
          <p>onBeforeMount, onMounted, etc.</p>
          <div class="btn-group">
            <button @click="mountWithHooks">Mount</button>
            <button class="danger" @click="unmountWithHooks">Unmount</button>
          </div>
        </div>

        <!-- 3. Event Listeners -->
        <div class="section">
          <h3>3. Event Listeners</h3>
          <p>Listen to component events.</p>
          <button @click="mountWithListeners">Mount with Listeners</button>
        </div>

        <!-- 4. Slots -->
        <div class="section">
          <h3>4. Slots Support</h3>
          <p>Pass slot content.</p>
          <div class="btn-group">
            <button @click="mountWithSlots">Mount</button>
            <button class="danger" @click="unmountSlots">Unmount</button>
          </div>
        </div>

        <!-- 5. Ref Support -->
        <div class="section">
          <h3>5. Ref Support</h3>
          <p>Get component instance reference.</p>
          <div class="btn-group">
            <button @click="mountWithRef">Mount</button>
            <button class="danger" @click="unmountRef">Unmount</button>
          </div>
        </div>
      </div>

      <!-- Column 2 -->
      <div class="col">
        <!-- 6. Chained API -->
        <div class="section">
          <h3>6. Chained API</h3>
          <p>Fluent method chaining.</p>
          <div id="chained-target" class="target-box">
            Chained component will mount here
          </div>
          <div class="btn-group">
            <button @click="mountChained">Mount</button>
            <button class="danger" @click="unmountChained">Unmount</button>
          </div>
        </div>

        <!-- 7. Instance Management -->
        <div class="section">
          <h3>7. Instance Management</h3>
          <p>Track and manage instances.</p>
          <div class="btn-group">
            <button @click="showInstances">Show All</button>
            <button @click="getById">Get By ID</button>
            <button class="danger" @click="unmountAll">Unmount All</button>
          </div>
        </div>

        <!-- 8. Async Component -->
        <div class="section">
          <h3>8. Async Component</h3>
          <p>defineAsyncComponent support.</p>
          <div class="btn-group">
            <button @click="mountAsync">Mount</button>
            <button class="danger" @click="unmountAsync">Unmount</button>
          </div>
        </div>

        <!-- 9. Modal -->
        <div class="section">
          <h3>9. Modal Pattern</h3>
          <p>Common modal dialog.</p>
          <button @click="openModal">Open Modal</button>
        </div>

        <!-- 10. Custom Target -->
        <div class="section">
          <h3>10. Custom Target</h3>
          <p>Mount to specific DOM element.</p>
          <div id="custom-container" class="target-box" style="background: #f9f9f9;">
            Custom container
          </div>
          <div class="btn-group">
            <button @click="mountToCustomTarget">Mount</button>
            <button class="danger" @click="unmountCustomTarget">Unmount</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.col {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.log-section {
  margin-bottom: 12px;
}

.target-box {
  min-height: 20px;
  border: 1px dashed #ccc;
  padding: 6px;
  margin: 6px 0;
  font-size: 12px;
  color: #666;
}

.btn-group {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

@media (max-width: 600px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
