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

export interface BlogPost {
	slug: string;
	title: string;
	date: string;
	excerpt: string;
	tags: string[];
	aiContributions: string;
	content: string;
	html: string;
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

function parseMarkdown(content: string, slug: string): BlogPost {
	// Parse frontmatter - allow \r\n and optional spaces
	const frontmatterRegex = /^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?([\s\S]*)$/;
	const match = content.match(frontmatterRegex);

	if (!match) {
		console.error(
			`Invalid markdown format for post: ${slug}. Content might be missing frontmatter or have invalid separators.`
		);
		// Fallback for malformed posts so we don't crash the whole site
		return {
			slug,
			title: `Error: Malformed Post (${slug})`,
			date: new Date().toISOString().split('T')[0],
			excerpt: 'Format error in markdown file.',
			tags: [],
			aiContributions: 'none',
			content: content,
			html: `<p>Error parsing post content for ${slug}. Please check the file format.</p>`,
			blueskyUri: undefined
		};
	}

	const frontmatter = match[1];
	const markdownContent = match[2];

	// Parse frontmatter fields
	const titleMatch =
		frontmatter.match(/^title:\s*["'](.+?)["']/m) || frontmatter.match(/^title:\s*(.+)$/m);
	const dateMatch =
		frontmatter.match(/^date:\s*["'](.+?)["']/m) || frontmatter.match(/^date:\s*(.+)$/m);
	const excerptMatch =
		frontmatter.match(/^excerpt:\s*["'](.+?)["']/m) || frontmatter.match(/^excerpt:\s*(.+)$/m);
	const tagsMatch =
		frontmatter.match(/^tags:\s*\[(.+?)\]/m) ||
		frontmatter.match(/^tags:\s*["'](.+?)["']/m) ||
		frontmatter.match(/^tags:\s*(.+)$/m);
	const aiContributionsMatch =
		frontmatter.match(/^aiContributions:\s*["'](.+?)["']/m) ||
		frontmatter.match(/^aiContributions:\s*(.+)$/m);
	const blueskyUriMatch =
		frontmatter.match(/^blueskyUri:\s*["'](.+?)["']/m) ||
		frontmatter.match(/^blueskyUri:\s*(.+)$/m);

	const title = titleMatch ? titleMatch[1].trim() : 'Untitled';
	const date = dateMatch ? dateMatch[1].trim() : new Date().toISOString().split('T')[0];
	const excerpt = excerptMatch ? excerptMatch[1].trim() : '';
	const aiContributions = aiContributionsMatch ? aiContributionsMatch[1].trim() : 'none';

	// Parse tags - support array format [tag1, tag2] or comma-separated string "tag1, tag2"
	let tags: string[] = [];
	if (tagsMatch) {
		const tagsValue = tagsMatch[1].trim();
		// Check if it's an array format
		if (tagsValue.startsWith('[') && tagsValue.endsWith(']')) {
			// Array format: [tag1, tag2] or ["tag1", "tag2"]
			const arrayContent = tagsValue.slice(1, -1);
			tags = arrayContent
				.split(',')
				.map((tag) => tag.trim().replace(/^["']|["']$/g, ''))
				.filter((tag) => tag.length > 0);
		} else {
			// Comma-separated string format
			tags = tagsValue
				.split(',')
				.map((tag) => tag.trim().replace(/^["']|["']$/g, ''))
				.filter((tag) => tag.length > 0);
		}
	}

	// Convert markdown to HTML
	let html = marked(markdownContent) as string;

	// Remove the main title (first h1) from HTML since it's already displayed above
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
		blueskyUri: blueskyUriMatch ? blueskyUriMatch[1].trim() : undefined
	};
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
