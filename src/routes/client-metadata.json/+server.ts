import { json } from '@sveltejs/kit';
import { CONFIG } from '$lib/config';

export const prerender = true;

export const GET = () => {
	const domain = CONFIG.domain;

	return json({
		client_id: `${domain}/client-metadata.json`,
		client_name: CONFIG.clientName,
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
