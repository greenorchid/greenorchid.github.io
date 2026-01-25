<script lang="ts">
	import { blueskyStore } from './stores.svelte';
	import { login, logout, initializeAgent } from './client';
	import { onMount } from 'svelte';
	import { logger } from '$lib/logger';

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
	class="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800"
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
				class="rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
			>
				Logout
			</button>
		</div>
	{:else}
		<div class="py-2 text-center">
			<h3 class="mb-2 text-lg font-bold text-gray-900 dark:text-white">Connect to Bluesky</h3>
			<p class="mb-4 text-sm text-gray-600 dark:text-gray-400">
				Log in to see your timeline and interact with posts.
			</p>
			<button
				onclick={handleLogin}
				disabled={blueskyStore.isLoading}
				class="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 font-semibold text-white transition-all hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800"
			>
				{#if blueskyStore.isLoading}
					<svg
						class="h-5 w-5 animate-spin text-white"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
					>
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
						></circle>
						<path
							class="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						></path>
					</svg>
				{:else}
					<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
						<path
							d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"
						/>
					</svg>
				{/if}
				Sign in with Bluesky
			</button>
		</div>
	{/if}

	{#if blueskyStore.error}
		<p class="mt-2 text-xs text-red-600 dark:text-red-400">{blueskyStore.error.message}</p>
	{/if}
</div>
