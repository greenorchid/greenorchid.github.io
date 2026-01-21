<script lang="ts">
	let { isOpen, onToggle } = $props();

	function handleToggle() {
		onToggle(!isOpen);
	}
</script>

<!-- Hamburger Button -->
<button
	onclick={handleToggle}
	class="btn-header relative z-50"
	aria-label="Toggle menu"
	aria-expanded={isOpen}
	aria-controls="mobile-menu"
	type="button"
>
	<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		{#if isOpen}
			<!-- Close icon -->
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M6 18L18 6M6 6l12 12"
			/>
		{:else}
			<!-- Hamburger icon -->
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M4 6h16M4 12h16M4 18h16"
			/>
			/>
		{/if}
	</svg>
</button>
