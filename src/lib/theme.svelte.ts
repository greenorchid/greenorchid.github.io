import { browser } from '$app/environment';
import { getAvailableStyles } from './themeConfig';

export type Mode = 'light' | 'dark';
export type Style =
	| 'default'
	| 'valentines'
	| 'st-patricks'
	| 'christmas'
	| 'easter'
	| 'spring'
	| 'summer'
	| 'autumn'
	| 'halloween'
	| 'new-year';

class ThemeStore {
	#mode = $state<Mode>('light');
	#style = $state<Style>('default');
	#testAll = $state(false);

	constructor() {
		if (browser) {
			// Initialize Mode
			const storedMode = localStorage.getItem('theme-mode') as Mode;
			if (this.isValidMode(storedMode)) {
				this.#mode = storedMode;
			} else {
				this.#mode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
			}

			// Initialize testAll
			const storedTestMode = localStorage.getItem('theme-test-mode') === 'true';
			this.#testAll = storedTestMode;

			this.apply();
		}
	}

	get mode() {
		return this.#mode;
	}
	set mode(value: Mode) {
		if (this.isValidMode(value)) {
			this.#mode = value;
			this.apply();
		}
	}

	get style() {
		return this.#style;
	}
	set style(value: Style) {
		if (this.isValidStyle(value)) {
			this.#style = value;
			this.apply();
		}
	}

	get testAll() {
		return this.#testAll;
	}
	set testAll(value: boolean) {
		this.#testAll = value;
		if (browser) localStorage.setItem('theme-test-mode', String(value));
		this.apply();
	}

	get availableStyles() {
		return getAvailableStyles(this.#testAll);
	}

	// Legacy compatibility getter
	get current() {
		// Mapping for components that haven't been updated yet
		if (this.#style === 'default') return this.#mode;
		return this.#style;
	}

	private isValidMode(mode: string | null): mode is Mode {
		return ['light', 'dark'].includes(mode || '');
	}

	private isValidStyle(style: string | null): style is Style {
		return [
			'default',
			'valentines',
			'st-patricks',
			'christmas',
			'easter',
			'spring',
			'summer',
			'autumn',
			'halloween',
			'new-year'
		].includes(style || '');
	}

	private apply() {
		if (!browser) return;

		document.documentElement.setAttribute('data-theme', this.#style);
		document.documentElement.setAttribute('data-mode', this.#mode);

		if (this.#mode === 'dark') {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}

		localStorage.setItem('theme-mode', this.#mode);
		localStorage.setItem('theme-style', this.#style);
	}

	toggleTestMode() {
		this.testAll = !this.#testAll;
	}

	toggleMode() {
		this.mode = this.#mode === 'light' ? 'dark' : 'light';
	}

	nextStyle() {
		const available = getAvailableStyles(this.#testAll) as Style[];
		const currentIndex = available.indexOf(this.#style);
		const nextIndex = (currentIndex + 1) % available.length;
		this.style = available[nextIndex];
	}

	// Legacy toggle for backward compatibility
	toggle() {
		this.nextStyle();
	}
}

export const theme = new ThemeStore();

if (browser) {
	// @ts-expect-error testAll is used for console debugging
	window.theme = theme as ThemeStore;
}
