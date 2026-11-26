import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit({
			alias: {
				$lib: 'src/lib'
			},
			preprocess: vitePreprocess(),
			adapter: adapter({
				pages: 'build',
				assets: 'build',
				fallback: '404.html',
				precompress: false,
				strict: true
			}),
			prerender: {
				entries: ['*'],
				handleUnseenRoutes: 'ignore',
				handleHttpError: ({ status, path }) => {
					// Ignore 404s for assets and root path during prerender
					if (
						status === 404 &&
						(path.startsWith('/_app/') || path.startsWith('behan.dev-svelte/_app/') || path === '/')
					) {
						return;
					}
					throw new Error(`${status} ${path}`);
				}
			}
		})
	],
	server: {
		allowedHosts: ['boltlike-nonsectional-lailah.ngrok-free.dev']
	}
});
