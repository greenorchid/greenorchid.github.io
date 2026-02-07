import type { Mode, Style } from '$lib/theme.svelte';

export interface State {
	width: number;
	height: number;
	mode: Mode;
	style: Style;
	particleColor: string;
}

export abstract class Painter {
	abstract setup(ps: State): void;
	abstract paint(ctx: CanvasRenderingContext2D, ps: State): void;
}
