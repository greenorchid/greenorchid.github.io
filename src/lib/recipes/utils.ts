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
	unit?: string; // e.g., "ml", "g", "kg", "cups", "tsp", "tbsp"
	notes?: string; // optional notes like "chopped", "finely diced"
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

// Load all markdown files from the posts directory
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

	// Sort by date (newest first)
	return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): RecipePost | null {
	const path = `/src/lib/recipes/posts/${slug}.md`;
	const content = postsModules[path] as string | undefined;

	if (!content) {
		return null;
	}

	return parseMarkdown(content, slug);
}

function parseMarkdown(content: string, slug: string): RecipePost {
	// Parse frontmatter
	const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
	const frontmatterMatch = content.match(frontmatterRegex);

	if (!frontmatterMatch) {
		throw new Error(`Invalid markdown format for post: ${slug}`);
	}

	const frontmatter = frontmatterMatch[1];
	const markdownContent = frontmatterMatch[2];

	// Parse frontmatter fields
	const titleMatch =
		frontmatter.match(/^title:\s*["'](.+?)["']/m) || frontmatter.match(/^title:\s*(.+)$/m);
	const dateMatch =
		frontmatter.match(/^date:\s*["'](.+?)["']/m) || frontmatter.match(/^date:\s*(.+)$/m);
	const excerptMatch =
		frontmatter.match(/^excerpt:\s*(["'])(.+?)\1/m) || frontmatter.match(/^excerpt:\s*(.+)$/m);
	const tagsMatch =
		frontmatter.match(/^tags:\s*\[(.+?)\]/m) ||
		frontmatter.match(/^tags:\s*["'](.+?)["']/m) ||
		frontmatter.match(/^tags:\s*(.+)$/m);
	const ingredientsMatch = frontmatter.match(/^ingredients:\s*\n((?:\s*-\s*.+\n?)*)/m);
	const servingsMatch = frontmatter.match(/^servings:\s*(\d+(?:\.\d+)?)\s*$/m);

	const title = titleMatch ? (titleMatch[1] || '').trim() : 'Untitled';
	const date = dateMatch ? (dateMatch[1] || '').trim() : new Date().toISOString().split('T')[0];
	const excerpt = excerptMatch ? (excerptMatch[2] || excerptMatch[1] || '').trim() : '';

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
				.map((tag: string) => tag.trim().replace(/^["']|["']$/g, ''))
				.filter((tag: string) => tag.length > 0);
		} else {
			// Comma-separated string format
			tags = tagsValue
				.split(',')
				.map((tag: string) => tag.trim().replace(/^["']|["']$/g, ''))
				.filter((tag: string) => tag.length > 0);
		}
	}

	// Parse ingredients
	const ingredients = ingredientsMatch ? parseIngredients(ingredientsMatch[1]) : [];

	// Parse servings
	const servings = servingsMatch ? parseFloat(servingsMatch[1]) : undefined;

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
		ingredients,
		servings,
		content: markdownContent,
		html
	};
}

export function getAllTags(): string[] {
	const posts = getAllRecipes();
	const tagSet = new Set<string>();
	posts.forEach((post) => {
		post.tags.forEach((tag) => tagSet.add(tag));
	});
	return Array.from(tagSet).sort();
}

export function getPostsByTag(tag: string): RecipePost[] {
	return getAllRecipes().filter((post) => post.tags.includes(tag));
}

// Scale ingredients by a multiplier
export function scaleIngredients(ingredients: Ingredient[], multiplier: number): Ingredient[] {
	return ingredients.map((ingredient) => ({
		...ingredient,
		amount: ingredient.amount * multiplier
	}));
}

// Parse ingredients from markdown frontmatter
function parseIngredients(ingredientsYaml: string): Ingredient[] {
	if (!ingredientsYaml.trim()) return [];

	const ingredients: Ingredient[] = [];
	const lines = ingredientsYaml.trim().split('\n');

	for (const line of lines) {
		// Parse format: "- name: amount unit # notes"
		const ingredientMatch = line.match(
			/^\s*-\s*(.+?):\s*(\d+(?:\.\d+)?)\s*([a-zA-Z%]+)?\s*(?:#\s*(.+?))?\s*$/
		);
		if (ingredientMatch) {
			const [, name, amount, unit, notes] = ingredientMatch;
			ingredients.push({
				name: name.trim(),
				amount: parseFloat(amount),
				unit: unit?.trim(),
				notes: notes?.trim()
			});
		}
	}

	return ingredients;
}

// Format ingredient for display
export function formatIngredient(ingredient: Ingredient): string {
	let formatted = `${ingredient.name}: ${ingredient.amount}`;
	if (ingredient.unit) {
		formatted += ` ${ingredient.unit}`;
	}
	if (ingredient.notes) {
		formatted += ` (${ingredient.notes})`;
	}
	return formatted;
}
