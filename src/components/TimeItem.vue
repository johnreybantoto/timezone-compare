<template>
	<div class="time">
		<p>
			{{ timeZone.timeZone }}
			<span v-if="showRemove" class="btn" @click="removeTimeZone">❌</span>
		</p>

		<div class="btn-group">
			<button class="btn btn-action" @click="deductFromStart">-</button>
			<button class="btn btn-action" @click="addFromStart">+</button>
		</div>

		<div
			class="item"
			:class="{ 'work-time': time.isWorkHour, 'current-time': time.isCurrentTime }"
			v-for="(time, i) in timeZone.times"
			:key="i"
		>
			{{ time.dateStr }}
		</div>
		<div class="btn-group">
			<button class="btn btn-action" @click="deductFromEnd">-</button>
			<button class="btn btn-action" @click="addToEnd">+</button>
		</div>
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
	cursor: pointer;
}

.btn-action {
	padding: 0.5em;
	margin: 0.3em;
	background-color: #4eda94;
	border-radius: 10px;
}

.btn-group {
	display: flex;
	justify-content: center;
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
		showRemove: {
			type: Boolean,
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
		deductFromStart() {
			this.$emit('deductFromStart');
		},
		deductFromEnd() {
			this.$emit('deductFromEnd');
		},
		removeTimeZone() {
			this.$emit('removeTimeZone', this.timeZone.timeZone);
		},
	},
});
</script>
