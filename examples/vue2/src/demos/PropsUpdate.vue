<template>
	<div class="section">
		<h2>7. Props Update</h2>
		<p class="desc">Update props dynamically with <code>setProps()</code></p>
		<button @click="showDemo">Show Props Demo</button>
		<button @click="updateProps" :disabled="!instance" style="margin-left: 10px">Update Props</button>
		<button @click="closeDemo" :disabled="!instance" style="margin-left: 10px">Close</button>
	</div>
</template>

<script>
import { mount } from 'vue-mount-plugin'
import PropsDemo from '../components/PropsDemo.vue'

export default {
	data() {
		return {
			instance: null,
		}
	},
	methods: {
		showDemo() {
			this.instance = mount(PropsDemo, {
				props: {
					title: 'Original Title',
					content: 'Original content - click Update Props to change.',
				},
			})
		},
		updateProps() {
			if (this.instance) {
				this.instance.setProps({
					title: 'Updated Title!',
					content: 'Content has been updated dynamically!',
				})
			}
		},
		closeDemo() {
			if (this.instance) {
				this.instance.unmount()
				this.instance = null
			}
		},
	},
}
</script>
