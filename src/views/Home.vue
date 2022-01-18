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
				<TimeItem
					:timeZone="element"
					:showRemove="currentTimeZone !== element.timeZone"
					@addFromStart="addFromStart"
					@addToEnd="addToEnd"
					@removeTimeZone="removeTimeZone"
				/>
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
	currentTimeZone: string;
}

export default defineComponent({
	name: 'Home',
	components: {
		TimeItem,
		draggable,
	},
	data() {
		const start = localStorage.startHours;
		const end = localStorage.endHours;
		const storedTimeZones: string[] = localStorage.selectedTimeZones ? JSON.parse(localStorage.selectedTimeZones) : [];

		const _data: IData = {
			timeZones: [],
			timeZoneNames: [],
			selectedTimeZones: storedTimeZones || [],
			timeItems: [],
			drag: false,
			startHours: start ? +start : 5,
			endHours: end ? +end : 18,
			currentTimeZone: '',
		};
		return _data;
	},
	mounted() {
		this.timeZones = getTimeZones();
		this.timeZoneNames = this.timeZones.map((x) => x.name);
		this.currentTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

		if (this.selectedTimeZones.length > 0) {
			for (const timeZone of this.selectedTimeZones) {
				this.addTimezone(null, timeZone, false, true);
			}
		} else {
			this.addTimezone(null, this.currentTimeZone);
		}
	},
	methods: {
		addTimezone(event: any, defaultTimeZone?: string, pushToTimeZones = true, isInitialized = false) {
			const timeZone: string = event?.target?.value || defaultTimeZone;

			if (this.timeZoneNames.includes(timeZone) && (isInitialized || !this.selectedTimeZones.includes(timeZone))) {
				if (pushToTimeZones) {
					this.selectedTimeZones = [...this.selectedTimeZones, timeZone];
				}

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
		removeTimeZone(timeZone: string) {
			this.selectedTimeZones = this.selectedTimeZones.filter((x) => x !== timeZone);
			this.timeItems = this.timeItems.filter((x) => x.timeZone !== timeZone);
		},
	},
	watch: {
		selectedTimeZones(newVal) {
			localStorage.setItem('selectedTimeZones', JSON.stringify(newVal));
		},
		startHours(newVal) {
			localStorage.setItem('startHours', newVal);
		},
		endHours(newVal) {
			localStorage.setItem('endHours', newVal);
		},
	},
});
</script>
