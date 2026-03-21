<template>
	<div class="section">
		<h2>8. Context Inheritance</h2>
		<p class="desc">Pass <code>app</code> to inherit app context (router/pinia/i18n)</p>
		<button @click="showDemo">Show Context Demo</button>
		<p>Status: {{ status }}</p>
	</div>
</template>

<script setup lang="ts">
import { inject, ref } from 'vue'
import type { App } from 'vue'
import { mount } from 'vue-mount-plugin'
import ContextDemoComponent from '../components/ContextDemo.vue'

const app = inject<App>('app')
const status = ref('Not tested')

function showDemo() {
	const instance = mount(ContextDemoComponent, {
		props: { title: 'Context Demo' },
		app: app,
	})

	instance.on('context-check', (result: string) => {
		status.value = result
	})
}
</script>
