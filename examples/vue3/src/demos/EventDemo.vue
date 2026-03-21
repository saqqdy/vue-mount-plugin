<template>
	<div class="section">
		<h2>3. Event System</h2>
		<p class="desc">Listen to component events via <code>instance.on()</code></p>
		<button @click="showDemo">Show Event Demo</button>
		<p v-if="eventLog">Event received: <strong>{{ eventLog }}</strong></p>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { mount } from 'vue-mount-plugin'
import EventDemoComponent from '../components/EventDemo.vue'

const eventLog = ref<string | null>(null)

function showDemo() {
	eventLog.value = null

	const instance = mount(EventDemoComponent, {
		props: { title: 'Event Demo' },
	})

	instance.on('custom-event', (data: string) => {
		eventLog.value = data
	})
}
</script>
