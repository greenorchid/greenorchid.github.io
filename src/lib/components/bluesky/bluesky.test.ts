import { describe, it, expect, vi, beforeEach } from 'vitest';
import { blueskyStore } from './stores.svelte';
import { post, like, follow } from './actions';

// Mock SvelteKit dynamic environment
vi.mock('$env/dynamic/public', () => ({
	env: {
		PUBLIC_DOMAIN: 'https://test.com'
	}
}));

// Mock BskyAgent
vi.mock('@bluesky-social/api', () => {
	return {
		BskyAgent: vi.fn().mockImplementation(() => ({
			post: vi.fn().mockResolvedValue({ uri: 'at://post1', cid: 'cid1' }),
			like: vi.fn().mockResolvedValue({ uri: 'at://like1', cid: 'cid2' }),
			follow: vi.fn().mockResolvedValue({ uri: 'at://follow1', cid: 'cid3' }),
			getTimeline: vi.fn().mockResolvedValue({ data: { feed: [] } }),
			getPostThread: vi.fn().mockResolvedValue({ data: { thread: { post: {}, replies: [] } } }),
			getProfile: vi.fn().mockResolvedValue({ data: { did: 'did:123', handle: 'test' } })
		}))
	};
});

describe('Bluesky Store', () => {
	beforeEach(() => {
		blueskyStore.reset();
	});

	it('should initialize with null session', () => {
		expect(blueskyStore.session).toBeNull();
		expect(blueskyStore.isAuthenticated).toBe(false);
	});

	it('should update session and profile', () => {
		const session = { did: 'did:123', handle: 'test', active: true };
		blueskyStore.session = session;
		// @ts-expect-error - mock agent
		blueskyStore.agent = {};
		expect(blueskyStore.session).toEqual(session);
		expect(blueskyStore.isAuthenticated).toBe(true);
	});
});

describe('Bluesky Actions', () => {
	const mockAgent = {
		com: {
			atproto: {
				repo: {
					createRecord: vi.fn()
				}
			}
		},
		getTimeline: vi.fn()
	};

	beforeEach(() => {
		blueskyStore.reset();
		blueskyStore.session = { did: 'did:123', handle: 'test', active: true };
		// @ts-expect-error - injecting mock agent
		blueskyStore.agent = mockAgent;
		vi.clearAllMocks();
	});

	it('should post text', async () => {
		mockAgent.com.atproto.repo.createRecord.mockResolvedValue({ data: { uri: 'at://post1' } });
		const result = await post('Hello world');
		expect((result as any).data.uri).toBe('at://post1');
		expect(mockAgent.com.atproto.repo.createRecord).toHaveBeenCalled();
	});

	it('should like post', async () => {
		mockAgent.com.atproto.repo.createRecord.mockResolvedValue({ data: { uri: 'at://like1' } });
		const result = await like('at://post1', 'cid1');
		expect((result as any).data.uri).toBe('at://like1');
		expect(mockAgent.com.atproto.repo.createRecord).toHaveBeenCalled();
	});
});
