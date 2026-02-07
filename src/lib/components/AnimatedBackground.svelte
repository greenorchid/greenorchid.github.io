<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { theme, type Style } from '$lib/theme.svelte';

	import { type Painter, type State } from './background/Painter';
	import { ParticlePainter } from './background/ParticlePainter';
	import { ValentinesPainter } from './background/ValentinesPainter';
	import { StPatricksPainter } from './background/StPatricksPainter';
	import { ChristmasPainter } from './background/ChristmasPainter';
	import { EasterPainter } from './background/EasterPainter';
	import { SpringPainter } from './background/SpringPainter';
	import { SummerPainter } from './background/SummerPainter';
	import { AutumnPainter } from './background/AutumnPainter';
	import { HalloweenPainter } from './background/HalloweenPainter';
	import { NewYearPainter } from './background/NewYearPainter';

	let canvas: HTMLCanvasElement | undefined = $state();
	let ctx: CanvasRenderingContext2D | null = null;
	let animationFrame: number | undefined;

	// Make bgState properly reactive to ensure effects track it correctly
	let bgState = $state<State>({
		width: 0,
		height: 0,
		mode: 'light',
		style: 'default',
		particleColor: '16, 185, 129'
	});

	function getThemeColor(variable: string) {
		if (typeof window === 'undefined') return '16, 185, 129';
		const val = getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
		return val || '16, 185, 129';
	}

	let currentPainter: Painter | null = null;
	let currentStyle: Style | null = null;

	function updatePainter() {
		if (currentStyle === theme.style && currentPainter) {
			return;
		}
		currentStyle = theme.style;
		switch (theme.style) {
			case 'valentines':
				currentPainter = new ValentinesPainter();
				break;
			case 'st-patricks':
				currentPainter = new StPatricksPainter();
				break;
			case 'christmas':
				currentPainter = new ChristmasPainter();
				break;
			case 'easter':
				currentPainter = new EasterPainter();
				break;
			case 'spring':
				currentPainter = new SpringPainter();
				break;
			case 'summer':
				currentPainter = new SummerPainter();
				break;
			case 'autumn':
				currentPainter = new AutumnPainter();
				break;
			case 'halloween':
				currentPainter = new HalloweenPainter();
				break;
			case 'new-year':
				currentPainter = new NewYearPainter();
				break;
			default:
				currentPainter = new ParticlePainter();
				break;
		}
		if (currentPainter) currentPainter.setup(bgState);
	}

	$effect(() => {
		// Sync theme signals to bgState
		bgState.style = theme.style;
		bgState.mode = theme.mode;
		bgState.particleColor = getThemeColor('--particle-color');
		updatePainter();
	});

	onMount(() => {
		if (!canvas) return;
		ctx = canvas.getContext('2d', { alpha: true });
		if (!ctx) return;

		const resize = async () => {
			if (!canvas) return;
			await tick(); // Wait for layout
			const rect = canvas.getBoundingClientRect();
			bgState.width = rect.width;
			bgState.height = rect.height;
			canvas.width = bgState.width;
			canvas.height = bgState.height;
			if (currentPainter) currentPainter.setup(bgState);
		};

		window.addEventListener('resize', resize);
		resize();

		const observer = new MutationObserver(() => {
			const isReduced = document.body.classList.contains('reduced-motion');
			if (!isReduced && !animationFrame) animate();
			else if (isReduced && animationFrame) {
				cancelAnimationFrame(animationFrame);
				animationFrame = undefined;
			}
		});
		observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

		const animate = () => {
			if (!ctx || !canvas || document.body.classList.contains('reduced-motion')) {
				animationFrame = undefined;
				return;
			}
			if (currentPainter) {
				currentPainter.paint(ctx, bgState);
			}
			animationFrame = requestAnimationFrame(animate);
		};

		animate();

		return () => {
			window.removeEventListener('resize', resize);
			observer.disconnect();
			if (animationFrame) cancelAnimationFrame(animationFrame);
		};
	});
</script>

<canvas
	bind:this={canvas}
	class="pointer-events-none fixed inset-0 -z-60 h-full w-full"
	aria-hidden="true"
></canvas>
