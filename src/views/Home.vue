<template>
	<div class="home">
		<h1>TimeZone Comparer</h1>
		<div>
			<div class="zone-selector">
				<label for="time-zone">Select timezone:</label>
				<input list="timeZones" name="time-zone" id="time-zone" @change="addTimezone" />
			</div>
			<datalist v-if="timeZones?.length > 0" id="timeZones">
				<option v-for="(timeZone, index) in timeZones" :key="index" :value="timeZone.name">
					{{ timeZone?.currentTimeFormat }}
				</option>
			</datalist>
		</div>

		<draggable class="time-container" v-model="timeItems" @start="drag = true" @end="drag = false" item-key="timeZone">
			<template #item="{ element }">
				<TimeItem :timeZone="element" @addFromStart="addFromStart" @addToEnd="addToEnd" />
			</template>
		</draggable>
	</div>
</template>

<style scoped>
.zone-selector {
	margin: 1rem;
}
#time-zone {
	padding: 0.5em;
	margin: 0.3em;
	width: 430px;
}

.time-container {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 1rem;
}
</style>

<script lang="ts">
import { defineComponent } from 'vue';
import TimeItem from '@/components/TimeItem.vue';
import { getTimeZones, TimeZone } from '@vvo/tzdb';
import draggable from 'vuedraggable';
import { initialize, ITimezoneTimes, push, unshift } from '@/utils';

interface IData {
	timeZones: TimeZone[];
	timeZoneNames: string[];
	selectedTimeZones: string[];
	timeItems: ITimezoneTimes[];
	drag: boolean;
	startHours: number;
	endHours: number;
}

export default defineComponent({
	name: 'Home',
	components: {
		TimeItem,
		draggable,
	},
	data() {
		const _data: IData = {
			timeZones: [],
			timeZoneNames: [],
			selectedTimeZones: [],
			timeItems: [],
			drag: false,
			startHours: 5,
			endHours: 18,
		};
		return _data;
	},
	mounted() {
		this.timeZones = getTimeZones();
		this.timeZoneNames = this.timeZones.map((x) => x.name);
		const currentTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
		this.addTimezone(null, currentTimeZone);
	},
	methods: {
		addTimezone(event: any, defaultTimeZone?: string) {
			const timeZone: string = event?.target?.value || defaultTimeZone;

			if (this.timeZoneNames.includes(timeZone) && !this.selectedTimeZones.includes(timeZone)) {
				this.selectedTimeZones.push(timeZone);

				const date = new Date().toLocaleString('en-US', {
					timeZone,
				});

				const selectedTimeZone = this.timeZones.find((x) => x.name === timeZone);
				const minutes = selectedTimeZone?.rawFormat.slice(4, 6) || 0;

				const timeZoneTime: ITimezoneTimes = {
					timeZone,
					times: initialize(new Date(date), +minutes, this.startHours, this.endHours),
				};
				this.timeItems.push(timeZoneTime);
			}
		},
		addFromStart() {
			this.timeItems.forEach((x) => {
				const [startTime] = x.times;
				const date = new Date(startTime.dateStr);

				x.times = [...unshift(new Date(date), 1), ...x.times];
			});
			this.startHours += 1;
		},
		addToEnd() {
			this.timeItems.forEach((x) => {
				const [endTime] = x.times.slice(-1);
				const date = new Date(endTime.dateStr);

				x.times = [...x.times, ...push(new Date(date), 1)];
			});
			this.endHours += 1;
		},
	},
});
</script>
