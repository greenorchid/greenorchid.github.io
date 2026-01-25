<script lang="ts">
	import type { BlueskyPost } from './types';
	import { like } from './actions';
	import { logger } from '$lib/logger';

	let { post }: { post: BlueskyPost } = $props();

	let isLiked = $state(false);
	let localLikeCount = $state(0);

	// Reactively sync initial value but allow local increment
	$effect(() => {
		if (!isLiked) {
			localLikeCount = post.likeCount || 0;
		}
	});

	const displayLikeCount = $derived(isLiked ? localLikeCount : post.likeCount || 0);

	async function handleLike() {
		try {
			await like(post.uri, post.cid);
			isLiked = true;
			localLikeCount++;
		} catch (err) {
			logger.error('Failed to like post:', err);
		}
	}
</script>

<div
	class="border-b border-gray-100 p-4 transition-colors last:border-0 hover:bg-gray-50/50 dark:border-gray-700/50 dark:hover:bg-gray-800/30"
>
	<div class="flex gap-3">
		{#if post.author.avatar}
			<img src={post.author.avatar} alt={post.author.handle} class="h-10 w-10 rounded-full" />
		{:else}
			<div class="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
		{/if}

		<div class="min-w-0 flex-1">
			<div class="mb-0.5 flex items-center gap-1">
				<span class="truncate font-bold text-gray-900 dark:text-gray-100">
					{post.author.displayName || post.author.handle}
				</span>
				<span class="truncate text-sm text-gray-500">@{post.author.handle}</span>
				<span class="text-xs text-gray-400">·</span>
				<span class="text-xs whitespace-nowrap text-gray-400">
					{new Date(post.record.createdAt).toLocaleDateString()}
				</span>
			</div>

			<p
				class="mb-3 leading-relaxed break-words whitespace-pre-wrap text-gray-800 dark:text-gray-200"
			>
				{post.record.text}
			</p>

			<div class="flex items-center gap-6">
				<button
					class="group flex items-center gap-1.5 text-gray-500 transition-colors hover:text-blue-500"
				>
					<div class="rounded-full p-2 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20">
						<svg class="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
							/>
						</svg>
					</div>
					<span class="text-sm">{post.replyCount || 0}</span>
				</button>

				<button
					onclick={handleLike}
					class="group flex items-center gap-1.5 transition-colors {isLiked
						? 'text-pink-600'
						: 'text-gray-500 hover:text-pink-600'}"
				>
					<div class="rounded-full p-2 group-hover:bg-pink-50 dark:group-hover:bg-pink-900/20">
						<svg
							class="h-4.5 w-4.5"
							fill={isLiked ? 'currentColor' : 'none'}
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
							/>
						</svg>
					</div>
					<span class="text-sm">{displayLikeCount}</span>
				</button>
			</div>
		</div>
	</div>
</div>
