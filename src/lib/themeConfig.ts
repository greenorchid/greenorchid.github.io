export interface SeasonalStyle {
	id: string;
	label: string;
	startMonth: number; // 0-11
	startDay: number;
	endMonth: number;
	endDay: number;
}

export const SEASONAL_STYLES: SeasonalStyle[] = [
	{
		id: 'valentines',
		label: "Valentine's Style",
		startMonth: 1,
		startDay: 1,
		endMonth: 1,
		endDay: 15
	},
	{
		id: 'st-patricks',
		label: "St. Patrick's Style",
		startMonth: 2,
		startDay: 1,
		endMonth: 2,
		endDay: 20
	},
	{ id: 'easter', label: 'Easter Style', startMonth: 2, startDay: 21, endMonth: 3, endDay: 30 }, // Roughly March/April
	{ id: 'spring', label: 'Spring Style', startMonth: 4, startDay: 1, endMonth: 4, endDay: 31 },
	{ id: 'summer', label: 'Summer Style', startMonth: 5, startDay: 1, endMonth: 7, endDay: 31 },
	{ id: 'autumn', label: 'Autumn Style', startMonth: 8, startDay: 1, endMonth: 9, endDay: 30 },
	{
		id: 'halloween',
		label: 'Halloween Style',
		startMonth: 10,
		startDay: 1,
		endMonth: 10,
		endDay: 31
	},
	{
		id: 'christmas',
		label: 'Christmas Style',
		startMonth: 11,
		startDay: 1,
		endMonth: 11,
		endDay: 26
	},
	{ id: 'new-year', label: 'New Year Style', startMonth: 11, startDay: 27, endMonth: 0, endDay: 5 }
];

export function isStyleActive(styleId: string, testAll: boolean = false): boolean {
	if (testAll || styleId === 'default') return true;

	const now = new Date();
	const month = now.getMonth();
	const day = now.getDate();

	const style = SEASONAL_STYLES.find((s) => s.id === styleId);
	if (!style) return false;

	const start = style.startMonth * 100 + style.startDay;
	const end = style.endMonth * 100 + style.endDay;
	const current = month * 100 + day;

	if (start <= end) {
		return current >= start && current <= end;
	} else {
		// Handles ranges crossing year boundary if needed
		return current >= start || current <= end;
	}
}

export function getAvailableStyles(testAll: boolean = false): string[] {
	const styles = ['default'];
	SEASONAL_STYLES.forEach((s) => {
		if (isStyleActive(s.id, testAll)) {
			styles.push(s.id);
		}
	});
	return styles;
}
