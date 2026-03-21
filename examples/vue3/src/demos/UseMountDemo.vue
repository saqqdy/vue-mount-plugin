<template>
	<div class="section">
		<h2>5. useMount Composable</h2>
		<p class="desc">Manage multiple instances with auto cleanup</p>
		<button @click="showPanel">Show via Composable</button>
		<button @click="handleUnmountAll" style="margin-left: 10px">Unmount All</button>
		<p>Active instances: <strong>{{ count }}</strong></p>
	</div>
</template>

<script setup lang="ts">
import { useMount } from 'vue-mount-plugin'
import PropsDemo from '../components/PropsDemo.vue'

const { mount, unmountAll, count } = useMount()

function showPanel() {
	mount(PropsDemo, {
		props: {
			title: `Panel #${count.value + 1}`,
			content: 'This panel was mounted using useMount composable. Create multiple panels and click Unmount All.',
		},
	})
}

function handleUnmountAll() {
	unmountAll()
}
</script>
