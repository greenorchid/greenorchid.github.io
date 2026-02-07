import { describe, it, expect } from 'vitest';
import { parseMarkdownFile } from '../utils';

describe('Recipes Tags Parsing', () => {
	it('should parse simple array tags', () => {
		const content = `---
title: 'Test'
date: '2026-01-18'
excerpt: 'Test'
tags: ['tag1', 'tag2']
---
# Content`;
		const post = parseMarkdownFile(content, 'test');
		expect(post.tags).toEqual(['tag1', 'tag2']);
	});

	it('should parse multiline Prettier-formatted tags', () => {
		const content = `---
title: 'Test'
date: '2026-01-18'
excerpt: 'Test'
tags:
  [
    'tag1',
    'tag2'
  ]
---
# Content`;
		const post = parseMarkdownFile(content, 'test');
		expect(post.tags).toEqual(['tag1', 'tag2']);
	});
});
