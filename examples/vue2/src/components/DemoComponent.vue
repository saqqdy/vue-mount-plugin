<template>
  <div style="background: white; border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin: 10px 0; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
    <h4 style="margin: 0 0 10px 0; color: #42b883;">{{ title || 'Demo Component' }}</h4>
    <p style="margin: 0 0 15px 0; color: #666;">{{ message || 'Default message' }}</p>
    <div style="display: flex; align-items: center; gap: 10px;">
      <span>Count: {{ count }}</span>
      <button @click="increment">Increment</button>
      <button class="secondary" @click="handleSubmit">Submit</button>
      <button class="danger" @click="handleClose">Close</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DemoComponent',
  props: {
    title: {
      type: String,
      default: 'Demo Component',
    },
    message: {
      type: String,
      default: 'Default message',
    },
  },
  data() {
    return {
      count: 0,
    }
  },
  methods: {
    increment() {
      this.count++
    },
    handleClose() {
      this.$emit('close')
    },
    handleSubmit() {
      this.$emit('submit', { value: this.count, text: `Count is ${this.count}` })
    },
  },
}
</script>
