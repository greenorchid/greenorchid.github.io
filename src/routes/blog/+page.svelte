<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve */
	import { getAllPosts, getAllTags } from '$lib/blog/utils';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';

	const posts = getAllPosts();
	const allTags = getAllTags();
	let selectedTag = $state<string | null>(null);
	let filteredPosts = $derived(
		selectedTag ? posts.filter((post) => post.tags.includes(selectedTag as string)) : posts
	);
</script>

<div id="main-content" class="container mx-auto max-w-6xl px-4 py-8">
	<h1 class="mb-8 text-4xl font-bold">Blog</h1>

	{#if allTags.length > 0}
		<!-- Tag Filter Section -->
		<div
			class="mb-6 rounded-lg border border-gray-200 bg-gray-100 p-4 dark:border-gray-700 dark:bg-gray-800"
		>
			<div class="flex flex-wrap items-center gap-2">
				<span class="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by tag:</span>
				<button
					onclick={() => (selectedTag = null)}
					class="rounded-full px-3 py-1 text-sm transition-colors {selectedTag === null
						? 'bg-green-600 text-white dark:bg-green-500'
						: 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'}"
				>
					All
				</button>
				{#each allTags as tag (tag)}
					<button
						onclick={() => (selectedTag = selectedTag === tag ? null : tag)}
						class="rounded-full px-3 py-1 text-sm transition-colors {selectedTag === tag
							? 'bg-green-600 text-white dark:bg-green-500'
							: 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'}"
					>
						{tag}
					</button>
				{/each}
			</div>
		</div>
	{/if}

	{#if filteredPosts.length === 0}
		<div
			class="rounded-lg border border-gray-200 bg-gray-100 p-6 dark:border-gray-700 dark:bg-gray-800"
		>
			<p class="text-gray-700 dark:text-gray-300">
				{#if selectedTag}
					No posts found with tag "{selectedTag}".
				{:else}
					No blog posts yet. Check back soon!
				{/if}
			</p>
		</div>
	{:else}
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each filteredPosts as post (post.slug)}
				<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
				<div
					role="button"
					tabindex="0"
					onclick={() => goto(`${base}/blog/${post.slug}`)}
					onkeydown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') {
							e.preventDefault();
							goto(`/blog/${post.slug}`);
						}
					}}
					class="card-interactive group cursor-pointer"
				>
					<h2
						class="mb-2 text-lg font-bold text-gray-900 transition-colors group-hover:text-green-600 dark:text-gray-100 dark:group-hover:text-green-400"
					>
						{post.title}
					</h2>
					<p class="mb-2 text-sm text-gray-500 dark:text-gray-400">{post.date}</p>
					<p class="mb-4 line-clamp-4 text-gray-700 dark:text-gray-300">{post.excerpt}</p>
					{#if post.tags.length > 0}
						<div class="mt-4 flex flex-wrap gap-2">
							{#each post.tags as tag (tag)}
								<span
									class="rounded-full border border-green-200 bg-green-100 px-2 py-1 text-xs text-green-700 dark:border-green-800 dark:bg-green-900/30 dark:text-green-400"
								>
									{tag}
								</span>
							{/each}
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</div>
