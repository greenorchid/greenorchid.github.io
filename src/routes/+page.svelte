<script>
	/* eslint-disable svelte/no-navigation-without-resolve */
	import LogoAnimated from '$lib/components/LogoAnimated.svelte';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
</script>

<div id="main-content" class="container mx-auto max-w-4xl px-4 py-8">
	<LogoAnimated size={160} />
	<h1 class="mb-4 text-4xl font-bold">Welcome to My Digital Attic</h1>
	<p class="mb-4 text-lg">
		This is where I stash my favourite finds and creations – a personal collection of interesting
		links, recipes, and projects that have caught my eye or come from my own tinkering. It's all a
		bit self-indulgent, but hey, who doesn't enjoy a good rummage in their own attic?
	</p>
	<p class="mb-4 text-base">
		Feel free to browse around; you might spot something that sparks your interest. After all, one
		person's junk is another person's treasure – or in this case, one developer's code is another
		developer's inspiration!
	</p>
	<p class="mb-3 text-gray-700 dark:text-gray-300">
		Dive into my thoughts on platform engineering (building solid foundations that don't crumble
		under pressure), AI (artificial intelligence that's hopefully smarter than my attempts at
		baking), DevOps (where automation meets 'oops'), and anything else that piques my curiosity.
		It's a mix of technical insights and the occasional dad joke to keep things lively.
	</p>
	<p class="text-gray-700 dark:text-gray-300">
		Why 'dad jokes'? Because nothing says 'I'm a developer' like a pun about cloud computing being
		'sky-high' costs!
	</p>
	<p class="mt-6 text-sm text-gray-600 dark:text-gray-400">
		For more about me and my adventures in code, head over to the
		<button
			onclick={() => goto(`${base}/about`)}
			class="text-blue-600 hover:underline dark:text-blue-400">About</button
		> page.
	</p>
</div>
