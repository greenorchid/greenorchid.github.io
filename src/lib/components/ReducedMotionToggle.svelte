<script lang="ts">
	import { onMount } from 'svelte';
	import Tooltip from '$lib/components/Tooltip.svelte';

	let { mobile = false } = $props();

	let reducedMotion = $state<'true' | 'false'>('false');

	onMount(() => {
		const stored = localStorage.getItem('reduced-motion');
		if (stored === 'true' || stored === 'false') {
			reducedMotion = stored;
		} else {
			reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
				? 'true'
				: 'false';
		}
		applyReducedMotion(reducedMotion);

		const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
		const handleChange = (e: MediaQueryListEvent) => {
			if (!localStorage.getItem('reduced-motion')) {
				reducedMotion = e.matches ? 'true' : 'false';
				applyReducedMotion(reducedMotion);
			}
		};
		mediaQuery.addEventListener('change', handleChange);

		return () => {
			mediaQuery.removeEventListener('change', handleChange);
		};
	});

	function applyReducedMotion(newReducedMotion: 'true' | 'false') {
		if (newReducedMotion === 'true') {
			document.body.classList.add('reduced-motion');
		} else {
			document.body.classList.remove('reduced-motion');
		}
		localStorage.setItem('reduced-motion', newReducedMotion);
	}

	function toggleReducedMotion() {
		reducedMotion = reducedMotion === 'true' ? 'false' : 'true';
		applyReducedMotion(reducedMotion);
	}
</script>

<div class={mobile ? 'relative' : ''}>
	<Tooltip
		content={reducedMotion === 'true' ? 'Animations are disabled' : 'Animations are enabled'}
		trigger="mouseenter focus"
		placement="top"
		testId="tooltip-reduced-motion"
	>
		<button
			onclick={toggleReducedMotion}
			class="btn-header"
			aria-label="Toggle Reduced Motion"
			aria-pressed={reducedMotion === 'true'}
			type="button"
		>
			{#if reducedMotion === 'false'}
				<!-- Animations ON -> Show Pause icon in Green -->
				<svg
					class="h-6 w-6"
					viewBox="0 0 24 24"
					fill="none"
					stroke="#34d399"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<line x1="6" y1="4" x2="6" y2="20" />
					<line x1="18" y1="4" x2="18" y2="20" />
				</svg>
			{:else}
				<!-- Animations OFF -> Show Play icon in Red -->
				<svg
					class="h-6 w-6"
					viewBox="0 0 24 24"
					fill="none"
					stroke="#f87171"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<polygon points="5 3 19 12 5 21 5 3" />
				</svg>
			{/if}
		</button>
	</Tooltip>
</div>
