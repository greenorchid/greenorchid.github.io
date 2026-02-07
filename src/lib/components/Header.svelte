<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve */
	import { onMount } from 'svelte';
	import LogoAnimated from '$lib/components/LogoAnimated.svelte';
	import FontSizePopover from '$lib/components/FontSizePopover.svelte';
	import ReducedMotionToggle from '$lib/components/ReducedMotionToggle.svelte';
	import ModeToggle from '$lib/components/ModeToggle.svelte';
	import StyleToggle from '$lib/components/StyleToggle.svelte';
	import HamburgerMenu from '$lib/components/HamburgerMenu.svelte';

	import { page } from '$app/stores';
	import { isActive } from '$lib/utils';
	import { base } from '$app/paths';
	import { goto } from '$app/navigation';
	import { CONFIG } from '$lib/config';

	let currentPage = $derived($page.url.pathname);

	let showNavDropdown = $state(false);
	let showAccessibilityDropdown = $state(false);

	function closeDropdowns() {
		showNavDropdown = false;
		showAccessibilityDropdown = false;
	}

	const navLinks = [
		{ href: '/', label: 'Home' },
		{ href: '/blog', label: 'Blog' },
		{ href: '/recipes', label: 'Recipes' },
		{ href: '/links', label: 'Links' },
		{ href: '/about', label: 'About' }
	];

	onMount(() => {
		function handleClickOutside(event: MouseEvent) {
			const target = event.target as HTMLElement;
			if (!target.closest('header')) {
				closeDropdowns();
			}
		}

		function handleKeyDown(event: KeyboardEvent) {
			if (event.key === 'Escape') {
				closeDropdowns();
			}
		}

		document.addEventListener('click', handleClickOutside);
		document.addEventListener('keydown', handleKeyDown);

		return () => {
			document.removeEventListener('click', handleClickOutside);
			document.removeEventListener('keydown', handleKeyDown);
		};
	});

	function getLinkClass(href: string): string {
		const baseClass =
			'text-sm font-medium dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 relative after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-green-600 after:transition-all transition-colors';

		if (isActive(href, currentPage)) {
			return `${baseClass} text-green-600 dark:text-green-400 after:w-full`;
		}

		return `${baseClass} hover:after:w-full`;
	}
</script>

<!-- Skip to main content -->
<a
	href="#main-content"
	class="sr-only z-50 rounded bg-blue-600 px-4 py-2 text-white focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
>
	Skip to main content
</a>

<header
	class="sticky top-0 z-50 flex items-center justify-between bg-white p-4 shadow-sm dark:bg-gray-900"
>
	<!-- Logo and brand on left -->
	<div class="flex flex-shrink-0 items-center gap-3">
		<a href="{base}/" class="flex items-center gap-3">
			<LogoAnimated size={40} />
			<span class="text-lg font-semibold text-gray-900 dark:text-gray-100">{CONFIG.siteName}</span>
		</a>
	</div>

	<!-- Navigation links centered -->
	<nav class="hidden flex-1 justify-center md:flex">
		<div class="flex gap-6">
			{#each navLinks as link (link.href)}
				<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
				<button
					onclick={() => goto(`${base}${link.href}`)}
					class={getLinkClass(link.href)}
					aria-current={isActive(link.href, currentPage) ? 'page' : undefined}
				>
					{link.label}
				</button>
			{/each}
		</div>
	</nav>

	<!-- Mobile triggers -->
	<div class="flex gap-2 md:hidden">
		<HamburgerMenu isOpen={showNavDropdown} onToggle={(val: boolean) => (showNavDropdown = val)} />
		<button
			onclick={() => (showAccessibilityDropdown = !showAccessibilityDropdown)}
			class="relative z-50 rounded-lg bg-gray-100 p-2 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
			aria-label="Toggle accessibility options"
			aria-expanded={showAccessibilityDropdown}
			aria-controls="accessibility-menu"
			type="button"
		>
			<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
				/>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
				/>
			</svg>
		</button>
	</div>

	<!-- Desktop accessibility -->
	<div class="hidden flex-shrink-0 items-center gap-4 md:flex">
		<FontSizePopover mobile={false} />
		<ReducedMotionToggle mobile={false} />
		<ModeToggle mobile={false} />
		<StyleToggle mobile={false} />
	</div>

	<!-- Nav dropdown (mobile) -->
	<div
		id="mobile-menu"
		class="absolute top-full right-0 left-0 border-t border-gray-200 bg-white shadow-lg transition-all duration-300 ease-in-out md:hidden dark:border-gray-700 dark:bg-gray-900 {showNavDropdown
			? 'block'
			: 'hidden'}"
		role="menu"
	>
		<div class="flex flex-col gap-4 p-4">
			{#each navLinks as link (link.href)}
				<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
				<button
					onclick={() => {
						goto(`${base}${link.href}`);
						closeDropdowns();
					}}
					class="text-gray-900 hover:text-green-600 dark:text-gray-100 dark:hover:text-green-400 {getLinkClass(
						link.href
					)}"
					aria-current={isActive(link.href, currentPage) ? 'page' : undefined}
				>
					{link.label}
				</button>
			{/each}
		</div>
	</div>

	<!-- Accessibility dropdown (mobile) -->
	<div
		id="accessibility-menu"
		class="absolute top-full right-0 rounded-lg border border-gray-200 bg-white p-4 shadow-lg md:hidden dark:border-gray-700 dark:bg-gray-900 {showAccessibilityDropdown
			? 'block'
			: 'hidden'}"
		role="menu"
	>
		<div class="mb-2">
			<FontSizePopover mobile={true} />
		</div>
		<div class="mb-2">
			<ReducedMotionToggle mobile={true} />
		</div>
		<div class="mb-2">
			<ModeToggle mobile={true} />
		</div>
		<div class="mb-2">
			<StyleToggle mobile={true} />
		</div>
	</div>
</header>
