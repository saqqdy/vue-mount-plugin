<template>
	<div class="section">
		<h2>1. Basic Usage</h2>
		<p class="desc">Using <code>this.$show()</code> to mount component</p>
		<button @click="showViaPlugin">Show via $show()</button>
		<button @click="showViaMount" style="margin-left: 10px">Show via mount()</button>
	</div>
</template>

<script>
import { mount } from 'vue-mount-plugin'
import BasicModal from '../components/BasicModal.vue'

export default {
	methods: {
		showViaPlugin() {
			this.$show(BasicModal, {
				props: {
					title: 'Basic Modal',
					content: 'This is a basic modal in Vue 2!',
				},
			})
		},
		showViaMount() {
			mount(BasicModal, {
				props: {
					title: 'Mounted via mount()',
					content: 'This modal is mounted using mount() function.',
				},
			})
		},
	},
}
</script>
