import { dev } from '$app/environment';

export const logger = {
	debug: (...args: unknown[]) => {
		if (dev) console.log(...args);
	},
	info: (...args: unknown[]) => {
		if (dev) console.log(...args);
	},
	warn: (...args: unknown[]) => {
		if (dev) console.warn(...args);
	},
	error: (...args: unknown[]) => {
		// We might want to always log errors even in prod, or send to a service.
		// For now, let's keep them in prod but allow filtering if needed.
		console.error(...args);
	}
};
