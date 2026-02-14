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

/**
 * Robust browser-safe frontmatter parser.
 * Handles simple key: value pairs and multiline lists.
 */
export function parseFrontmatter(frontmatter: string): Record<string, unknown> {
	const data: Record<string, unknown> = {};
	const lines = frontmatter.split('\n');

	let currentKey: string | null = null;
	let currentList: string[] = [];
	let inList = false;

	lines.forEach((line) => {
		const trimmed = line.trim();
		if (!trimmed) return;

		// Check for key: value or key: start of list
		const colonIndex = line.indexOf(':');

		if (colonIndex > 0 && !trimmed.startsWith('-')) {
			// Save previous list if any
			if (inList && currentKey) {
				data[currentKey] = currentList;
			}

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
					const rest = value.slice(1).trim();
					if (rest) currentList.push(rest.replace(/,$/, '').replace(/^['"]|['"]$/g, ''));
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

	if (inList && currentKey) {
		data[currentKey] = currentList;
	}

	return data;
}

export function calculateReadingTime(text: string): number {
	const wordsPerMinute = 200;
	const words = text.trim().split(/\s+/).length;
	return Math.ceil(words / wordsPerMinute);
}

export function renderMarkdown(content: string): string {
	const html = marked(content) as string;
	return html.replace(/<h1[^>]*>.*?<\/h1>/i, '');
}

export interface MarkdownResult<T> {
	data: T;
	content: string;
	html: string;
}

export function parseMarkdown<T>(content: string): MarkdownResult<T> {
	const parts = content.split(/^---/m);

	if (parts.length >= 3) {
		const frontmatterSection = parts[1].trim();
		const markdownContent = parts.slice(2).join('---').trim();
		return {
			data: parseFrontmatter(frontmatterSection) as T,
			content: markdownContent,
			html: renderMarkdown(markdownContent)
		};
	}

	return {
		data: {} as T,
		content: content,
		html: renderMarkdown(content)
	};
}
