<script>
	import { resolve } from '$app/paths';
</script>

<footer
	class="mt-auto flex flex-col gap-2 border-t p-4 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between"
>
	<div>
		© 2026 Marc P. Behan | Version: {import.meta.env.DEV
			? 'local-dev'
			: import.meta.env.VITE_APP_VERSION}
	</div>
	<div>
		<a href={resolve('/disclaimer')} rel="noopener noreferrer"> Disclaimer </a>
	</div>
</footer>
