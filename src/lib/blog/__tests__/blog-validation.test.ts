import { describe, it, expect } from 'vitest';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import matter from 'gray-matter';
import { getAllPosts } from '../utils';

const blogSchema = {
	$schema: 'http://json-schema.org/draft-07/schema#',
	type: 'object',
	properties: {
		title: { type: 'string' },
		date: { type: 'string' },
		excerpt: { type: 'string' },
		tags: { type: 'array', items: { type: 'string' } },
		aiContributions: { type: 'string', enum: ['none', 'partial', 'considerable'] }
	},
	required: ['title', 'date', 'excerpt', 'tags', 'aiContributions'],
	additionalProperties: false
};

const ajv = new Ajv();
addFormats(ajv);
const validate = ajv.compile(blogSchema);

// Load all blog MD files
const blogModules = import.meta.glob('../posts/*.md', { as: 'raw', eager: true }) as Record<
	string,
	string
>;

describe('Blog Markdown Validation', () => {
	Object.entries(blogModules).forEach(([filePath, content]) => {
		it(`validates ${filePath}`, () => {
			const { data: frontmatter } = matter(content);
			const valid = validate(frontmatter);
			if (!valid) {
				console.error('Validation errors:', validate.errors);
			}
			expect(valid).toBe(true);
		});
	});
});

describe('Blog Ordering', () => {
	it('orders posts by date descending (newest first)', () => {
		const posts = getAllPosts();
		expect(posts.length).toBeGreaterThan(0);

		// Verify posts are sorted by date descending
		for (let i = 0; i < posts.length - 1; i++) {
			const currentDate = new Date(posts[i].date).getTime();
			const nextDate = new Date(posts[i + 1].date).getTime();
			expect(currentDate).toBeGreaterThanOrEqual(nextDate);
		}
	});
});
