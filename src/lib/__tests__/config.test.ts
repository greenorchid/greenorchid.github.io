import { describe, it, expect, vi, beforeEach } from 'vitest';

// Create a mock for $env/dynamic/public
vi.mock('$env/dynamic/public', () => ({
	env: {
		PUBLIC_DOMAIN: undefined as string | undefined
	}
}));

import { CONFIG, getDomain } from '../config';
import { env } from '$env/dynamic/public';

describe('config utility', () => {
	beforeEach(() => {
		vi.resetModules();
		(env as Record<string, string | undefined>).PUBLIC_DOMAIN = undefined;
	});

	it('should return default domain when PUBLIC_DOMAIN is not set', () => {
		expect(CONFIG.domain).toBe('https://behan.dev');
	});

	it('should return PUBLIC_DOMAIN when set', () => {
		(env as Record<string, string | undefined>).PUBLIC_DOMAIN = 'https://custom.domain';
		expect(CONFIG.domain).toBe('https://custom.domain');
	});

	it('should remove trailing slash from domain', () => {
		(env as Record<string, string | undefined>).PUBLIC_DOMAIN = 'https://custom.domain/';
		expect(CONFIG.domain).toBe('https://custom.domain');
	});

	it('should provide a deprecated getDomain function', () => {
		(env as Record<string, string | undefined>).PUBLIC_DOMAIN = 'https://test.dev';
		expect(getDomain()).toBe('https://test.dev');
	});

	it('should have a stable siteName and clientName', () => {
		expect(CONFIG.siteName).toBe('behan.dev');
		expect(CONFIG.clientName).toBe('Behan.dev Attic');
	});

	it('should generate a buildId starting with v-', () => {
		expect(CONFIG.buildId).toMatch(/^v-/);
	});
});
