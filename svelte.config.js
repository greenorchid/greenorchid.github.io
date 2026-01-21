import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: 'index.html',
			precompress: false,
			strict: true
		}),
		// paths: {
		// 	base: '/behan.dev-svelte'
		// },
		prerender: {
			entries: ['*'],
			handleUnseenRoutes: (route) => {
				if (
					typeof route === 'string' &&
					(route.startsWith('/blog/') || route.startsWith('/recipes/'))
				) {
					return 'prerender';
				}
				return 'ignore';
			},
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
	},

	vite: {
		define: {
			__COMMIT_HASH__: JSON.stringify(process.env.VITE_COMMIT || 'unknown')
		},
		build: {
			chunkSizeWarningLimit: 2048,
			rollupOptions: {
				output: {
					manualChunks: {
						tippy: ['tippy.js'],
						svelte: ['svelte', 'svelte/internal']
					}
				}
			}
		}
	}
};

export default config;
