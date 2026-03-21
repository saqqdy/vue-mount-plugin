<template>
	<div class="section">
		<h2>6. Manual Control</h2>
		<p class="desc">Create instance first, control show/hide/unmount manually</p>
		<button @click="createInstance" :disabled="instance !== null">Create Instance</button>
		<button @click="showInstance" :disabled="!instance" style="margin-left: 10px">Show</button>
		<button @click="hideInstance" :disabled="!instance" style="margin-left: 10px">Hide</button>
		<button @click="destroyInstance" :disabled="!instance" style="margin-left: 10px">Destroy</button>
	</div>
</template>

<script>
import { createMount } from 'vue-mount-plugin'
import PropsDemo from '../components/PropsDemo.vue'

export default {
	data() {
		return {
			instance: null,
		}
	},
	methods: {
		createInstance() {
			this.instance = createMount(PropsDemo, {
				props: {
					title: 'Manual Control',
					content: 'This instance is created but not shown yet. Click Show to display it.',
				},
			})
		},
		showInstance() {
			if (this.instance) {
				this.instance.show()
			}
		},
		hideInstance() {
			if (this.instance) {
				this.instance.hide()
			}
		},
		destroyInstance() {
			if (this.instance) {
				this.instance.unmount()
				this.instance = null
			}
		},
	},
}
</script>
