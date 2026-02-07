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

export interface Ingredient {
	name: string;
	amount: number;
	unit?: string;
	notes?: string;
}

interface Frontmatter {
	title?: string;
	date?: string | Date;
	excerpt?: string;
	tags?: string | string[];
	ingredients?: string[] | Ingredient[];
	servings?: number;
	blueskyUri?: string;
	[key: string]: string | string[] | Ingredient[] | number | Date | undefined;
}

export interface RecipePost {
	slug: string;
	title: string;
	date: string;
	excerpt: string;
	tags: string[];
	content: string;
	html: string;
	ingredients?: Ingredient[];
	servings?: number;
	blueskyUri?: string;
}

const postsModules = import.meta.glob('/src/lib/recipes/posts/*.md', {
	eager: true,
	query: '?raw',
	import: 'default'
});

export function getAllRecipes(): RecipePost[] {
	const posts: RecipePost[] = [];
	for (const [path, content] of Object.entries(postsModules)) {
		const slug = path.split('/').pop()?.replace('.md', '') || '';
		const rawContent = content as string;
		const post = parseMarkdown(rawContent, slug);
		posts.push(post);
	}
	return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): RecipePost | null {
	const path = `/src/lib/recipes/posts/${slug}.md`;
	const content = postsModules[path] as string | undefined;
	if (!content) return null;
	return parseMarkdown(content, slug);
}

/**
 * Robust browser-safe frontmatter parser.
 * Handles simple key: value pairs and multiline lists.
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
			// If we were in a list, save it
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

export function parseMarkdown(content: string, slug: string): RecipePost {
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

		const ingredients = data.ingredients ? parseIngredients(data.ingredients) : [];
		const servings = data.servings ? Number(data.servings) : undefined;
		const blueskyUri = data.blueskyUri;

		let html = marked(markdownContent) as string;
		html = html.replace(/<h1[^>]*>.*?<\/h1>/i, '');

		return {
			slug,
			title,
			date,
			excerpt,
			tags,
			ingredients,
			servings,
			blueskyUri,
			content: markdownContent,
			html
		};
	} catch (error) {
		console.error(`Error parsing recipe: ${slug}`, error);
		throw error;
	}
}

function parseIngredients(ingredientsData: string[] | Ingredient[]): Ingredient[] {
	if (Array.isArray(ingredientsData)) {
		return ingredientsData.map((item) => {
			if (typeof item === 'string') {
				const match = item.match(/(.+?):\s*(\d+(?:\.\d+)?)\s*([a-zA-Z%]+)?\s*(?:#\s*(.+?))?\s*$/);
				if (match)
					return {
						name: match[1].trim(),
						amount: parseFloat(match[2]),
						unit: match[3],
						notes: match[4]
					};
				return { name: item, amount: 0 };
			}
			return item as Ingredient;
		});
	}
	return [];
}

export function getAllTags(): string[] {
	const posts = getAllRecipes();
	const tagSet = new Set<string>();
	posts.forEach((p) => p.tags.forEach((t) => tagSet.add(t)));
	return Array.from(tagSet).sort();
}

export function getPostsByTag(tag: string): RecipePost[] {
	return getAllRecipes().filter((p) => p.tags.includes(tag));
}

export function scaleIngredients(ingredients: Ingredient[], multiplier: number): Ingredient[] {
	return ingredients.map((i) => ({ ...i, amount: i.amount * multiplier }));
}

export function formatIngredient(ingredient: Ingredient): string {
	let formatted = `${ingredient.name}: ${ingredient.amount}`;
	if (ingredient.unit) formatted += ` ${ingredient.unit}`;
	if (ingredient.notes) formatted += ` (${ingredient.notes})`;
	return formatted;
}
