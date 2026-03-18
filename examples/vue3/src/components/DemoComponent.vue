<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  title?: string
  message?: string
}>()

const emit = defineEmits<{
  close: []
  submit: [data: { value: number; text: string }]
}>()

const count = ref(0)

const increment = (): void => {
  count.value++
}

const handleClose = (): void => {
  emit('close')
}

const handleSubmit = (): void => {
  emit('submit', { value: count.value, text: `Count is ${count.value}` })
}
</script>

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
