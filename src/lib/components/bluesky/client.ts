import { BrowserOAuthClient } from '@bluesky-social/oauth-client-browser';
import { BskyAgent } from '@bluesky-social/api';
import { blueskyStore } from './stores.svelte';
import { PUBLIC_DOMAIN } from '$env/static/public';
import { logger } from '$lib/logger';

const domain = PUBLIC_DOMAIN.endsWith('/') ? PUBLIC_DOMAIN.slice(0, -1) : PUBLIC_DOMAIN;

const clientMetadata = {
	client_id: `${domain}/client-metadata.json`,
	client_name: 'Behan.dev Svelte',
	client_uri: domain,
	redirect_uris: [`${domain}/`],
	scope: 'atproto transition:generic',
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
		oauthClient = await BrowserOAuthClient.load({
			handleResolver: 'https://bsky.social',
			clientId: clientMetadata.client_id,
			// @ts-expect-error - Metadata is fetched from client_id URL in web mode
			clientMetadata: clientMetadata,
			allowHttp: true
		});
	}
	return oauthClient;
}

export async function initializeAgent() {
	if (typeof window === 'undefined') return;
	if (initPromise) return initPromise;

	initPromise = (async () => {
		const client = await getOAuthClient();
		if (!client) return;

		try {
			logger.debug('Bluesky client: Initializing agent...');
			blueskyStore.isLoading = true;
			const result = await client.init();
			logger.debug('Bluesky client: Init result:', result);

			if (result?.session) {
				const session = result.session;
				const sessionClientId = (session as any).server?.clientMetadata?.client_id;

				// Diagnostic: Check what scopes and audience we actually got
				let tokenInfo: any = {};
				try {
					tokenInfo = await (session as any).getTokenInfo();
					logger.debug('Bluesky client: Token Info:', {
						aud: tokenInfo.aud,
						scope: tokenInfo.scope,
						expiresAt: tokenInfo.expiresAt
					});
				} catch (e) {
					logger.warn('Bluesky client: Could not fetch token info');
				}

				logger.debug('Bluesky client: Session diagnostics:', {
					clientId: sessionClientId,
					did: session.did
				});

				// USE THE PDS URL (token audience) for the agent.
				// We must talk to the audience designated in the token.
				const serviceUrl =
					tokenInfo.aud ||
					(session as any).service ||
					(session as any).server?.serverMetadata?.issuer ||
					'https://bsky.social';

				const agent = new BskyAgent({
					service: serviceUrl,
					fetch: async (url, init) => {
						const method = (
							init?.method || (url instanceof Request ? url.method : 'GET')
						).toUpperCase();
						const actualUrl = url instanceof Request ? url.url : url.toString();

						logger.debug(`BskyAgent request [${method}]:`, actualUrl);

						const sessionAny = session as any;
						const fetchFn = sessionAny.fetchHandler || sessionAny.fetch || sessionAny.dpopFetch;

						if (!fetchFn) {
							logger.error('Bluesky client: No fetch handler found on session');
							return fetch(url, init);
						}

						// Prepare headers
						const headers = new Headers(
							init?.headers || (url instanceof Request ? (url as Request).headers : {})
						);

						// Bluesky XRPC requires application/json for most POSTs
						if (method === 'POST' && !headers.has('Content-Type')) {
							headers.set('Content-Type', 'application/json');
						}

						// Prepare forward options
						const forwardInit: RequestInit = {
							...init,
							method,
							headers
						};

						// IMPORTANT: If 'url' is a Request object, it might contain the body.
						// Our fetch handler expects the body in the second argument (init)
						// because we pass a string path as the first argument.
						if (
							url instanceof Request &&
							!forwardInit.body &&
							method !== 'GET' &&
							method !== 'HEAD'
						) {
							logger.debug(`BskyAgent: Extracting body from Request object for [${method}]`);
							forwardInit.body = await url.clone().arrayBuffer();
						}

						// Very important: The fetchHandler from @bluesky-social/oauth-client
						// works best when we pass it the PATH + SEARCH if we're hitting the service URL.
						let finalRequestInfo: string = actualUrl;
						if (actualUrl.startsWith(serviceUrl)) {
							finalRequestInfo = actualUrl.slice(serviceUrl.length);
							if (!finalRequestInfo.startsWith('/')) finalRequestInfo = '/' + finalRequestInfo;
						}

						const response = await fetchFn.call(session, finalRequestInfo, forwardInit);
						logger.debug(
							`BskyAgent response [${response.status}] for [${method}] ${finalRequestInfo}:`,
							actualUrl
						);

						if (response.status === 401 || response.status === 400 || response.status === 404) {
							const text = await response
								.clone()
								.text()
								.catch(() => 'no body');
							logger.warn('BskyAgent error details:', {
								status: response.status,
								method,
								path: finalRequestInfo,
								body: text
							});
						}
						return response;
					}
				});

				logger.debug('Bluesky client: Agent instance created, saving to store');
				blueskyStore.agent = agent;

				logger.debug('Bluesky client: Setting store session for DID:', session.did);
				blueskyStore.session = {
					did: session.did,
					handle: (session as any).handle || (session as any).sub || '',
					active: true
				};

				await fetchProfile(session.did);

				// Update session handle from fetched profile for better UI
				if (blueskyStore.profile && blueskyStore.session) {
					blueskyStore.session.handle = blueskyStore.profile.handle;
				}

				logger.debug('Bluesky client: Initialization complete');
			}
		} catch (error) {
			logger.error('Bluesky client: Initialization failed:', error);
			blueskyStore.error = {
				error: 'Initialization failed',
				message: error instanceof Error ? error.message : 'Unknown error'
			};
		} finally {
			blueskyStore.isLoading = false;
		}
	})();

	return initPromise;
}

async function fetchProfile(did: string) {
	if (!blueskyStore.agent) return;
	try {
		const response = await blueskyStore.agent.getProfile({ actor: did });
		blueskyStore.profile = response.data as any;
		logger.debug('Bluesky client: Profile fetched successfully:', response.data.handle);
	} catch (error) {
		logger.error('Failed to fetch Bluesky profile:', error);
	}
}

export async function login() {
	logger.debug('Bluesky client: Attempting login...');
	const client = await getOAuthClient();
	if (!client) {
		logger.error('Bluesky client: OAuth client not available');
		return;
	}
	await client.signIn('https://bsky.social', {
		scope: 'atproto transition:generic'
	});
}

export async function logout() {
	blueskyStore.reset();
	initPromise = null;
	// Also need to clear session from storage if any
	localStorage.removeItem('bluesky_session');
}
