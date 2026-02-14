import { describe, it, expect } from 'vitest';
import { parseMarkdown, calculateReadingTime, renderMarkdown, parseFrontmatter } from '../markdown';

describe('markdown utility', () => {
	describe('parseFrontmatter', () => {
		it('should parse simple key-value pairs', () => {
			const frontmatter = `title: "Test Post"\ndate: 2026-02-08\nexcerpt: Sample excerpt`;
			const result = parseFrontmatter(frontmatter);
			expect(result).toEqual({
				title: 'Test Post',
				date: '2026-02-08',
				excerpt: 'Sample excerpt'
			});
		});

		it('should handle quoted strings with colons', () => {
			const frontmatter = `title: "Test: Subtitle"\nnotes: 'Some: notes'`;
			const result = parseFrontmatter(frontmatter);
			expect(result).toEqual({
				title: 'Test: Subtitle',
				notes: 'Some: notes'
			});
		});

		it('should parse bracketed lists [tag1, tag2]', () => {
			const frontmatter = `tags: [tag1, tag2, "tag 3"]`;
			const result = parseFrontmatter(frontmatter);
			expect(result.tags).toEqual(['tag1', 'tag2', 'tag 3']);
		});

		it('should parse multiline Prettier-style bracketed lists', () => {
			const frontmatter = `tags:\n  [\n    'tag1',\n    'tag2',\n    "tag3"\n  ]`;
			const result = parseFrontmatter(frontmatter);
			expect(result.tags).toEqual(['tag1', 'tag2', 'tag3']);
		});

		it('should parse bulleted lists', () => {
			const frontmatter = `categories:\n  - Category 1\n  - Category 2`;
			const result = parseFrontmatter(frontmatter);
			expect(result.categories).toEqual(['Category 1', 'Category 2']);
		});

		it('should parse bulleted lists where items contain colons', () => {
			const frontmatter = `ingredients:\n  - Eggs: 2\n  - Milk: 250 ml`;
			const result = parseFrontmatter(frontmatter);
			expect(result.ingredients).toEqual(['Eggs: 2', 'Milk: 250 ml']);
		});

		it('should handle empty or malformed input gracefully', () => {
			expect(parseFrontmatter('')).toEqual({});
			// @ts-expect-error testing invalid input
			expect(() => parseFrontmatter(null)).toThrow();
		});

		it('should handle standalone brackets correctly', () => {
			// Test the fix for the '[' bug
			const frontmatter = `tags:\n  [\n    'tag1'\n  ]`;
			const result = parseFrontmatter(frontmatter);
			expect(result.tags).toEqual(['tag1']);
		});
	});

	describe('calculateReadingTime', () => {
		it('should return 1 for short text', () => {
			expect(calculateReadingTime('Hello world')).toBe(1);
		});

		it('should calculate time correctly for long text', () => {
			const longText = 'word '.repeat(500); // 500 words
			expect(calculateReadingTime(longText)).toBe(3); // 500 / 200 = 2.5 -> 3
		});
	});

	describe('renderMarkdown', () => {
		it('should render basic markdown to HTML', () => {
			const content = '## Hello\nWorld';
			const html = renderMarkdown(content);
			expect(html).toContain('<h2>Hello</h2>');
			expect(html).toContain('<p>World</p>');
		});

		it('should strip H1 tags', () => {
			const content = '# Main Title\n## Subtitle';
			const html = renderMarkdown(content);
			expect(html).not.toContain('<h1>Main Title</h1>');
			expect(html).toContain('<h2>Subtitle</h2>');
		});

		it('should apply syntax highlighting', () => {
			const content = '```typescript\nconst x = 1;\n```';
			const html = renderMarkdown(content);
			expect(html).toContain('hljs language-typescript');
		});
	});

	describe('parseMarkdown', () => {
		it('should split frontmatter and content', () => {
			const content = `---\ntitle: Test\n---\n# Content\nBody`;
			const result = parseMarkdown<{ title: string }>(content);
			expect(result.data.title).toBe('Test');
			expect(result.content).toBe('# Content\nBody');
			expect(result.html).toContain('<p>Body</p>');
		});

		it('should handle content without frontmatter', () => {
			const content = 'Only content';
			const result = parseMarkdown(content);
			expect(result.data).toEqual({});
			expect(result.content).toBe('Only content');
			expect(result.html).toContain('<p>Only content</p>');
		});
	});
});
