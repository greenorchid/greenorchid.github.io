import { describe, it, expect } from 'vitest';
import { getAllLinks, getAllLinkTags, getLinksByTag } from '../links';

// Mock the links since they are loaded dynamically
// For testing, we can mock or use the actual data
// Assuming links are loaded, test the functions

describe('Links Functions', () => {
	it('getAllLinks returns sorted links by date', () => {
		const links = getAllLinks();
		expect(links.length).toBeGreaterThan(0);
		// Check sorting: newer dates first
		for (let i = 0; i < links.length - 1; i++) {
			if (links[i].addedDate && links[i + 1].addedDate) {
				expect(new Date(links[i].addedDate!).getTime()).toBeGreaterThanOrEqual(
					new Date(links[i + 1].addedDate!).getTime()
				);
			}
		}
	});

	it('getAllLinkTags returns unique sorted tags', () => {
		const tags = getAllLinkTags();
		expect(tags.length).toBeGreaterThan(0);
		// Check sorted
		const sorted = [...tags].sort();
		expect(tags).toEqual(sorted);
		// Check unique
		expect(new Set(tags).size).toBe(tags.length);
	});

	it('getLinksByTag filters correctly', () => {
		const allTags = getAllLinkTags();
		if (allTags.length > 0) {
			const tag = allTags[0];
			const filtered = getLinksByTag(tag);
			expect(filtered.length).toBeGreaterThan(0);
			filtered.forEach((link) => {
				expect(link.tags).toContain(tag);
			});
		}
	});

	it('getLinksByTag returns empty for non-existent tag', () => {
		const filtered = getLinksByTag('non-existent-tag');
		expect(filtered).toEqual([]);
	});
});
