<script lang="ts">
	import { theme } from '$lib/theme.svelte';
	import Tooltip from '$lib/components/Tooltip.svelte';

	let { mobile = false } = $props();

	const styleDescriptions = {
		default: 'Default Style',
		valentines: "Valentine's Style",
		'st-patricks': "St. Patrick's Style",
		easter: 'Easter Style',
		spring: 'Spring Style',
		summer: 'Summer Style',
		autumn: 'Autumn Style',
		halloween: 'Halloween Style',
		christmas: 'Christmas Style',
		'new-year': 'New Year Style'
	};
</script>

{#if theme.availableStyles.length > 1}
	<div class={mobile ? 'relative' : ''}>
		<Tooltip content={styleDescriptions[theme.style]} trigger="mouseenter focus" placement="bottom">
			<button
				onclick={() => theme.nextStyle()}
				class="btn-header"
				aria-label="Rotate Seasonal Style"
				type="button"
			>
				{#if theme.style === 'default'}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
						/>
					</svg>
				{:else if theme.style === 'valentines'}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
						/>
					</svg>
				{:else if theme.style === 'st-patricks'}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 6.5C12 6.5 12 2.5 9 2.5C6 2.5 6 6.5 12 11.5C18 6.5 18 2.5 15 2.5C12 2.5 12 6.5 12 6.5ZM12 11.5C12 11.5 12 15.5 9 15.5C6 15.5 6 11.5 12 6.5C18 11.5 18 15.5 15 15.5C12 15.5 12 11.5 12 11.5ZM12 11.5L12 21.5"
						/>
					</svg>
				{:else if theme.style === 'easter'}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"
						/>
					</svg>
				{:else if theme.style === 'spring'}
					<!-- Flower icon -->
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 8c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4 4 1.79 4 4zm0 0c0 2.21 1.79 4 4 4s4-1.79 4-4-1.79-4-4-4-4 1.79-4 4zm0 0c2.21 0 4 1.79 4 4s-1.79 4-4 4-4-1.79-4-4 1.79-4 4-4zm0 0c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zM12 8v12"
						/>
					</svg>
				{:else if theme.style === 'summer'}
					<!-- Sunglasses icon (User provided, resized) -->
					<svg viewBox="0 0 512 512" class="h-5 w-5" fill="currentColor">
						<path
							d="M507.44,185.327c-4.029-5.124-10.185-8.112-16.704-8.112c0,0-48.021,0-156.827,0h-65.774H243.87h-65.774
							c-108.806,0-156.827,0-156.827,0c-6.519,0-12.675,2.988-16.714,8.112c-4.028,5.125-5.486,11.815-3.965,18.152
							c0,0,12.421,56.269,19.927,82.534c7.506,26.265,26.265,48.772,86.29,48.772s59.827,0,74.828,0c21.258,0,46.256-19.99,55.028-45.023
							c4.97-14.16,12.756-32.738,19.338-47.876c6.582,15.138,14.368,33.716,19.338,47.876c8.773,25.033,33.77,45.023,55.028,45.023
							c15.001,0,14.803,0,74.828,0s78.784-22.507,86.29-48.772c7.496-26.264,19.918-82.534,19.918-82.534
							C512.935,197.142,511.478,190.452,507.44,185.327z M90.339,278.734C45.314,263.732,40.318,198.7,40.318,198.7s22.507,0,55.028,0
							L90.339,278.734z M340.464,278.734c-45.015-15.001-50.022-80.034-50.022-80.034s22.508,0,55.029,0L340.464,278.734z"
						/>
					</svg>
				{:else if theme.style === 'autumn'}
					<!-- Maple Leaf -->
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 2l1.5 4.5h5L15 9l1.5 5-4.5-3-4.5 3 1.5-5-3.5-2.5h5L12 2z M12 14v6"
						/>
					</svg>
				{:else if theme.style === 'halloween'}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 2C9.5 2 7.5 4 7.5 6.5C7.5 7.5 7.8 8.4 8.3 9.1C7.2 9.8 6.5 11.1 6.5 12.5C6.5 15 8.5 17 11 17H13C15.5 17 17.5 15 17.5 12.5C17.5 11.1 16.8 9.8 15.7 9.1C16.2 8.4 16.5 7.5 16.5 6.5C16.5 4 14.5 2 12 2ZM11 19V22M13 19V22M10 21H14"
						/>
					</svg>
				{:else if theme.style === 'new-year'}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 12L12 2M12 12L19.07 4.93M12 12L22 12M12 12L19.07 19.07M12 12L12 22M12 12L4.93 19.07M12 12L2 12M12 12L4.93 4.93"
						/>
					</svg>
				{:else if theme.style === 'christmas'}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 3l8 12h-16l8-12zM12 15v5M9 20h6"
						/>
					</svg>
				{/if}
			</button>
		</Tooltip>
	</div>
{/if}
