import { describe, it, expect } from 'vitest';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const linkSchema = {
	$schema: 'http://json-schema.org/draft-07/schema#',
	oneOf: [
		{
			type: 'object',
			properties: {
				id: {
					type: 'string',
					description: 'Unique identifier for the link'
				},
				url: {
					type: 'string',
					format: 'uri',
					description: 'The URL of the link'
				},
				title: {
					type: 'string',
					description: 'The title of the link'
				},
				description: {
					type: 'string',
					description: 'A brief description of the link'
				},
				tags: {
					type: 'array',
					items: {
						type: 'string'
					},
					description: 'Array of tags associated with the link'
				},
				addedDate: {
					type: 'string',
					description: 'The date the link was added (optional)'
				}
			},
			required: ['id', 'url', 'title', 'description', 'tags'],
			additionalProperties: false
		},
		{
			type: 'array',
			items: {
				type: 'object',
				properties: {
					id: {
						type: 'string',
						description: 'Unique identifier for the link'
					},
					url: {
						type: 'string',
						format: 'uri',
						description: 'The URL of the link'
					},
					title: {
						type: 'string',
						description: 'The title of the link'
					},
					description: {
						type: 'string',
						description: 'A brief description of the link'
					},
					tags: {
						type: 'array',
						items: {
							type: 'string'
						},
						description: 'Array of tags associated with the link'
					},
					addedDate: {
						type: 'string',
						description: 'The date the link was added (optional)'
					}
				},
				required: ['id', 'url', 'title', 'description', 'tags'],
				additionalProperties: false
			}
		}
	]
};

const ajv = new Ajv();
addFormats(ajv);
const validate = ajv.compile(linkSchema);

// Load all link JSON files (exclude schema)
const linkModules = import.meta.glob('../*.json', { eager: true }) as Record<
	string,
	{ default: unknown }
>;

describe('Link JSON Validation', () => {
	Object.entries(linkModules)
		.filter(([filePath]) => !filePath.includes('link-schema'))
		.forEach(([filePath, linkData]) => {
			it(`validates ${filePath}`, () => {
				const valid = validate(linkData.default);
				if (!valid) {
					console.error('Validation errors:', validate.errors);
				}
				expect(valid).toBe(true);
			});
		});
});
