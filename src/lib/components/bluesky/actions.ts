import { blueskyStore } from './stores.svelte';
import type { BlueskyPost, BlueskyComment } from './types';
import { logger } from '$lib/logger';
import { dev } from '$app/environment';

export async function post(text: string) {
	if (!blueskyStore.agent || !blueskyStore.session) {
		throw new Error('Not authenticated with Bluesky');
	}

	try {
		blueskyStore.isLoading = true;

		// Use the low-level call because agent.post() requires an internal session state
		// our agent is authenticated via the fetchHandler wrapper instead.
		const result = await blueskyStore.agent.com.atproto.repo.createRecord({
			repo: blueskyStore.session.did,
			collection: 'app.bsky.feed.post',
			record: {
				$type: 'app.bsky.feed.post',
				text,
				createdAt: new Date().toISOString()
			}
		});

		return result;
	} catch (error) {
		blueskyStore.error = {
			error: 'Post failed',
			message: error instanceof Error ? error.message : 'Unknown error'
		};
		throw error;
	} finally {
		blueskyStore.isLoading = false;
	}
}

export async function like(uri: string, cid: string) {
	if (!blueskyStore.agent || !blueskyStore.session) {
		throw new Error('Not authenticated with Bluesky');
	}

	try {
		blueskyStore.isLoading = true;
		const result = await blueskyStore.agent.com.atproto.repo.createRecord({
			repo: blueskyStore.session.did,
			collection: 'app.bsky.feed.like',
			record: {
				$type: 'app.bsky.feed.like',
				subject: { uri, cid },
				createdAt: new Date().toISOString()
			}
		});
		return result;
	} catch (error) {
		blueskyStore.error = {
			error: 'Like failed',
			message: error instanceof Error ? error.message : 'Unknown error'
		};
		throw error;
	} finally {
		blueskyStore.isLoading = false;
	}
}

export async function follow(subjectDid: string) {
	if (!blueskyStore.agent || !blueskyStore.session) {
		throw new Error('Not authenticated with Bluesky');
	}

	try {
		blueskyStore.isLoading = true;
		const result = await blueskyStore.agent.com.atproto.repo.createRecord({
			repo: blueskyStore.session.did,
			collection: 'app.bsky.graph.follow',
			record: {
				$type: 'app.bsky.graph.follow',
				subject: subjectDid,
				createdAt: new Date().toISOString()
			}
		});
		return result;
	} catch (error) {
		blueskyStore.error = {
			error: 'Follow failed',
			message: error instanceof Error ? error.message : 'Unknown error'
		};
		throw error;
	} finally {
		blueskyStore.isLoading = false;
	}
}

export async function getTimeline() {
	if (!blueskyStore.agent || !blueskyStore.isAuthenticated) return;
	if (blueskyStore.isLoading && blueskyStore.timeline.length === 0) return;

	try {
		blueskyStore.isLoading = true;
		const response = await blueskyStore.agent.getTimeline();
		// Transform to our BlueskyPost type if needed, but for now we'll take what we get
		// The API returns feed items which contain posts
		blueskyStore.timeline = (response.data as any).feed.map((item: any) => item.post);
	} catch (error) {
		logger.error('Failed to fetch timeline:', error);
	} finally {
		blueskyStore.isLoading = false;
	}
}

export async function getComments(uri: string) {
	if (!blueskyStore.agent) return [];

	try {
		const response = await blueskyStore.agent.getPostThread({ uri });
		return response.data.thread;
	} catch (error) {
		logger.error('Failed to fetch comments:', error);
		return [];
	}
}
