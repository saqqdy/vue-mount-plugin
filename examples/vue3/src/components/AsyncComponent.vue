<script setup lang="ts">
import { onMounted, ref } from 'vue'

const props = defineProps<{
  title?: string
}>()

const emit = defineEmits<{
  close: []
}>()

const loaded = ref(false)

onMounted(() => {
  // Simulate async loading
  setTimeout(() => {
    loaded.value = true
  }, 500)
})
</script>

<template>
  <div style="background: linear-gradient(135deg, #42b883 0%, #35495e 100%); color: white; border-radius: 8px; padding: 20px; margin: 10px 0;">
    <h4 style="margin: 0 0 10px 0;">{{ title || 'Async Component' }}</h4>
    <p v-if="!loaded" style="margin: 0;">Loading async component...</p>
    <p v-else style="margin: 0;">This component was loaded asynchronously using defineAsyncComponent!</p>
    <div style="margin-top: 10px; font-size: 12px; opacity: 0.8;">
      Loaded at: {{ new Date().toLocaleTimeString() }}
    </div>
    <div style="text-align: right; margin-top: 10px;">
      <button @click="emit('close')" style="background: rgba(255,255,255,0.2);">Close</button>
    </div>
  </div>
</template>
