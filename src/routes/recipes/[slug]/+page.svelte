<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve */
	import 'highlight.js/styles/github-dark.css';
	import IngredientsList from '$lib/components/IngredientsList.svelte';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';

	import { page } from '$app/state';
	import { CONFIG } from '$lib/config';
	import BlueskyComments from '$lib/components/bluesky/BlueskyComments.svelte';
	import BlueskyButton from '$lib/components/bluesky/BlueskyButton.svelte';

	let { data } = $props();
	const recipe = $derived(data.post);
</script>

{#if recipe}
	<article id="main-content" class="container mx-auto max-w-4xl px-4 py-8">
		<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
		<button
			onclick={() => goto(`${base}/recipes`)}
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
			Back to Recipes
		</button>

		<div
			class="rounded-lg border border-gray-200 bg-gray-100 p-6 md:p-8 dark:border-gray-700 dark:bg-gray-800"
		>
			<header class="mb-6">
				<h1 class="mb-4 text-4xl font-bold text-gray-900 md:text-5xl dark:text-gray-100">
					{recipe.title}
				</h1>
				<p class="mb-4 text-sm text-gray-500 dark:text-gray-400">{recipe.date}</p>
				<div class="mt-6 flex flex-wrap items-center justify-between gap-2">
					<div class="flex flex-wrap gap-2">
						{#if recipe.tags.length > 0}
							{#each recipe.tags as tag (tag)}
								<span
									class="rounded-full border border-green-200 bg-green-100 px-3 py-1 text-sm text-green-700 dark:border-green-800 dark:bg-green-900/30 dark:text-green-400"
								>
									{tag}
								</span>
							{/each}
						{/if}
					</div>
					<BlueskyButton
						href="https://bsky.app/intent/compose?text={encodeURIComponent(
							`Read "${recipe.title}" by @${CONFIG.blueskyHandle}\n\n${page.url.href}`
						)}"
					/>

					{#if recipe.blueskyUri}
						<a
							href="https://bsky.app/profile/{recipe.blueskyUri.split(
								'/'
							)[2]}/post/{recipe.blueskyUri.split('/').pop()}"
							target="_blank"
							rel="noopener noreferrer"
							class="text-sm text-blue-600 hover:underline dark:text-blue-400"
						>
							View on Bluesky
						</a>
					{/if}
				</div>
			</header>

			{#if recipe.ingredients && recipe.ingredients.length > 0}
				<IngredientsList ingredients={recipe.ingredients} servings={recipe.servings} />
			{/if}

			<div
				class="prose prose-lg max-w-none dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-gray-100 prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-a:text-green-600 prose-a:no-underline hover:prose-a:underline dark:prose-a:text-green-400 prose-strong:text-gray-900 dark:prose-strong:text-gray-100 prose-code:rounded prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-green-600 dark:prose-code:bg-gray-800 dark:prose-code:text-green-400 prose-pre:border prose-pre:border-gray-700 prose-pre:bg-gray-900 dark:prose-pre:bg-gray-950"
			>
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				{@html recipe.html}
			</div>
		</div>

		{#if recipe.blueskyUri}
			<BlueskyComments postUri={recipe.blueskyUri} />
		{/if}
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
