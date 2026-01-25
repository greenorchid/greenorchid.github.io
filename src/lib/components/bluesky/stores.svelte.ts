import { BskyAgent } from '@bluesky-social/api';
import type { BlueskySession, BlueskyProfile, BlueskyPost, BlueskyError } from './types';
import { logger } from '$lib/logger';

export class BlueskyStore {
	session = $state<BlueskySession | null>(null);
	profile = $state<BlueskyProfile | null>(null);
	timeline = $state<BlueskyPost[]>([]);
	isLoading = $state(false);
	error = $state<BlueskyError | null>(null);
	agent = $state<BskyAgent | null>(null);

	get isAuthenticated() {
		return !!this.session && !!this.agent;
	}

	reset() {
		logger.debug('BlueskyStore: Resetting state');
		this.session = null;
		this.profile = null;
		this.timeline = [];
		this.isLoading = false;
		this.error = null;
		this.agent = null;
	}
}

export const blueskyStore = new BlueskyStore();
