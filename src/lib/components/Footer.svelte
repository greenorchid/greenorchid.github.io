<script>
	import { resolve } from '$app/paths';
</script>

<footer
	class="mt-auto flex flex-col gap-2 border-t p-4 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between"
>
	<div class="order-2 sm:order-1">
		© 2026 Marc P. Behan | Version: {import.meta.env.DEV
			? 'local-dev'
			: import.meta.env.VITE_APP_VERSION}
	</div>
	<div class="order-1 sm:order-2">
		<a href={resolve('/disclaimer')} rel="noopener noreferrer"> Disclaimer </a>
	</div>
</footer>
