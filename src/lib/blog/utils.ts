import { parseMarkdown, calculateReadingTime } from '$lib/markdown';

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
		const post = parseMarkdownFile(rawContent, slug);
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

	return parseMarkdownFile(content, slug);
}

/**
 * Adapter for the shared parseMarkdown that handles blog-specific normalization.
 */
export function parseMarkdownFile(content: string, slug: string): BlogPost {
	try {
		const { data, content: markdownContent, html } = parseMarkdown<Frontmatter>(content);

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
	const tagMap = new Map<string, string>(); // lowercase -> original case

	posts.forEach((post) => {
		post.tags.forEach((tag) => {
			const lowerTag = tag.toLowerCase();
			if (!tagMap.has(lowerTag)) {
				tagMap.set(lowerTag, tag);
			}
		});
	});

	return Array.from(tagMap.values()).sort((a, b) =>
		a.localeCompare(b, undefined, { sensitivity: 'base' })
	);
}

export function getPostsByTag(tag: string): BlogPost[] {
	const lowerTag = tag.toLowerCase();
	return getAllPosts().filter((post) => post.tags.some((t) => t.toLowerCase() === lowerTag));
}
