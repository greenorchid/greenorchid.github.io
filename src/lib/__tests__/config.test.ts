import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { CONFIG, getDomain } from '../config';

describe('config utility', () => {
	beforeEach(() => {
		vi.unstubAllEnvs();
	});

	afterEach(() => {
		vi.unstubAllEnvs();
	});

	it('should return default domain when PUBLIC_DOMAIN is not set', () => {
		expect(CONFIG.domain).toBe('https://behan.dev');
	});

	it('should return PUBLIC_DOMAIN when set', () => {
		vi.stubEnv('PUBLIC_DOMAIN', 'https://custom.domain');
		expect(CONFIG.domain).toBe('https://custom.domain');
	});

	it('should remove trailing slash from domain', () => {
		vi.stubEnv('PUBLIC_DOMAIN', 'https://custom.domain/');
		expect(CONFIG.domain).toBe('https://custom.domain');
	});

	it('should provide a deprecated getDomain function', () => {
		vi.stubEnv('PUBLIC_DOMAIN', 'https://test.dev');
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
