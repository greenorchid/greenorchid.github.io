<script lang="ts">
	import { blueskyStore } from './stores.svelte';
	import { login, logout, initializeAgent } from './client';
	import { getTimeline } from './actions';
	import BlueskyPost from './BlueskyPost.svelte';
	import BlueskyAuth from './BlueskyAuth.svelte';
	import { onMount } from 'svelte';
	import { logger } from '$lib/logger';
	import Tooltip from '../Tooltip.svelte';
	import { CONFIG } from '$lib/config';

	let hasFetched = false;

	onMount(async () => {
		logger.debug('Site Build ID:', CONFIG.buildId);
		await initializeAgent();
		if (!hasFetched) {
			hasFetched = true;
			logger.debug('BlueskyFeed: Triggering initial timeline fetch');
			getTimeline();
		}
	});
</script>

<div
	class="flex flex-col gap-0 divide-y divide-gray-100 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:divide-gray-700/50 dark:border-gray-700 dark:bg-gray-800"
>
	<div
		class="flex items-center justify-between border-b border-gray-100 bg-gray-50/50 px-4 py-3 dark:border-gray-700 dark:bg-gray-800/50"
	>
		<Tooltip content="A live stream of what's happening in my orbit. Read-only community view.">
			<h3 class="font-bold text-gray-900 dark:text-white">Bluesky Community Feed</h3>
		</Tooltip>

		<div class="flex items-center gap-2">
			<BlueskyAuth />
		</div>
	</div>

	{#if blueskyStore.isLoading}
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
			Loading timeline...
		</div>
	{:else if !blueskyStore.isAuthenticated && blueskyStore.timeline.length === 0}
		<!-- guest but no posts -->
		<div class="p-8 text-center text-gray-500">No posts yet!</div>
	{:else if blueskyStore.timeline.length > 0}
		<div class="scrollbar-thin max-h-[600px] overflow-x-hidden overflow-y-auto">
			{#each blueskyStore.timeline as post (post.uri)}
				<BlueskyPost {post} />
			{/each}
		</div>
	{:else if blueskyStore.isAuthenticated}
		<div class="p-8 text-center text-gray-500">Your timeline is empty. Why not create a post?</div>
	{:else}
		<div class="p-8 text-center text-sm text-gray-500">The feed is currently unavailable.</div>
	{/if}

	{#if blueskyStore.error}
		<p
			class="border-t border-red-50 p-4 text-xs text-red-600 dark:border-red-900/20 dark:text-red-400"
		>
			{blueskyStore.error.message}
		</p>
	{/if}
</div>

<style>
	.scrollbar-thin::-webkit-scrollbar {
		width: 4px;
	}
	.scrollbar-thin::-webkit-scrollbar-track {
		background: transparent;
	}
	.scrollbar-thin::-webkit-scrollbar-thumb {
		background: rgba(156, 163, 175, 0.2);
		border-radius: 10px;
	}
	.scrollbar-thin::-webkit-scrollbar-thumb:hover {
		background: rgba(156, 163, 175, 0.4);
	}
</style>
