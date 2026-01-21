<script lang="ts">
	import { scaleIngredients } from '$lib/recipes/utils';

	let { ingredients, multiplier = 1, servings } = $props();

	let localMultiplier = $state.raw(1);
	$effect(() => {
		localMultiplier = multiplier;
	});
	const scaledServings = $derived(servings ? Math.round(servings * localMultiplier) : undefined);
	const scaledIngredients = $derived(scaleIngredients(ingredients || [], localMultiplier));

	function resetMultiplier() {
		localMultiplier = 1;
	}

	// Preset multipliers
	const presets = [
		{ label: '½', value: 0.5 },
		{ label: '1', value: 1 },
		{ label: '2', value: 2 },
		{ label: '3', value: 3 },
		{ label: '4', value: 4 }
	];
</script>

<div
	class="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
>
	<!-- Header with title and reset -->
	<div class="mb-4 flex items-center justify-between">
		<h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
			Ingredients
			{#if scaledServings}
				<span class="text-m font-normal text-gray-600 dark:text-gray-400">
					(Serves: {scaledServings})
				</span>
			{/if}
		</h3>
	</div>

	<!-- Preset buttons -->
	<div class="mb-4 flex flex-wrap items-center gap-2">
		<span class="text-sm font-medium text-gray-700 dark:text-gray-300">Scale Recipe:</span>
		<div class="flex gap-1">
			{#each presets as preset (preset.value)}
				<button
					onclick={() => (localMultiplier = preset.value)}
					class="rounded-md border px-3 py-1.5 text-sm font-medium transition-colors {localMultiplier ===
					preset.value
						? 'border-green-600 bg-green-600 text-white dark:border-green-500 dark:bg-green-500'
						: 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'}"
				>
					{preset.label}
				</button>
			{/each}
			{#if localMultiplier !== 1}
				<button
					onclick={resetMultiplier}
					class="ml-4 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm
					       font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
				>
					Reset
				</button>
			{/if}
		</div>
	</div>

	<ul class="space-y-3">
		{#each scaledIngredients as ingredient (ingredient.name)}
			<li
				class="flex items-start justify-between border-b border-gray-100 py-3 last:border-0 dark:border-gray-700"
			>
				<div class="flex-1">
					<span class="font-medium text-gray-900 dark:text-gray-100">{ingredient.name}</span>
					{#if ingredient.notes}
						<span class="text-s ml-2 text-gray-500 italic dark:text-gray-400"
							>({ingredient.notes})</span
						>
					{/if}
				</div>
				<span class="ml-4 font-medium text-gray-900 dark:text-gray-100">
					{#if ingredient.amount % 1 === 0}
						{ingredient.amount}
					{:else}
						{ingredient.amount.toFixed(2).replace(/\.?0+$/, '')}
					{/if}
					{#if ingredient.unit}
						<span class="font-normal text-gray-600 dark:text-gray-400">{ingredient.unit}</span>
					{/if}
				</span>
			</li>
		{/each}
	</ul>

	{#if ingredients && ingredients.length === 0}
		<div class="py-8 text-center">
			<p class="text-sm text-gray-500 italic dark:text-gray-400">No ingredients listed</p>
		</div>
	{/if}
</div>
