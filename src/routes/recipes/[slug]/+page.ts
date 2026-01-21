import { getPostBySlug } from '$lib/recipes/utils';
import { error } from '@sveltejs/kit';

export function load({ params }: { params: { slug: string } }) {
	const post = getPostBySlug(params.slug);

	if (!post) {
		throw error(404, `Post with slug "${params.slug}" not found`);
	}

	return {
		post
	};
}
