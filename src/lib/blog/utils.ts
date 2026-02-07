import { marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';
import * as grayMatter from 'gray-matter';

const matter = grayMatter.default || grayMatter;

// Configure marked with syntax highlighting
marked.use(
	markedHighlight({
		langPrefix: 'hljs language-',
		highlight(code, lang) {
			const language = hljs.getLanguage(lang || '') ? lang : 'plaintext';
			return hljs.highlight(code, { language }).value;
		}
	})
);

interface Frontmatter {
	title?: string;
	date?: string | Date;
	excerpt?: string;
	tags?: string | string[];
	aiContributions?: string;
	blueskyUri?: string;
	[key: string]: string | string[] | Date | undefined;
}

export interface BlogPost {
	slug: string;
	title: string;
	date: string;
	excerpt: string;
	tags: string[];
	aiContributions: string;
	content: string;
	html: string;
	readingTime: number;
	blueskyUri?: string;
}

// Load all markdown files from the posts directory
const postsModules = import.meta.glob('/src/lib/blog/posts/*.md', {
	eager: true,
	query: '?raw',
	import: 'default'
});

export function getAllPosts(): BlogPost[] {
	const posts: BlogPost[] = [];

	for (const [path, content] of Object.entries(postsModules)) {
		const slug = path.split('/').pop()?.replace('.md', '') || '';
		const rawContent = content as string;
		const post = parseMarkdown(rawContent, slug);
		posts.push(post);
	}

	// Sort by date (newest first)
	return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): BlogPost | null {
	const path = `/src/lib/blog/posts/${slug}.md`;
	const content = postsModules[path] as string | undefined;

	if (!content) {
		return null;
	}

	return parseMarkdown(content, slug);
}

function calculateReadingTime(text: string): number {
	const wordsPerMinute = 200;
	// Use more robust word count that handles markdown/formatting
	const words = text.trim().split(/\s+/).length;
	return Math.ceil(words / wordsPerMinute);
}

export function parseMarkdown(content: string, slug: string): BlogPost {
	try {
		// Even more robust split: find the first two instances of ---
		const parts = content.split(/^---/m);

		let data: Frontmatter = {};
		let markdownContent = content;

		if (parts.length >= 3) {
			const frontmatter = parts[1].trim();
			markdownContent = parts.slice(2).join('---').trim();

			try {
				data = matter(`---\n${frontmatter}\n---`).data as Frontmatter;
			} catch (e) {
				console.warn(`gray-matter failed for ${slug}, attempting manual parse`, e);
				// Manual parse for critical fields
				const lines = frontmatter.split('\n');
				let inTags = false;
				let tagContent = '';

				lines.forEach((line) => {
					const trimmed = line.trim();
					if (trimmed.startsWith('tags:')) {
						const value = trimmed.slice(5).trim();
						if (value.startsWith('[')) {
							inTags = true;
							tagContent = value;
							if (value.endsWith(']')) inTags = false;
						} else if (!value) {
							// tags: followed by bracket on next line
							inTags = true;
							tagContent = '';
						} else {
							data.tags = value;
						}
					} else if (inTags) {
						tagContent += ' ' + trimmed;
						if (trimmed.endsWith(']')) inTags = false;
					} else {
						const colonIndex = line.indexOf(':');
						if (colonIndex > 0) {
							const key = line.slice(0, colonIndex).trim();
							let value = line.slice(colonIndex + 1).trim();
							if (value.startsWith("'") || value.startsWith('"')) value = value.slice(1, -1);
							data[key] = value;
						}
					}
				});
				if (tagContent) data.tags = tagContent;
			}
		}

		const title = data.title || 'Untitled';
		const dateObj = data.date || new Date().toISOString().split('T')[0];
		const date = typeof dateObj === 'string' ? dateObj : dateObj.toISOString().split('T')[0];
		const excerpt = data.excerpt || '';
		const aiContributions = data.aiContributions || 'none';
		const blueskyUri = data.blueskyUri;

		// Normalize tags - handle YAML list or comma string
		let tags: string[] = [];
		const rawTags = data.tags;
		if (rawTags) {
			if (Array.isArray(rawTags)) {
				tags = rawTags.map((t) => String(t).trim());
			} else if (typeof rawTags === 'string') {
				// Handle both [tag1, tag2] and "tag1, tag2"
				const cleanTags = rawTags.replace(/[[\]"']/g, '');
				tags = cleanTags
					.split(',')
					.map((t) => t.trim())
					.filter((t) => t.length > 0);
			}
		}

		// Convert markdown to HTML
		let html = marked(markdownContent) as string;
		html = html.replace(/<h1[^>]*>.*?<\/h1>/i, '');

		return {
			slug,
			title,
			date,
			excerpt,
			tags,
			aiContributions,
			content: markdownContent,
			html,
			readingTime: calculateReadingTime(markdownContent),
			blueskyUri
		};
	} catch (error) {
		console.error(`Error parsing markdown for post: ${slug}`, error);
		return {
			slug,
			title: `Error: Malformed Post (${slug})`,
			date: new Date().toISOString().split('T')[0],
			excerpt: 'Format error in markdown file.',
			tags: [],
			aiContributions: 'none',
			content: content,
			html: `<p>Error parsing post content for ${slug}. Please check the file format.</p>`,
			readingTime: 0,
			blueskyUri: undefined
		};
	}
}

export function getAllTags(): string[] {
	const posts = getAllPosts();
	const tagSet = new Set<string>();
	posts.forEach((post) => {
		post.tags.forEach((tag) => tagSet.add(tag));
	});
	return Array.from(tagSet).sort();
}

export function getPostsByTag(tag: string): BlogPost[] {
	return getAllPosts().filter((post) => post.tags.includes(tag));
}
