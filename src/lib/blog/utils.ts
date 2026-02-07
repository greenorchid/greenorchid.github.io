import { marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';

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

/**
 * Robust browser-safe frontmatter parser.
 * Handles simple key: value pairs and basic lists.
 */
function parseFrontmatter(frontmatter: string): Frontmatter {
	const data: Frontmatter = {};
	const lines = frontmatter.split('\n');

	let currentKey: string | null = null;
	let currentList: string[] = [];
	let inList = false;

	lines.forEach((line) => {
		const trimmed = line.trim();
		if (!trimmed) return;

		// Check for key: value or key: start of list
		const colonIndex = line.indexOf(':');

		if (colonIndex > 0 && !line.startsWith('-')) {
			const key = line.slice(0, colonIndex).trim();
			let value = line.slice(colonIndex + 1).trim();

			// Handle bracketed lists [tag1, tag2]
			if (value.startsWith('[') && value.endsWith(']')) {
				data[key] = value
					.slice(1, -1)
					.split(',')
					.map((s) => s.trim().replace(/^['"]|['"]$/g, ''));
				inList = false;
				currentKey = null;
			} else if (value.startsWith('[') || !value) {
				// Start of a multiline list
				inList = true;
				currentKey = key;
				currentList = [];
				if (value.startsWith('[')) {
					const listContent = value.slice(1);
					if (listContent) currentList.push(listContent);
				}
			} else {
				// Simple value
				if (value.startsWith("'") || value.startsWith('"')) value = value.slice(1, -1);
				data[key] = value;
				inList = false;
				currentKey = null;
			}
		} else if (inList && currentKey) {
			switch (true) {
				case trimmed.startsWith('-'):
					currentList.push(
						trimmed
							.slice(1)
							.trim()
							.replace(/^['"]|['"]$/g, '')
					);
					break;
				case trimmed === '[' || trimmed === '],':
					// Skip
					break;
				case trimmed === ']' || (trimmed.startsWith(']') && trimmed.length === 1):
					data[currentKey] = currentList.filter((item) => item !== '[' && item !== ']');
					inList = false;
					currentKey = null;
					break;
				default: {
					const cleaned = trimmed
						.replace(/,$/, '')
						.replace(/^['"]|['"]$/g, '')
						.trim();
					if (cleaned && cleaned !== '[' && cleaned !== ']') {
						currentList.push(cleaned);
					}
					if (trimmed.endsWith(']')) {
						data[currentKey] = currentList;
						inList = false;
						currentKey = null;
					}
					break;
				}
			}
		}
	});

	// Cleanup any remaining list
	if (inList && currentKey && currentList) {
		data[currentKey] = currentList;
	}

	return data;
}

export function parseMarkdown(content: string, slug: string): BlogPost {
	try {
		const parts = content.split(/^---/m);

		let data: Frontmatter = {};
		let markdownContent = content;

		if (parts.length >= 3) {
			const frontmatterSection = parts[1].trim();
			markdownContent = parts.slice(2).join('---').trim();
			data = parseFrontmatter(frontmatterSection);
		}

		const title = data.title || 'Untitled';
		const dateObj = data.date || new Date().toISOString().split('T')[0];
		const date = typeof dateObj === 'string' ? dateObj : dateObj.toISOString().split('T')[0];
		const excerpt = data.excerpt || '';
		const aiContributions = data.aiContributions || 'none';
		const blueskyUri = data.blueskyUri;

		// Normalize tags
		let tags: string[] = [];
		const rawTags = data.tags;
		if (rawTags) {
			if (Array.isArray(rawTags)) {
				tags = rawTags.map((t) => String(t).trim());
			} else if (typeof rawTags === 'string') {
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
