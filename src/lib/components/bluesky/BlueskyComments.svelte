<script lang="ts">
	import { onMount } from 'svelte';
	import { getComments } from './actions';
	import BlueskyPost from './BlueskyPost.svelte';
	import { CONFIG } from '$lib/config';
	import { blueskyStore } from './stores.svelte';

	let { postUri }: { postUri: string } = $props();

	let thread = $state<any>(null);
	let isLoading = $state(true);
	let hasFetched = false;

	// Reactively fetch thread when agent is ready
	$effect(() => {
		if (postUri && !blueskyStore.isLoading && !hasFetched) {
			hasFetched = true;
			(async () => {
				thread = await getComments(postUri);
				isLoading = false;
			})();
		}
	});

	function isThreadView(obj: any): obj is { post: any; replies?: any[] } {
		return obj && obj.post;
	}
</script>

<div class="mt-12 border-t border-gray-200 pt-8 dark:border-gray-700">
	<h2 class="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Comments</h2>

	{#if isLoading}
		<div class="py-12 text-center text-gray-500">
			<svg
				class="mx-auto mb-2 h-6 w-6 animate-spin text-blue-500"
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
			Loading comments...
		</div>
	{:else if thread && thread.replies && thread.replies.length > 0}
		<div class="flex flex-col gap-4">
			{#each thread.replies as reply (reply.post?.uri || Math.random())}
				{#if isThreadView(reply)}
					<div class="border-l-2 border-gray-100 pl-4 dark:border-gray-800">
						<BlueskyPost post={reply.post} />

						{#if reply.replies && reply.replies.length > 0}
							<div class="mt-4">
								{#each reply.replies as subReply (subReply.post?.uri || Math.random())}
									{#if isThreadView(subReply)}
										<div class="ml-4 border-l border-gray-100 pl-4 dark:border-gray-800">
											<BlueskyPost post={subReply.post} />
										</div>
									{/if}
								{/each}
							</div>
						{/if}
					</div>
				{/if}
			{/each}
		</div>
	{:else}
		<div
			class="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center dark:border-gray-700 dark:bg-gray-800/50"
		>
			<p class="mb-4 text-gray-600 dark:text-gray-400">No comments yet on Bluesky.</p>
			<a
				href="https://bsky.app/profile/{CONFIG.blueskyHandle}"
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex items-center gap-2 text-blue-600 hover:underline dark:text-blue-400"
			>
				Start the conversation on Bluesky
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
					/>
				</svg>
			</a>
		</div>
	{/if}
</div>
