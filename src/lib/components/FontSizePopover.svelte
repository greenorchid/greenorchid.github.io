<script lang="ts">
	import { onMount } from 'svelte';
	import Tooltip from '$lib/components/Tooltip.svelte';

	let { mobile = false } = $props();

	let showPopover = $state(false);
	let currentScale = $state(100);

	// Load saved scale on mount
	onMount(() => {
		const saved = localStorage.getItem('font-scale');
		if (saved) {
			const parsed = parseFloat(saved);
			if (!isNaN(parsed) && parsed > 10) {
				currentScale = parsed;
				updateFontScale();
			} else {
				//reset
				currentScale = 100;
				updateFontScale();
			}
		} else {
			//reset
			currentScale = 100;
			updateFontScale();
		}
	});

	// Update CSS variable and save to localStorage
	function updateFontScale() {
		document.documentElement.style.setProperty('--font-scale', (currentScale / 100).toString());
		localStorage.setItem('font-scale', currentScale.toString());
	}

	// Scale functions
	function increaseScale() {
		if (currentScale < 150) {
			currentScale += 10;
			updateFontScale();
		}
	}

	function decreaseScale() {
		if (currentScale > 80) {
			currentScale -= 10;
			updateFontScale();
		}
	}

	function setScale(scale: number) {
		currentScale = scale;
		updateFontScale();
	}

	function resetScale() {
		setScale(100);
	}

	// Close popover when clicking outside
	function handleClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement;
		// Close if click is outside the popover and button
		if (!target.closest('.popover-container')) {
			showPopover = false;
		}
	}

	// Add global click listener
	onMount(() => {
		document.addEventListener('click', handleClickOutside);
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	});
</script>

<!--<div class="group fixed relative top-4 right-54 z-[9998]">-->
<div
	class="{mobile ? 'relative' : 'fixed top-4 right-32'} popover-container flex items-center gap-2"
>
	{#if !mobile}
		<Tooltip
			content={`Font Size (Current ${currentScale}%)`}
			trigger="mouseenter focus manual touchstart"
			placement="top"
			testId="tooltip-fontsize"
		>
			<button
				onclick={() => (showPopover = !showPopover)}
				class="btn-header flex h-10 w-10 items-center justify-center"
				aria-label="Font size: {currentScale}%"
				aria-expanded={showPopover}
				aria-haspopup="true"
				type="button"
			>
				<svg
					class="h-6 w-6"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<text x="4" y="18" font-size="16">Aa</text>
				</svg>
			</button>
		</Tooltip>
	{:else}
		<button
			onclick={() => (showPopover = !showPopover)}
			class="btn-header flex h-10 w-10 items-center justify-center"
			aria-label="Font size: {currentScale}%"
			aria-expanded={showPopover}
			aria-haspopup="true"
			type="button"
		>
			<svg
				class="h-6 w-6"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="1"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<text x="4" y="18" font-size="16">Aa</text>
			</svg>
		</button>
	{/if}

	<!-- Popover content -->
	{#if showPopover}
		<div
			class="absolute top-12 right-0 z-[9999] w-64 rounded-lg border border-gray-200 bg-white p-4 shadow-xl dark:border-gray-700 dark:bg-gray-800"
			role="dialog"
			aria-modal="true"
			aria-labelledby="font-size-heading"
			data-testid="font-size-popover"
		>
			<!-- Header -->
			<div class="mb-4">
				<h3 id="font-size-heading" class="text-sm font-semibold text-gray-900 dark:text-gray-100">
					Font Size
				</h3>
				<p class="text-xs text-gray-600 dark:text-gray-400">
					Current: <span class="font-medium">{currentScale}%</span>
				</p>
			</div>

			<!-- Quick presets -->
			<div class="mb-4">
				<div class="grid grid-cols-3 gap-2">
					{#each [80, 90, 100, 110, 120, 130] as scale (scale)}
						<button
							onclick={() => setScale(scale)}
							class="rounded-md border px-3 py-2 text-sm font-medium transition-colors {currentScale ===
							scale
								? 'border-green-600 bg-green-600 text-white dark:border-green-500 dark:bg-green-500'
								: 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'}"
						>
							{scale}%
						</button>
					{/each}
				</div>
			</div>

			<!-- Manual controls -->
			<div class="mb-4 flex gap-2">
				<button
					onclick={decreaseScale}
					disabled={currentScale <= 80}
					class="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
				>
					<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
					</svg>
					Decrease
				</button>
				<button
					onclick={increaseScale}
					disabled={currentScale >= 150}
					class="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
				>
					<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 4v16m8-8H4"
						/>
					</svg>
					Increase
				</button>
			</div>

			<!-- Reset button -->
			<button
				onclick={resetScale}
				class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
			>
				Reset to Default (100%)
			</button>
		</div>
	{/if}
</div>
