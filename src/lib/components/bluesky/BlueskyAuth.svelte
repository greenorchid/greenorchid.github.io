<script lang="ts">
	import { blueskyStore } from './stores.svelte';
	import { login, logout, initializeAgent } from './client';
	import { onMount } from 'svelte';
	import { logger } from '$lib/logger';
	import BlueskyLogo from './BlueskyLogo.svelte';
	import Tooltip from '../Tooltip.svelte';

	// Use blueskyStore directly for reactivity

	onMount(() => {
		initializeAgent();
	});

	function handleLogin() {
		logger.debug('BlueskyAuth: Login button clicked');
		login().catch((err) => {
			logger.error('BlueskyAuth: Login error:', err);
		});
	}

	function handleLogout() {
		logout();
	}
</script>

<div
	class="flex flex-col gap-4 rounded-xl bg-white p-4 shadow-sm dark:bg-gray-800 {blueskyStore.session
		? 'border border-gray-200 dark:border-gray-700'
		: ''}"
>
	{#if blueskyStore.session}
		<div class="flex items-center gap-3">
			{#if blueskyStore.profile?.avatar}
				<img
					src={blueskyStore.profile.avatar}
					alt={blueskyStore.profile.handle}
					class="h-10 w-10 rounded-full border border-gray-100 dark:border-gray-600"
				/>
			{:else}
				<div
					class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900"
				>
					<span class="font-bold text-blue-600 dark:text-blue-300">
						{blueskyStore.profile?.handle
							? blueskyStore.profile.handle[0].toUpperCase()
							: blueskyStore.session?.handle
								? blueskyStore.session.handle[0].toUpperCase()
								: '?'}
					</span>
				</div>
			{/if}
			<div class="flex-1">
				<p class="font-bold text-gray-900 dark:text-gray-100">
					{blueskyStore.profile?.displayName || blueskyStore.profile?.handle}
				</p>
				<p class="text-sm text-gray-500 dark:text-gray-400">@{blueskyStore.profile?.handle}</p>
			</div>
			<button
				onclick={handleLogout}
				class="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
			>
				Logout
			</button>
		</div>
	{:else}
		<div class="py-2 text-center">
			<Tooltip content="Log in to see your timeline and interact with posts.">
				<button
					onclick={handleLogin}
					disabled={blueskyStore.isLoading}
					class="inline-flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-6 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:ring-4 focus:ring-blue-200 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:focus:ring-blue-800"
				>
					{#if blueskyStore.isLoading}
						<svg
							class="h-5 w-5 animate-spin text-gray-700 dark:text-gray-300"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
						>
							<circle
								class="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								stroke-width="4"
							></circle>
							<path
								class="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							></path>
						</svg>
					{:else}
						<BlueskyLogo size={20} />
					{/if}
					Sign in with Bluesky
				</button>
			</Tooltip>
		</div>
	{/if}

	{#if blueskyStore.error}
		<p class="mt-2 text-xs text-red-600 dark:text-red-400">{blueskyStore.error.message}</p>
	{/if}
</div>
