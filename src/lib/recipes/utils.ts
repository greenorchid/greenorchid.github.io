import { parseMarkdown } from '$lib/markdown';

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
		const post = parseMarkdownFile(rawContent, slug);
		posts.push(post);
	}
	return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): RecipePost | null {
	const path = `/src/lib/recipes/posts/${slug}.md`;
	const content = postsModules[path] as string | undefined;
	if (!content) return null;
	return parseMarkdownFile(content, slug);
}

export function parseMarkdownFile(content: string, slug: string): RecipePost {
	try {
		const { data, content: markdownContent, html } = parseMarkdown<Frontmatter>(content);

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
