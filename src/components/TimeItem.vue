<template>
	<div class="time">
		<p>{{ timeZone.timeZone }}</p>
		<button class="btn" @click="addFromStart">+</button>
		<div
			class="item"
			:class="{ 'work-time': time.isWorkHour, 'current-time': time.isCurrentTime }"
			v-for="(time, i) in timeZone.times"
			:key="i"
		>
			{{ time.dateStr }}
		</div>
		<button class="btn" @click="addToEnd">+</button>
	</div>
</template>

<style scoped>
.time {
	border: 1px solid gray;
	border-radius: 5px;
}
.item {
	padding: 0.5em;
}

.work-time {
	background-color: #a0e0c0;
}

.current-time {
	background-color: #629bca;
}

.btn {
	padding: 0.5em;
	margin: 0.3em;
	background-color: #4eda94;
	border-radius: 10px;
	cursor: pointer;
}
</style>

<script lang="ts">
import { ITimezoneTimes } from '@/utils';
import { defineComponent, PropType } from 'vue';

export default defineComponent({
	name: 'TimeItem',
	props: {
		timeZone: {
			type: Object as PropType<ITimezoneTimes>,
			required: true,
		},
	},
	methods: {
		addFromStart() {
			this.$emit('addFromStart');
		},
		addToEnd() {
			this.$emit('addToEnd');
		},
	},
});
</script>
