<script lang="ts">
	import './layout.css';
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import AnimatedBackground from '$lib/components/AnimatedBackground.svelte';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<!--<div class="relative min-h-screen text-gray-900 transition-colors duration-200 dark:text-gray-100 ">-->
<div
	class="relative min-h-screen transition-colors duration-300"
	style="background-color: transparent; color: var(--text-primary);"
>
	<div
		class="pointer-events-none fixed inset-0 -z-50 h-full w-full"
		style="background-color: var(--bg-primary); opacity: var(--overlay-opacity);"
	></div>
	<AnimatedBackground />

	<!-- Desktop Layout -->
	<div class="hidden min-h-screen flex-col md:flex">
		<Header />
		<!-- Page content -->
		{@render children()}
		<!-- Footer -->
		<Footer />
	</div>

	<!-- Mobile Layout -->
	<div class="flex min-h-screen flex-col md:hidden">
		<Header />
		<!-- Page content -->
		<main class="flex-1">
			{@render children()}
		</main>
		<!-- Footer -->
		<Footer />
	</div>
</div>
