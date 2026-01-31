import { blueskyStore } from './stores.svelte';
import type { BlueskyPost, BlueskyComment } from './types';
import { logger } from '$lib/logger';
import { BskyAgent } from '@bluesky-social/api';
import { CONFIG } from '$lib/config';

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
	logger.debug('Bluesky actions: getTimeline called', {
		isLoading: blueskyStore.isLoading,
		hasTimeline: blueskyStore.timeline.length > 0
	});

	if (blueskyStore.isLoading && blueskyStore.timeline.length === 0) {
		logger.debug('Bluesky actions: getTimeline skipped (already loading)');
		return;
	}

	try {
		logger.debug('Bluesky actions: Fetching timeline for actor:', CONFIG.blueskyHandle);
		blueskyStore.isLoading = true;

		// Always use the public actor feed for the "Community Feed" UI
		const guestAgent = new BskyAgent({ service: 'https://api.bsky.app' });
		const response = await guestAgent.getAuthorFeed({ actor: CONFIG.blueskyHandle });

		logger.debug('Bluesky actions: Feed response received:', {
			count: response.data.feed.length,
			handle: CONFIG.blueskyHandle
		});

		const posts = (response.data as any).feed.map((item: any) => item.post);
		blueskyStore.timeline = posts;
	} catch (error) {
		logger.error('Failed to fetch timeline:', {
			error: error instanceof Error ? error.message : 'Unknown error',
			handle: CONFIG.blueskyHandle
		});
	} finally {
		blueskyStore.isLoading = false;
	}
}

export async function getComments(uri: string) {
	try {
		// Try with authenticated agent first if available
		if (blueskyStore.agent) {
			try {
				const response = await blueskyStore.agent.getPostThread({ uri });
				return response.data.thread;
			} catch (authError) {
				logger.warn('Failed to fetch comments with auth agent, falling back to guest:', authError);
				// Fallthrough to guest agent
			}
		}

		// Fallback to guest agent
		const guestAgent = new BskyAgent({ service: 'https://api.bsky.app' });
		const response = await guestAgent.getPostThread({ uri });
		return response.data.thread;
	} catch (error) {
		logger.error('Failed to fetch comments:', error);
		return [];
	}
}
