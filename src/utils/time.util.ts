import { IDateTime } from './IDateTime';
import { add, format, getHours, setMinutes } from 'date-fns';

export const formatDate = (date: Date, pattern = '(EEEEEE) MMM dd, yy hh:mm bbb'): string => {
	return format(date, pattern);
};

export const isWorkHour = (date: Date): boolean => {
	return getHours(date) > 7 && getHours(date) < 18;
};

export const unshift = (date: Date, num = 5): IDateTime[] => {
	return [...Array(num).keys()].map((i) => {
		const adjustedDate = add(date, { hours: -(num - i) });
		const dateStr = formatDate(adjustedDate);
		return { dateStr, isCurrentTime: false, isWorkHour: isWorkHour(adjustedDate) };
	});
};

export const push = (date: Date, num = 18): IDateTime[] => {
	return [...Array(num).keys()].map((i) => {
		const adjustedDate = add(date, { hours: i + 1 });
		const dateStr = formatDate(adjustedDate);
		return { dateStr, isCurrentTime: false, isWorkHour: isWorkHour(adjustedDate) };
	});
};

export const initialize = (date: Date): IDateTime[] => {
	const currentDate = { dateStr: formatDate(date), isCurrentTime: true, isWorkHour: isWorkHour(date) };
	const dateReset = setMinutes(new Date(date), 0);

	return [...unshift(dateReset), currentDate, ...push(dateReset)];
};
