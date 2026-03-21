<template>
	<div class="section">
		<h2>3. Event System</h2>
		<p class="desc">Listen to component events via <code>instance.on()</code></p>
		<button @click="showDemo">Show Event Demo</button>
		<p v-if="eventLog">Event received: <strong>{{ eventLog }}</strong></p>
	</div>
</template>

<script>
import EventDemoComponent from '../components/EventDemo.vue'

export default {
	data() {
		return {
			eventLog: null,
		}
	},
	methods: {
		showDemo() {
			this.eventLog = null

			const instance = this.$show(EventDemoComponent, {
				props: { title: 'Event Demo' },
			})

			instance.on('custom-event', (data) => {
				this.eventLog = data
			})
		},
	},
}
</script>
