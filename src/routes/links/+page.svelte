<script lang="ts">
	import { getAllLinks, getAllLinkTags } from '$lib/links/links';

	const links = getAllLinks();
	const allTags = getAllLinkTags();
	let selectedTag = $state<string | null>(null);
	let filteredLinks = $derived(
		selectedTag ? links.filter((link) => link.tags.includes(selectedTag as string)) : links
	);
</script>

<div id="main-content" class="container mx-auto max-w-6xl px-4 py-8">
	<h1 class="mb-8 text-4xl font-bold text-gray-900 dark:text-gray-100">Interesting Links</h1>
	<p class="mb-5">
		Links that I find interesting or those I'd like to keep around. A public bookmark perhaps...
	</p>

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

	{#if filteredLinks.length === 0}
		<div
			class="rounded-lg border border-gray-200 bg-gray-100 p-6 dark:border-gray-700 dark:bg-gray-800"
		>
			<p class="text-gray-700 dark:text-gray-300">
				{#if selectedTag}
					No links found with tag "{selectedTag}".
				{:else}
					No links available yet. Check back soon!
				{/if}
			</p>
		</div>
	{:else}
		<div class="space-y-4">
			{#each filteredLinks as link (link.url)}
				<div
					role="button"
					tabindex="0"
					onclick={() => window.open(link.url, '_blank')}
					onkeydown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') {
							e.preventDefault();
							window.open(link.url, '_blank');
						}
					}}
					class="card-interactive group cursor-pointer"
				>
					<div class="flex items-start justify-between gap-4">
						<div class="flex-1">
							<h2
								class="mb-2 flex w-full items-center justify-between text-xl font-bold text-gray-900 transition-colors group-hover:text-green-600 dark:text-gray-100 dark:group-hover:text-green-400"
							>
								<span>{link.title}</span>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="mt-1 h-4 w-4 flex-shrink-0 text-gray-400 transition-colors group-hover:text-green-600 dark:text-gray-500 dark:group-hover:text-green-400"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									aria-hidden="true"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
									/>
								</svg>
							</h2>
							<p class="mb-3 break-words text-gray-700 dark:text-gray-300">{link.description}</p>
							<div class="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
								<span class="break-words text-green-600 dark:text-green-400">
									{link.url}
								</span>
								{#if link.addedDate}
									<span class="whitespace-nowrap">{link.addedDate}</span>
								{/if}
							</div>
							{#if link.tags.length > 0}
								<div class="mt-4 flex flex-wrap gap-2">
									{#each link.tags as tag (tag)}
										<span
											class="rounded-full border border-green-200 bg-green-100 px-2 py-1 text-xs text-green-700 dark:border-green-800 dark:bg-green-900/30 dark:text-green-400"
										>
											{tag}
										</span>
									{/each}
								</div>
							{/if}
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
