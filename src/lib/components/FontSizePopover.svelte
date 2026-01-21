<script lang="ts">
	import { onMount } from 'svelte';

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
	function handleClickOutside() {
		showPopover = false;
	}
</script>

<!--<div class="group fixed relative top-4 right-54 z-[9998]">-->
<div class="{mobile ? 'relative' : 'fixed top-4 right-32'} flex items-center gap-2">
	<!-- Main button -->
	<button
		onclick={() => (showPopover = !showPopover)}
		class="relative flex h-10 w-10 items-center justify-center rounded-lg bg-gray-200 p-2 text-gray-800 transition-colors duration-200 hover:bg-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:focus:ring-blue-400"
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

	<!-- Current scale indicator -->
	<div
		class="pointer-events-none absolute -bottom-10 left-1/2 z-20 -translate-x-1/2 rounded border border-gray-200 bg-white px-2 py-1 text-xs font-medium text-gray-700 opacity-0 shadow-md transition-all duration-300 group-hover:opacity-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
	>
		Font: {currentScale}%
	</div>

	<!-- Popover content -->
	{#if showPopover}
		<div
			class="absolute top-12 right-0 z-[9999] w-64 rounded-lg border border-gray-200 bg-white p-4 shadow-xl dark:border-gray-700 dark:bg-gray-800"
			role="dialog"
			aria-modal="true"
			aria-labelledby="font-size-heading"
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

		<!-- Tooltip -->
		<div
			role="tooltip"
			class="text-s absolute right-0 mt-2 rounded bg-gray-900 p-2 whitespace-nowrap text-white opacity-0 transition-opacity duration-200 group-focus-within:opacity-100 group-hover:opacity-100 dark:bg-gray-100 dark:text-gray-900"
		>
			Font Size (Current {currentScale}%)
			<!-- Backdrop -->
			<div class="fixed inset-0 z-[9998]" onclick={handleClickOutside} aria-hidden="true"></div>
		</div>
	{/if}
</div>
