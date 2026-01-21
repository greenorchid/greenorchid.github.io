<script lang="ts">
	import { onMount } from 'svelte';
	import tippy from 'tippy.js';

	let {
		content,
		trigger = 'mouseenter focus click',
		placement = 'top',
		testId = 'tooltip-content'
	} = $props();
	let element: HTMLElement;
	let tippyInstance: { setContent: (content: string) => void } | null = null;

	onMount(() => {
		if (element) {
			// @ts-expect-error - Tippy types not available
			tippyInstance = tippy(element, {
				content,
				trigger,
				placement,
				theme: 'custom-tooltip',
				arrow: true,
				interactive: true,
				role: 'tooltip',
				testId,
				onShow(instance) {
					instance.popper.setAttribute('data-testid', testId);
				}
			});
		}
	});

	$effect(() => {
		if (tippyInstance) {
			tippyInstance.setContent(content);
		}
	});
</script>

<div bind:this={element}>
	<slot />
</div>

<style>
	:global(.tippy-box[data-theme~='custom-tooltip']) {
		background-color: #111827; /* bg-gray-900 */
		color: #ffffff; /* text-white */
		border-radius: 0.25rem; /* rounded */
		padding: 0.5rem; /* p-2 */
		box-shadow:
			0 10px 15px -3px rgba(0, 0, 0, 0.1),
			0 4px 6px -2px rgba(0, 0, 0, 0.05); /* shadow-lg */
		max-width: 250px;
		font-size: 14px;
	}

	:global(.dark .tippy-box[data-theme~='custom-tooltip']) {
		background-color: #f3f4f6; /* dark:bg-gray-100 */
		color: #111827; /* dark:text-gray-900 */
	}

	:global(.tippy-box[data-theme~='custom-tooltip'] .tippy-arrow) {
		color: #111827; /* text-gray-900 */
	}

	:global(.dark .tippy-box[data-theme~='custom-tooltip'] .tippy-arrow) {
		color: #f3f4f6; /* dark:text-gray-100 */
	}
</style>
