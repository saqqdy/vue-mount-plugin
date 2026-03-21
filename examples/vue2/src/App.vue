<template>
	<div class="app">
		<h1>vue-mount-plugin - Vue 2 Example</h1>

		<BasicUsage />
		<PromiseDemo />
		<EventDemoSection />
		<SingletonDemo />
		<ContextInherit />
		<ManualControl />
		<PropsUpdate />
	</div>
</template>

<script>
import {
	BasicUsage,
	PromiseDemo,
	EventDemoSection,
	SingletonDemo,
	ContextInherit,
	ManualControl,
	PropsUpdate,
} from './demos'

export default {
	name: 'App',
	components: {
		BasicUsage,
		PromiseDemo,
		EventDemoSection,
		SingletonDemo,
		ContextInherit,
		ManualControl,
		PropsUpdate,
	},
}
</script>

<style scoped>
.app {
	max-width: 800px;
	margin: 0 auto;
	padding: 20px;
}

h1 {
	color: #42b883;
	margin-bottom: 30px;
}
</style>

<style>
/* Global demo styles */
.section {
	background: white;
	padding: 20px;
	border-radius: 8px;
	margin-bottom: 20px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section h2 {
	color: #35495e;
	font-size: 16px;
	margin-bottom: 8px;
}

.section .desc {
	color: #666;
	font-size: 13px;
	margin-bottom: 12px;
}

.section .desc code {
	background: #f5f5f5;
	padding: 2px 6px;
	border-radius: 3px;
	font-family: monospace;
	color: #42b883;
}

.section .hint {
	color: #999;
	font-size: 12px;
	margin-top: 8px;
}

.section button {
	background: #42b883;
	color: white;
	border: none;
	padding: 10px 20px;
	border-radius: 4px;
	cursor: pointer;
	font-size: 14px;
	transition: background 0.3s;
}

.section button:hover:not(:disabled) {
	background: #35495e;
}

.section button:disabled {
	background: #ccc;
	cursor: not-allowed;
}

.section p {
	margin-top: 10px;
	color: #666;
}

.section strong {
	color: #42b883;
}
</style>
