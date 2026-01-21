<script lang="ts">
	import { onMount } from 'svelte';
	import Tooltip from '$lib/components/Tooltip.svelte';

	let { mobile = false } = $props();

	let reducedMotion = $state<'true' | 'false'>('false');

	onMount(() => {
		// Check localStorage first, then system preference
		const stored = localStorage.getItem('reduced-motion');
		if (stored === 'true' || stored === 'false') {
			reducedMotion = stored;
		} else {
			// Check system preference
			reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
				? 'true'
				: 'false';
		}
		applyReducedMotion(reducedMotion);

		// Listen for system reducedMotion changes
		const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
		const handleChange = (e: MediaQueryListEvent) => {
			if (!localStorage.getItem('reducedMotion')) {
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
		localStorage.setItem('reducedMotion', newReducedMotion);
	}

	function toggleReducedMotion() {
		reducedMotion = reducedMotion === 'true' ? 'false' : 'true';
		applyReducedMotion(reducedMotion);
	}
</script>

<div class={mobile ? 'relative' : 'fixed top-4 right-18'}>
	<Tooltip
		content={reducedMotion === 'true' ? 'Animations are disabled' : 'Animations are enabled'}
		trigger="mouseenter focus"
		placement="top"
		testId="tooltip-reduced-motion"
	>
		<button
			onclick={toggleReducedMotion}
			class="relative rounded-lg bg-gray-200 p-2 text-gray-800 transition-colors duration-200 hover:bg-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:focus:ring-blue-400"
			aria-label="Toggle Reduced Motion"
			aria-pressed={reducedMotion === 'true'}
			type="button"
		>
			{#if reducedMotion === 'false'}
				<!-- Motion OFF icon (pause / stop) -->
				<svg
					class="h-6 w-6"
					viewBox="0 0 24 24"
					fill="none"
					stroke="#f87171"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<line x1="6" y1="4" x2="6" y2="20" />
					<line x1="18" y1="4" x2="18" y2="20" />
				</svg>
			{:else}
				<!-- Motion ON icon (play / animation) -->
				<svg
					class="h-6 w-6"
					viewBox="0 0 24 24"
					fill="none"
					stroke="#34d399"
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
