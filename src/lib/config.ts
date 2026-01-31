import { env } from '$env/dynamic/public';

const DEFAULT_DOMAIN = 'https://behan.dev';

export const CONFIG = {
	siteName: 'behan.dev',
	clientName: 'Behan.dev Attic',
	blueskyHandle: 'behan.dev',
	buildId: 'v-' + new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-'),
	get domain(): string {
		const rawDomain = env.PUBLIC_DOMAIN || DEFAULT_DOMAIN;
		return rawDomain.endsWith('/') ? rawDomain.slice(0, -1) : rawDomain;
	}
};

/**
 * Gets the configured public domain, falling back to behan.dev if not specified.
 * Removes trailing slashes for consistency.
 * @deprecated Use CONFIG.domain instead.
 */
export function getDomain(): string {
	return CONFIG.domain;
}
