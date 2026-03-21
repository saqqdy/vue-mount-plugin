<template>
	<div class="section">
		<h2>7. Props Update</h2>
		<p class="desc">Update props dynamically with <code>setProps()</code></p>
		<button @click="showDemo">Show Props Demo</button>
		<button @click="updateProps" :disabled="!instance" style="margin-left: 10px">Update Props</button>
		<button @click="closeDemo" :disabled="!instance" style="margin-left: 10px">Close</button>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { mount } from 'vue-mount-plugin'
import PropsDemo from '../components/PropsDemo.vue'

const instance = ref<any>(null)

function showDemo() {
	instance.value = mount(PropsDemo, {
		props: {
			title: 'Original Title',
			content: 'Original content - click Update Props to change.',
		},
	})
}

function updateProps() {
	instance.value?.setProps({
		title: 'Updated Title!',
		content: 'Content has been updated dynamically!',
	})
}

function closeDemo() {
	instance.value?.unmount()
	instance.value = null
}
</script>
