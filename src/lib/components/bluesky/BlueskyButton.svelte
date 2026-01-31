<script lang="ts">
	import BlueskyLogo from './BlueskyLogo.svelte';

	let {
		href,
		text = 'Share on Bluesky',
		target = '_blank',
		rel = 'noopener noreferrer',
		class: className = ''
	}: {
		href: string;
		text?: string;
		target?: string;
		rel?: string;
		class?: string;
	} = $props();
</script>

<a
	{href}
	{target}
	rel="external {rel}"
	class="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 {className}"
>
	<BlueskyLogo size={16} />
	{text}
</a>
