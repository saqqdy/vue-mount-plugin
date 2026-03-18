<template>
  <div>
    <h1>vue-mount-plugin - Vue 2 Examples</h1>
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

        <!-- 8. Modal -->
        <div class="section">
          <h3>8. Modal Pattern</h3>
          <p>Common modal dialog.</p>
          <button @click="openModal">Open Modal</button>
        </div>

        <!-- 9. Custom Target -->
        <div class="section">
          <h3>9. Custom Target</h3>
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

<script>
import Vue from 'vue'
import Mount from 'vue-mount-plugin'
import DemoComponent from './components/DemoComponent.vue'
import ModalComponent from './components/ModalComponent.vue'
import SlotComponent from './components/SlotComponent.vue'

export default {
  name: 'App',
  components: {
    DemoComponent,
    ModalComponent,
    SlotComponent,
  },
  data() {
    return {
      logs: [],
      basicInstance: null,
      hooksInstance: null,
      listenerInstance: null,
      slotsInstance: null,
      refInstance: null,
      chainedInstance: null,
      modalInstance: null,
      customTargetInstance: null,
      componentRef: { value: null },
    }
  },
  methods: {
    addLog(message) {
      const timestamp = new Date().toLocaleTimeString()
      this.logs.push(`[${timestamp}] ${message}`)
      this.$nextTick(() => {
        const logEl = this.$refs.logEl
        if (logEl) {
          logEl.scrollTop = logEl.scrollHeight
        }
      })
    },
    clearLogs() {
      this.logs = []
    },

    // 1. Basic Mount/Unmount
    mountBasic() {
      const self = this
      this.basicInstance = new Mount(DemoComponent, {
        parent: this.$root,
        props: { title: 'Basic Mount', message: 'Hello from vue-mount-plugin!' },
        listeners: {
          close() {
            self.addLog('close event received')
            if (self.basicInstance) {
              self.basicInstance.unmount()
              self.basicInstance = null
            }
          },
        },
      })
      this.basicInstance.mount()
      this.addLog('Basic instance mounted')
    },
    unmountBasic() {
      if (this.basicInstance) {
        this.basicInstance.unmount()
        this.basicInstance = null
        this.addLog('Basic instance unmounted')
      }
    },

    // 2. Lifecycle Hooks
    mountWithHooks() {
      const self = this
      this.hooksInstance = new Mount(DemoComponent, {
        parent: this.$root,
        props: { title: 'Lifecycle Hooks', message: 'Watch the console for hooks' },
        listeners: {
          close() {
            self.addLog('close event received')
            if (self.hooksInstance) {
              self.hooksInstance.unmount()
              self.hooksInstance = null
            }
          },
        },
        onBeforeMount(instance) {
          self.addLog(`onBeforeMount triggered (id: ${instance.id})`)
        },
        onMounted(instance) {
          self.addLog(`onMounted triggered (id: ${instance.id})`)
        },
        onBeforeUnmount(instance) {
          self.addLog(`onBeforeUnmount triggered (id: ${instance.id})`)
        },
        onUnmounted() {
          self.addLog('onUnmounted triggered')
        },
      })
      this.hooksInstance.mount()
    },
    unmountWithHooks() {
      if (this.hooksInstance) {
        this.hooksInstance.unmount()
        this.hooksInstance = null
      }
    },

    // 3. Event Listeners
    mountWithListeners() {
      const self = this
      this.listenerInstance = new Mount(DemoComponent, {
        parent: this.$root,
        props: { title: 'Event Listeners', message: 'Click the button in the component!' },
        listeners: {
          close() {
            self.addLog('close event received')
            if (self.listenerInstance) {
              self.listenerInstance.unmount()
              self.listenerInstance = null
            }
          },
          submit(data) {
            self.addLog(`submit event received: ${JSON.stringify(data)}`)
          },
        },
      })
      this.listenerInstance.mount()
      this.addLog('Mounted with event listeners')
    },

    // 4. Slots
    mountWithSlots() {
      const self = this
      this.slotsInstance = new Mount(SlotComponent, {
        parent: this.$root,
        props: { title: 'Slots Demo' },
        listeners: {
          close() {
            self.addLog('close event received')
            if (self.slotsInstance) {
              self.slotsInstance.unmount()
              self.slotsInstance = null
            }
          },
        },
        slots: {
          default: [this.$createElement('p', 'This is the default slot content')],
          header: [this.$createElement('h4', { style: { color: '#42b883' } }, 'Header Slot')],
          footer: [this.$createElement('button', { class: 'secondary' }, 'Footer Button')],
        },
      })
      this.slotsInstance.mount()
      this.addLog('Mounted with slots')
    },
    unmountSlots() {
      if (this.slotsInstance) {
        this.slotsInstance.unmount()
        this.slotsInstance = null
      }
    },

    // 5. Ref Support
    mountWithRef() {
      const self = this
      this.refInstance = new Mount(DemoComponent, {
        parent: this.$root,
        props: { title: 'Ref Demo', message: 'Check the ref value' },
        ref: this.componentRef,
        listeners: {
          close() {
            self.addLog('close event received')
            if (self.refInstance) {
              self.refInstance.unmount()
              self.refInstance = null
            }
          },
        },
      })
      this.refInstance.mount()
      this.addLog(`Mounted with ref. componentRef.value: ${this.componentRef.value ? 'exists' : 'null'}`)
    },
    unmountRef() {
      if (this.refInstance) {
        this.refInstance.unmount()
        this.refInstance = null
        this.addLog(`Unmounted. componentRef.value: ${this.componentRef.value ? 'exists' : 'null'}`)
      }
    },

    // 6. Chained API
    mountChained() {
      const self = this
      this.chainedInstance = new Mount(DemoComponent)
        .setProps({ title: 'Chained API', message: 'Built with method chaining!' })
        .setTarget('#chained-target')
        .setListeners({
          close() {
            self.addLog('Chained instance closed via event')
            if (self.chainedInstance) {
              self.chainedInstance.unmount()
              self.chainedInstance = null
            }
          },
        })
        .setHooks({
          onMounted: () => self.addLog('Chained instance mounted'),
        })
        .mount()

      this.addLog('Chained mount complete')
    },
    unmountChained() {
      if (this.chainedInstance) {
        this.chainedInstance.unmount()
        this.chainedInstance = null
      }
    },

    // 7. Instance Management
    showInstances() {
      const instances = Mount.instances
      this.addLog(`Total active instances: ${instances.length}`)
      instances.forEach((instance, index) => {
        this.addLog(`  Instance ${index + 1}: id=${instance.id}`)
      })
    },
    unmountAll() {
      const count = Mount.instances.length
      Mount.unmountAll()
      this.basicInstance = null
      this.hooksInstance = null
      this.listenerInstance = null
      this.slotsInstance = null
      this.refInstance = null
      this.chainedInstance = null
      this.modalInstance = null
      this.customTargetInstance = null
      this.addLog(`Unmounted all ${count} instances`)
    },
    getById() {
      const id = prompt('Enter instance ID:')
      if (id) {
        const instance = Mount.getById(parseInt(id))
        if (instance) {
          this.addLog(`Found instance with id=${instance.id}`)
        } else {
          this.addLog(`No instance found with id=${id}`)
        }
      }
    },

    // 8. Modal
    openModal() {
      const self = this
      this.modalInstance = new Mount(ModalComponent, {
        parent: this.$root,
        props: { title: 'Modal Title' },
        listeners: {
          close() {
            self.addLog('Modal closed')
            if (self.modalInstance) {
              self.modalInstance.unmount()
              self.modalInstance = null
            }
          },
        },
      })
      this.modalInstance.mount()
      this.addLog('Modal opened')
    },

    // 9. Custom Target
    mountToCustomTarget() {
      const self = this
      this.customTargetInstance = new Mount(DemoComponent, {
        parent: this.$root,
        props: { title: 'Custom Target', message: 'Mounted to #custom-container' },
        target: '#custom-container',
        listeners: {
          close() {
            self.addLog('close event received')
            if (self.customTargetInstance) {
              self.customTargetInstance.unmount()
              self.customTargetInstance = null
            }
          },
        },
      })
      this.customTargetInstance.mount()
      this.addLog('Mounted to custom target')
    },
    unmountCustomTarget() {
      if (this.customTargetInstance) {
        this.customTargetInstance.unmount()
        this.customTargetInstance = null
      }
    },
  },
}
</script>

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
