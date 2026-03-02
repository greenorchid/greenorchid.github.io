import { describe, it, expect } from 'vitest';
import { parseIngredients, type Ingredient } from '../utils';

describe('Ingredients grouping', () => {
	it('flattens grouped ingredient lists into a single list', () => {
		const grouped = {
			crumb_topping: ['Odlums Gluten Free Self-Raising Flour: 60 g', 'Dark brown sugar: 65 g'],
			batter: ['Buttermilk: 250 g']
		};

		const result = parseIngredients(grouped);

		const expected: Ingredient[] = [
			{ name: 'Odlums Gluten Free Self-Raising Flour', amount: 60, unit: 'g' },
			{ name: 'Dark brown sugar', amount: 65, unit: 'g' },
			{ name: 'Buttermilk', amount: 250, unit: 'g' }
		];

		expect(result).toEqual(expected);
	});

	it('preserves existing flat list behaviour', () => {
		const flat = ['Sugar: 50 g', 'Flour: 100 g'];

		const result = parseIngredients(flat);

		expect(result).toEqual([
			{ name: 'Sugar', amount: 50, unit: 'g' },
			{ name: 'Flour', amount: 100, unit: 'g' }
		]);
	});
});
