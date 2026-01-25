import { json } from '@sveltejs/kit';
import { PUBLIC_DOMAIN } from '$env/static/public';

export const GET = () => {
	const domain = PUBLIC_DOMAIN.endsWith('/') ? PUBLIC_DOMAIN.slice(0, -1) : PUBLIC_DOMAIN;

	return json({
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
	});
};
