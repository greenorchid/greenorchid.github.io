<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve */
	import 'highlight.js/styles/github-dark.css';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import Tooltip from '$lib/components/Tooltip.svelte';

	let { data } = $props();
	const post = $derived(data.post);

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
						testId="tooltip-ai"
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
			</header>

			<div
				class="prose prose-lg max-w-none dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-gray-100 prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-a:text-green-600 prose-a:no-underline hover:prose-a:underline dark:prose-a:text-green-400 prose-strong:text-gray-900 dark:prose-strong:text-gray-100 prose-code:rounded prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-green-600 dark:prose-code:bg-gray-800 dark:prose-code:text-green-400 prose-pre:border prose-pre:border-gray-700 prose-pre:bg-gray-900 dark:prose-pre:bg-gray-950"
			>
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				{@html post.html}
			</div>
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
