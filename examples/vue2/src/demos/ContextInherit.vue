<template>
	<div class="section">
		<h2>5. Context Inheritance</h2>
		<p class="desc">Pass <code>parent: this</code> to inherit router/store/i18n</p>
		<button @click="showDemo">Show Context Demo</button>
		<p>Status: {{ status }}</p>
	</div>
</template>

<script>
import ContextDemoComponent from '../components/ContextDemo.vue'

export default {
	data() {
		return {
			status: 'Not tested',
		}
	},
	methods: {
		showDemo() {
			const instance = this.$show(ContextDemoComponent, {
				props: { title: 'Context Demo' },
				parent: this,
			})

			instance.on('context-check', (result) => {
				this.status = result
			})
		},
	},
}
</script>
