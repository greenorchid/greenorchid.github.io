import { describe, it, expect } from 'vitest';
import { getAllTags as getAllBlogTags, getPostsByTag as getBlogPostsByTag } from '../blog/utils';
import {
	getAllTags as getAllRecipeTags,
	getPostsByTag as getRecipePostsByTag
} from '../recipes/utils';

describe('Tag Case-Insensitivity Integration', () => {
	// We use the real utilities here because mocking import.meta.glob is complex.
	// We rely on the fact that existing recipes have 'dessert' and 'Dessert'.

	describe('Blog Utilities', () => {
		it('should have unique tags regardless of case', () => {
			const tags = getAllBlogTags();
			const lowerTags = tags.map((t) => t.toLowerCase());
			const uniqueLowerTags = new Set(lowerTags);
			expect(lowerTags.length).toBe(uniqueLowerTags.size);
		});

		it('should find posts case-insensitively', () => {
			const tags = getAllBlogTags();
			if (tags.length > 0) {
				const tag = tags[0];
				const resultsLower = getBlogPostsByTag(tag.toLowerCase());
				const resultsUpper = getBlogPostsByTag(tag.toUpperCase());
				expect(resultsLower.length).toBeGreaterThan(0);
				expect(resultsLower).toEqual(resultsUpper);
			}
		});
	});

	describe('Recipe Utilities', () => {
		it('should have unique tags regardless of case', () => {
			const tags = getAllRecipeTags();
			const lowerTags = tags.map((t) => t.toLowerCase());
			const uniqueLowerTags = new Set(lowerTags);

			// We know 'dessert' and 'Dessert' exist in the real posts.
			// This test will fail if my fix didn't work.
			expect(lowerTags.length).toBe(uniqueLowerTags.size);
		});

		it('should find recipes case-insensitively', () => {
			// 'Dessert' and 'dessert' both exist in the real data.
			const resultsLower = getRecipePostsByTag('dessert');
			const resultsUpper = getRecipePostsByTag('Dessert');

			// pancakes.md has 'dessert', frangipane.md has 'Dessert'
			// If merged correctly and filtered-insensitively, both should be found.
			expect(resultsLower.length).toBeGreaterThanOrEqual(2);
			expect(resultsLower).toEqual(resultsUpper);
		});
	});
});
