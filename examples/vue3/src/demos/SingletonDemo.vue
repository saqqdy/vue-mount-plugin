<template>
	<div class="section">
		<h2>4. Singleton Mode</h2>
		<p class="desc">Only one instance exists at a time</p>
		<button @click="showToast">Show Singleton Toast</button>
		<p class="hint">Click multiple times - only one toast shows</p>
	</div>
</template>

<script setup lang="ts">
import { mount } from 'vue-mount-plugin'
import SingletonToast from '../components/SingletonToast.vue'

function showToast() {
	mount(SingletonToast, {
		singleton: true,
		props: {
			message: 'Singleton toast - only one instance!',
		},
	})
}
</script>
