import { parseMarkdown } from '$lib/markdown';

export interface Ingredient {
	name: string;
	amount: number;
	unit?: string;
	notes?: string;
}

export interface IngredientGroup {
	name: string;
	ingredients: Ingredient[];
}

type IngredientList = string[] | Ingredient[];

type IngredientGroups = Record<string, IngredientList>;

interface Frontmatter {
	title?: string;
	date?: string | Date;
	excerpt?: string;
	tags?: string | string[];
	/**
	 * Ingredients can be provided as:
	 * - a flat list (string[] or Ingredient[])
	 * - grouped lists: an object whose values are lists of ingredients
	 */
	ingredients?: IngredientList | IngredientGroups;
	servings?: number;
	blueskyUri?: string;
	[key: string]: string | string[] | Ingredient[] | IngredientGroups | number | Date | undefined;
}

export interface RecipePost {
	slug: string;
	title: string;
	date: string;
	excerpt: string;
	tags: string[];
	content: string;
	html: string;
	/**
	 * Normalized flat list of ingredients, regardless of how they
	 * are grouped in the frontmatter.
	 */
	ingredients?: Ingredient[];
	/**
	 * Optional grouped view of ingredients, preserving frontmatter sections
	 * like crumb_topping, batter, etc.
	 */
	ingredientGroups?: IngredientGroup[];
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

		// Prefer explicit ingredients field; fall back to grouped keys produced by parseFrontmatter.
		// Note: parseFrontmatter will set ingredients: [] when using grouped keys like crumb_topping/batter,
		// so we also treat an empty array as "no explicit ingredients".
		let ingredientsSource: IngredientsInput | undefined = data.ingredients;
		const groupEntries: { name: string; lines: string[] }[] = [];

		for (const [key, value] of Object.entries(data)) {
			if (
				['title', 'date', 'excerpt', 'tags', 'servings', 'blueskyUri', 'ingredients'].includes(key)
			) {
				continue;
			}
			if (Array.isArray(value) && value.every((v) => typeof v === 'string')) {
				groupEntries.push({ name: key, lines: value as string[] });
			}
		}

		if (
			!ingredientsSource ||
			(Array.isArray(ingredientsSource) && ingredientsSource.length === 0)
		) {
			if (groupEntries.length > 0) {
				ingredientsSource = groupEntries.flatMap((g) => g.lines);
			}
		}

		const ingredients = ingredientsSource ? parseIngredients(ingredientsSource) : [];
		const ingredientGroups: IngredientGroup[] | undefined =
			groupEntries.length > 0
				? groupEntries.map((g) => ({
						name: g.name.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
						ingredients: parseIngredients(g.lines)
					}))
				: undefined;
		const servings = data.servings ? Number(data.servings) : undefined;
		const blueskyUri = data.blueskyUri;

		return {
			slug,
			title,
			date,
			excerpt,
			tags,
			ingredients,
			ingredientGroups,
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

type IngredientsInput = IngredientList | IngredientGroups;

export function parseIngredients(ingredientsData: IngredientsInput): Ingredient[] {
	// Flat list of ingredients (existing behaviour)
	if (Array.isArray(ingredientsData)) {
		return ingredientsData.map((item) => {
			if (typeof item === 'string') {
				const match = item.match(/(.+?):\s*(\d+(?:\.\d+)?)\s*([a-zA-Z%]+)?\s*(?:#\s*(.+?))?\s*$/);
				if (match) {
					return {
						name: match[1].trim(),
						amount: parseFloat(match[2]),
						unit: match[3],
						notes: match[4]
					};
				}
				return { name: item, amount: 0 };
			}
			return item as Ingredient;
		});
	}

	// Grouped ingredients: flatten each group's list and reuse the flat parser
	if (ingredientsData && typeof ingredientsData === 'object') {
		const allItems: (string | Ingredient)[] = [];
		for (const value of Object.values(ingredientsData)) {
			if (Array.isArray(value)) {
				allItems.push(...value);
			}
		}
		return parseIngredients(allItems as IngredientList);
	}

	return [];
}

export function getAllTags(): string[] {
	const posts = getAllRecipes();
	const tagMap = new Map<string, string>(); // lowercase -> original case

	posts.forEach((p) => {
		p.tags.forEach((t) => {
			const lowerTag = t.toLowerCase();
			if (!tagMap.has(lowerTag)) {
				tagMap.set(lowerTag, t);
			}
		});
	});

	return Array.from(tagMap.values()).sort((a, b) =>
		a.localeCompare(b, undefined, { sensitivity: 'base' })
	);
}

export function getPostsByTag(tag: string): RecipePost[] {
	const lowerTag = tag.toLowerCase();
	return getAllRecipes().filter((p) => p.tags.some((t) => t.toLowerCase() === lowerTag));
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
