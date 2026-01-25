<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve */
	import { onMount } from 'svelte';
	import 'highlight.js/styles/github-dark.css';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import Tooltip from '$lib/components/Tooltip.svelte';
	import BlueskyComments from '$lib/components/bluesky/BlueskyComments.svelte';
	import { post as postToBluesky } from '$lib/components/bluesky/actions';
	import { blueskyStore } from '$lib/components/bluesky/stores.svelte';
	import { initializeAgent } from '$lib/components/bluesky/client';

	let { data } = $props();
	const post = $derived(data.post);

	onMount(() => {
		initializeAgent();
	});

	function getAiBadgeBorder(level: string) {
		switch (level) {
			case 'none':
				return 'text-green-700 dark:text-green-400 border-green-500';
			case 'partial':
				return 'text-yellow-700 dark:text-yellow-400 border-yellow-500';
			case 'considerable':
				return 'text-red-700 dark:text-red-400 border-red-500';
			default:
				return 'text-gray-700 dark:text-gray-400 border-gray-500';
		}
	}

	function getAiTooltip(level: string) {
		switch (level) {
			case 'none':
				return 'No AI contributions were used in creating this article.';
			case 'partial':
				return 'Partial AI contributions: Image/diagram generation, external research assistance, or minor enhancements.';
			case 'considerable':
				return 'Considerable AI contributions: Article summarization, primary research, content generation, or significant AI-driven insights.';
			default:
				return 'AI contribution level not specified.';
		}
	}
</script>

{#if post}
	<article id="main-content" class="container mx-auto max-w-4xl px-4 py-8">
		<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
		<button
			onclick={() => goto(`${base}/blog`)}
			class="mb-6 inline-flex items-center text-sm text-gray-600 transition-colors hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="mr-2 h-4 w-4"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
			</svg>
			Back to Blog
		</button>

		<div
			class="rounded-lg border border-gray-200 bg-gray-100 p-6 md:p-8 dark:border-gray-700 dark:bg-gray-800"
		>
			<header class="mb-6">
				<h1 class="mb-4 text-4xl font-bold text-gray-900 md:text-5xl dark:text-gray-100">
					{post.title}
				</h1>
				<p class="mb-4 text-sm text-gray-500 dark:text-gray-400">{post.date}</p>
				{#if post.tags.length > 0}
					<div class="flex flex-wrap gap-2">
						{#each post.tags as tag (tag)}
							<span
								class="rounded-full border border-green-200 bg-green-100 px-3 py-1 text-sm text-green-700 dark:border-green-800 dark:bg-green-900/30 dark:text-green-400"
							>
								{tag}
							</span>
						{/each}
					</div>
				{/if}
				<div class="mt-4">
					<Tooltip
						content={getAiTooltip(post.aiContributions)}
						trigger="mouseenter focus"
						placement="top"
					>
						<span
							class="inline-flex items-center rounded-lg border-2 bg-white px-4 py-2 text-sm font-medium dark:bg-gray-800 {getAiBadgeBorder(
								post.aiContributions
							)}"
						>
							🤖 AI: {post.aiContributions}
						</span>
					</Tooltip>
				</div>

				<div class="mt-4 flex flex-wrap items-center gap-4">
					{#if blueskyStore.isAuthenticated}
						<button
							onclick={async () => {
								const text = `Read "${post.title}" by @${blueskyStore.session?.handle || 'behan.dev'}\n\n${window.location.href}`;
								await postToBluesky(text);
								alert('Shared to Bluesky!');
							}}
							disabled={blueskyStore.isLoading}
							class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
						>
							<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
								<path
									d="M12 10.8c0-4.004 3.014-7.25 6.732-7.25C22.454 3.55 24 6.545 24 9.496c0 3.32-2.148 6.27-5.414 7.245 4.316.326 7.414 2.213 7.414 4.54 0 2.242-2.88 4.148-7.3 4.607.014-.148.02-.3.02-.454 0-4.004-3.014-7.25-6.732-7.25-3.718 0-6.732 3.246-6.732 7.25 0 .154.006.306.02.454-4.42-.459-7.3-2.365-7.3-4.607 0-2.327 3.098-4.214 7.414-4.54C2.148 15.766 0 12.816 0 9.496c0-2.951 1.546-5.946 5.268-5.946 3.718 0 6.732 3.246 6.732 7.25z"
								/>
							</svg>
							Share on Bluesky
						</button>
					{:else}
						<a
							href="/"
							class="inline-flex items-center gap-2 rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
						>
							Connect Bluesky to Share
						</a>
					{/if}

					{#if post.blueskyUri}
						<a
							href="https://bsky.app/profile/{post.blueskyUri.split('/')[2]}/post/{post.blueskyUri
								.split('/')
								.pop()}"
							target="_blank"
							rel="noopener noreferrer"
							class="text-sm text-blue-600 hover:underline dark:text-blue-400"
						>
							View on Bluesky
						</a>
					{/if}
				</div>
			</header>

			<div
				class="prose prose-lg max-w-none dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-gray-100 prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-a:text-green-600 prose-a:no-underline hover:prose-a:underline dark:prose-a:text-green-400 prose-strong:text-gray-900 dark:prose-strong:text-gray-100 prose-code:rounded prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-green-600 dark:prose-code:bg-gray-800 dark:prose-code:text-green-400 prose-pre:border prose-pre:border-gray-700 prose-pre:bg-gray-900 dark:prose-pre:bg-gray-950"
			>
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				{@html post.html}
			</div>

			{#if post.blueskyUri}
				<BlueskyComments postUri={post.blueskyUri} />
			{/if}
		</div>
	</article>
{/if}

<style>
	:global(.prose pre code) {
		color: inherit;
		background: transparent !important;
		padding: 0;
	}
	:global(.prose pre) {
		background: rgb(17 24 39) !important; /* gray-900 */
	}
	:global(.dark .prose pre) {
		background: rgb(3 7 18) !important; /* gray-950 */
	}
	:global(.prose code::before),
	:global(.prose code::after) {
		content: '';
	}
	:global(.prose pre code.hljs) {
		background: transparent !important;
	}
</style>
