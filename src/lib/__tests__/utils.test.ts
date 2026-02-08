import { describe, it, expect } from 'vitest';
import { isActive } from '../utils';

describe('isActive', () => {
	it('returns true for exact match', () => {
		expect(isActive('/blog', '/blog')).toBe(true);
	});

	it('returns true for prefix match', () => {
		expect(isActive('/blog', '/blog/post-1')).toBe(true);
	});

	it('returns false for non-match', () => {
		expect(isActive('/blog', '/about')).toBe(false);
	});

	it('returns true for home', () => {
		expect(isActive('/', '/')).toBe(true);
	});

	it('returns false for home prefix when not home', () => {
		expect(isActive('/', '/blog')).toBe(false);
	});

	it('returns false for partial match not starting with href', () => {
		expect(isActive('/blog', '/myblog')).toBe(false);
	});
});
