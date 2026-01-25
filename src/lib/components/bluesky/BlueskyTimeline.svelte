<script lang="ts">
	import { blueskyStore } from './stores.svelte';
	import { getTimeline } from './actions';
	import BlueskyPost from './BlueskyPost.svelte';
	import { logger } from '$lib/logger';

	// Use blueskyStore directly for reactivity

	let hasFetched = false;

	// Reactively fetch timeline once when authenticated and agent is ready
	$effect(() => {
		if (blueskyStore.agent && blueskyStore.isAuthenticated && !hasFetched) {
			logger.debug('BlueskyTimeline: Performing initial fetch');
			hasFetched = true;
			getTimeline();
		}
	});
</script>

<div
	class="flex flex-col gap-0 divide-y divide-gray-100 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:divide-gray-700/50 dark:border-gray-700 dark:bg-gray-800"
>
	<div
		class="border-b border-gray-100 bg-gray-50/50 px-4 py-3 dark:border-gray-700 dark:bg-gray-800/50"
	>
		<h3 class="font-bold text-gray-900 dark:text-white">Bluesky Timeline</h3>
	</div>

	{#if blueskyStore.isLoading && blueskyStore.timeline.length === 0}
		<div class="p-8 text-center text-gray-500">
			<svg
				class="mx-auto mb-2 h-8 w-8 animate-spin text-blue-500"
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
			>
				<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
				></circle>
				<path
					class="opacity-75"
					fill="currentColor"
					d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
				></path>
			</svg>
			Loading your timeline...
		</div>
	{:else if blueskyStore.timeline.length > 0}
		{#each blueskyStore.timeline as post (post.uri)}
			<BlueskyPost {post} />
		{/each}
	{:else if blueskyStore.isAuthenticated}
		<div class="p-8 text-center text-gray-500">Your timeline is empty.</div>
	{:else}
		<div class="p-8 text-center text-gray-500">Connect to Bluesky to see your timeline.</div>
	{/if}
</div>
