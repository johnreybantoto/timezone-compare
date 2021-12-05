<template>
	<div class="home">
		<h1>TimeZone Comparer</h1>
		<div>
			<div class="zone-selector">
				<label for="time-zone">Select timezone:</label>
				<input list="timeZones" name="time-zone" id="time-zone" @input="addTimezone" />
			</div>
			<datalist v-if="timeZones?.length > 0" id="timeZones">
				<option v-for="(timeZone, index) in timeZones" :key="index" :value="timeZone.name">
					{{ timeZone?.currentTimeFormat }}
				</option>
			</datalist>
		</div>

		<draggable class="time-container" v-model="times" @start="drag = true" @end="drag = false" item-key="timeZone">
			<template #item="{ element }">
				<TimeItem :timeZone="element" />
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
import { initialize, ITimezoneTimes } from '@/utils';

interface IData {
	timeZones: TimeZone[];
	timeZoneNames: string[];
	selectedTimeZones: string[];
	times: ITimezoneTimes[];
	drag: boolean;
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
			times: [],
			drag: false,
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

				const timeZoneTime: ITimezoneTimes = {
					timeZone,
					times: initialize(new Date(date)),
				};
				this.times.push(timeZoneTime);
			}
		},
	},
});
</script>
