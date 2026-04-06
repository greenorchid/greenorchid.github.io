<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve */
	import { getAllRecipes, getAllTags } from '$lib/recipes/utils';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';

	const recipes = getAllRecipes();
	const allTags = getAllTags();
	let selectedTags = $state<string[]>([]);
	let tagsExpanded = $state(false);
	let filteredRecipes = $derived(
		selectedTags.length > 0
			? recipes.filter((recipe) =>
					selectedTags.every((st) => recipe.tags.some((t) => t.toLowerCase() === st.toLowerCase()))
				)
			: recipes
	);

	function toggleTag(tag: string) {
		if (selectedTags.includes(tag)) {
			selectedTags = selectedTags.filter((t) => t !== tag);
		} else {
			selectedTags = [...selectedTags, tag];
		}
	}
</script>

<div id="main-content" class="container mx-auto max-w-6xl px-4 py-8">
	<h1 class="mb-8 text-4xl font-bold">Recipes</h1>

	{#if allTags.length > 0}
		<!-- Tag Filter Section -->
		<div
			class="mb-6 rounded-lg border border-gray-200 bg-gray-100 p-4 dark:border-gray-700 dark:bg-gray-800"
		>
			<div class="mb-3 flex items-center justify-between md:mb-0">
				<span class="text-sm font-medium text-gray-700 dark:text-gray-300">
					Filter by tag:
					{#if selectedTags.length > 0}
						<div class="ml-2 inline-flex flex-wrap gap-1">
							{#each selectedTags as st (st)}
								<span
									class="rounded-full border border-green-200 bg-green-100 px-2 py-0.5 text-xs text-green-700 dark:border-green-800 dark:bg-green-900/30 dark:text-green-400"
								>
									{st}
									<button
										class="ml-1 hover:text-green-900 dark:hover:text-green-200"
										onclick={() => toggleTag(st)}
										aria-label="Remove {st} filter">&times;</button
									>
								</span>
							{/each}
						</div>
					{/if}
				</span>
				<button
					class="text-sm text-green-600 hover:underline md:hidden dark:text-green-400"
					onclick={() => (tagsExpanded = !tagsExpanded)}
				>
					{tagsExpanded ? 'Hide' : 'Show'}
				</button>
			</div>

			<div
				class="mt-2 flex flex-wrap items-center gap-2 {tagsExpanded ? 'flex' : 'hidden md:flex'}"
			>
				<button
					onclick={() => (selectedTags = [])}
					class="rounded-full px-3 py-1 text-sm transition-colors {selectedTags.length === 0
						? 'bg-green-600 text-white dark:bg-green-500'
						: 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'}"
				>
					All
				</button>
				{#each allTags as tag (tag)}
					<button
						onclick={() => toggleTag(tag)}
						class="rounded-full px-3 py-1 text-sm transition-colors {selectedTags.includes(tag)
							? 'bg-green-600 text-white dark:bg-green-500'
							: 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'}"
					>
						{tag}
					</button>
				{/each}
			</div>
		</div>
	{/if}

	{#if filteredRecipes.length === 0}
		<div
			class="rounded-lg border border-gray-200 bg-gray-100 p-6 dark:border-gray-700 dark:bg-gray-800"
		>
			<p class="text-gray-700 dark:text-gray-300">
				{#if selectedTags.length > 0}
					No recipe(s) found matching tags "{selectedTags.join(', ')}".
				{:else}
					No recipes yet. Check back soon!
				{/if}
			</p>
		</div>
	{:else}
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each filteredRecipes as recipe (recipe.slug)}
				<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
				<div
					role="button"
					tabindex="0"
					onclick={() => goto(`${base}/recipes/${recipe.slug}`)}
					onkeydown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') {
							e.preventDefault();
							goto(`/recipes/${recipe.slug}`);
						}
					}}
					class="card-interactive group cursor-pointer"
				>
					<h2
						class="mb-2 text-2xl font-bold text-gray-900 transition-colors group-hover:text-green-600 dark:text-gray-100 dark:group-hover:text-green-400"
					>
						{recipe.title}
					</h2>
					<p class="mb-3 text-sm text-gray-500 dark:text-gray-400">{recipe.date}</p>
					<p class="mb-4 text-gray-700 dark:text-gray-300">{recipe.excerpt}</p>
					{#if recipe.tags.length > 0}
						<div class="mt-4 flex flex-wrap gap-2">
							{#each recipe.tags as tag (tag)}
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
