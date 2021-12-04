<template>
	<div class="time">
		<p>{{ timezone }}</p>
		<div class="item" :class="{ 'work-time': time.isWorkHour, 'current-time': time.isCurrentTime }" v-for="(time, i) in times" :key="i">
			{{ time.dateStr }}
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
</style>

<script lang="ts">
import { IDateTime } from '@/utils/IDateTime';
import { setMinutes } from 'date-fns';
import { defineComponent } from 'vue';
import { initialize } from '../utils';

interface IData {
	times: IDateTime[];
}

export default defineComponent({
	name: 'TimeItem',
	props: {
		timezone: String,
	},
	data() {
		const _data: IData = {
			times: [],
		};
		return _data;
	},
	mounted() {
		const date = new Date().toLocaleString('en-US', {
			timeZone: this.timezone,
		});
		const dateReset = setMinutes(new Date(date), 0);

		this.times = initialize(dateReset);
	},
});
</script>
