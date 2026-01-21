import { describe, it, expect } from 'vitest';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import matter from 'gray-matter';

const recipeSchema = {
	$schema: 'http://json-schema.org/draft-07/schema#',
	type: 'object',
	properties: {
		title: { type: 'string' },
		date: { type: 'string' },
		excerpt: { type: 'string' },
		tags: { type: 'array', items: { type: 'string' } },
		ingredients: {
			oneOf: [
				{
					type: 'object',
					patternProperties: { '.*': { type: 'string' } },
					additionalProperties: false
				},
				{
					type: 'array',
					items: {
						oneOf: [
							{ type: 'string' },
							{ type: 'object', additionalProperties: { type: ['string', 'number'] } }
						]
					}
				}
			]
		}
	},
	required: ['title', 'date', 'excerpt', 'tags', 'ingredients'],
	additionalProperties: true
};

const ajv = new Ajv({ allowUnionTypes: true });
addFormats(ajv);
const validate = ajv.compile(recipeSchema);

// Load all recipe MD files
const recipeModules = import.meta.glob('../posts/*.md', { as: 'raw', eager: true }) as Record<
	string,
	string
>;

describe('Recipe Markdown Validation', () => {
	Object.entries(recipeModules).forEach(([filePath, content]) => {
		it(`validates ${filePath}`, () => {
			const { data: frontmatter } = matter(content);
			const valid = validate(frontmatter);
			if (!valid) {
				console.error('Validation errors:', validate.errors);
			}
			expect(valid).toBe(true);
		});
	});
});
