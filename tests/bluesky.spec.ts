import { test, expect } from '@playwright/test';

test.describe('Bluesky Integration', () => {
	test('should show Sign in with Bluesky button on home page', async ({ page }) => {
		await page.goto('/');
		await expect(page.getByRole('button', { name: 'Sign in with Bluesky' })).toBeVisible();
	});

	test('should show Bluesky Community Feed heading', async ({ page }) => {
		await page.goto('/');
		await expect(
			page.getByRole('heading', { name: 'Bluesky Community Feed' }).first()
		).toBeVisible();
	});

	test('should show Share on Bluesky button on blog post', async ({ page }) => {
		await page.goto('/blog/ai-model-ingestion');
		await expect(page.getByRole('link', { name: 'Share on Bluesky' })).toBeVisible();
	});

	test('should show Share on Bluesky button on recipe', async ({ page }) => {
		await page.goto('/recipes/naan');
		await expect(page.getByRole('link', { name: 'Share on Bluesky' })).toBeVisible();
	});
});
