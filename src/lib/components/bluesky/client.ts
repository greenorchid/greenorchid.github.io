import { BrowserOAuthClient } from '@bluesky-social/oauth-client-browser';
import { BskyAgent } from '@bluesky-social/api';
import { blueskyStore } from './stores.svelte';
import { CONFIG } from '$lib/config';
import { logger } from '$lib/logger';

const domain = CONFIG.domain;

const clientMetadata = {
	client_id: `${domain}/client-metadata.json`,
	client_name: CONFIG.clientName,
	client_uri: domain,
	redirect_uris: [`${domain}/`],
	scope: 'atproto',
	grant_types: ['authorization_code', 'refresh_token'],
	response_types: ['code'],
	token_endpoint_auth_method: 'none',
	application_type: 'web',
	dpop_bound_access_tokens: true
};

let oauthClient: BrowserOAuthClient | null = null;
let initPromise: Promise<void> | null = null;

export async function getOAuthClient() {
	if (typeof window === 'undefined') return null;
	if (!oauthClient) {
		try {
			oauthClient = await BrowserOAuthClient.load({
				handleResolver: 'https://bsky.social',
				clientId: clientMetadata.client_id,
				// @ts-expect-error - Metadata is fetched from client_id URL in web mode
				clientMetadata: clientMetadata,
				allowHttp: true,
				fetch: async (input, init) => {
					const url = input instanceof Request ? input.url : input.toString();
					const isNgrok = url.includes('ngrok-free.dev');
					if (isNgrok) {
						init = init || {};
						const headers = new Headers(
							init.headers || (input instanceof Request ? input.headers : {})
						);
						headers.set('ngrok-skip-browser-warning', '1');

						// Create a new RequestInit with the modified headers
						const newInit: RequestInit = {
							...init,
							headers
						};

						// If input was a Request, we need to extract body and method
						if (input instanceof Request) {
							newInit.method = newInit.method || input.method;
							if (!newInit.body && input.method !== 'GET' && input.method !== 'HEAD') {
								// We have to clone the request to read body, but for metadata GET it's fine
								// Actually Svelte's fetch doesn't need this for clientMetadata which is a GET
								// We'll just pass the URL as string to avoid Request body consumption issues
								const reqClone = input.clone();
								if (reqClone.body) newInit.body = reqClone.body;
							}
							return fetch(url, newInit);
						}
						return fetch(input, newInit);
					}
					return fetch(input, init);
				}
			});
		} catch (err) {
			logger.warn('Bluesky client: Failed to load OAuth client (expected in guest mode):', err);
			return null;
		}
	}
	return oauthClient;
}

export async function initializeAgent() {
	if (typeof window === 'undefined') return;
	if (initPromise) return initPromise;

	initPromise = (async () => {
		blueskyStore.isLoading = true;
		try {
			logger.debug('Bluesky client: Initializing agent...');

			const client = await getOAuthClient();
			if (!client) {
				logger.debug('Bluesky client: No OAuth client, running in guest mode');
				return;
			}

			const result = await client.init();
			logger.debug('Bluesky client: Init result:', result);

			if (result?.session) {
				const session = result.session;
				const serviceUrl = (session as any).service || 'https://bsky.social';

				const agent = new BskyAgent({
					service: serviceUrl,
					fetch: async (url, init) => {
						const method = (
							init?.method || (url instanceof Request ? url.method : 'GET')
						).toUpperCase();
						const actualUrl = url instanceof Request ? url.url : url.toString();

						const sessionAny = session as any;
						const fetchFn = sessionAny.fetchHandler || sessionAny.fetch || sessionAny.dpopFetch;

						if (!fetchFn) return fetch(url, init);

						const headers = new Headers(
							init?.headers || (url instanceof Request ? (url as Request).headers : {})
						);
						if (method === 'POST' && !headers.has('Content-Type')) {
							headers.set('Content-Type', 'application/json');
						}

						const forwardInit: RequestInit = {
							...init,
							method,
							headers
						};

						if (
							url instanceof Request &&
							!forwardInit.body &&
							method !== 'GET' &&
							method !== 'HEAD'
						) {
							forwardInit.body = await url.clone().arrayBuffer();
						}

						let finalRequestInfo: string = actualUrl;
						try {
							const requestUrlObj = new URL(actualUrl);
							const serviceUrlObj = new URL(serviceUrl);

							if (requestUrlObj.origin === serviceUrlObj.origin) {
								finalRequestInfo =
									requestUrlObj.pathname + requestUrlObj.search + requestUrlObj.hash;
							}
						} catch {
							// If URL parsing fails, fall back to using the original URL without
							// attempting substring-based manipulation that could mis-handle hosts.
							finalRequestInfo = actualUrl;
						}

						return fetchFn.call(session, finalRequestInfo, forwardInit);
					}
				});

				blueskyStore.agent = agent;
				blueskyStore.session = { did: session.did, handle: '', active: true };
				await fetchProfile(session.did);
				logger.debug('Bluesky client: Initialization complete');
			}
		} catch (error) {
			logger.error('Bluesky client: Initialization failed:', error);
		} finally {
			blueskyStore.isLoading = false;
		}
	})();

	return initPromise;
}

async function fetchProfile(did: string) {
	try {
		const guestAgent = new BskyAgent({ service: 'https://api.bsky.app' });
		const response = await guestAgent.getProfile({ actor: did });
		blueskyStore.profile = response.data as any;
	} catch (error) {
		logger.error('Failed to fetch Bluesky profile:', error);
	}
}

export async function login() {
	const client = await getOAuthClient();
	if (client) {
		await client.signIn('https://bsky.social', { scope: 'atproto' });
	}
}

export async function logout() {
	const did = blueskyStore.session?.did;
	if (did) {
		const client = await getOAuthClient();
		if (client) {
			try {
				await client.revoke(did);
			} catch (err) {
				logger.warn('Failed to revoke session:', err);
			}
		}
	}
	blueskyStore.reset();
	initPromise = null;
}
