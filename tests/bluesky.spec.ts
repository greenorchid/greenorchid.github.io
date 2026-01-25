import { test, expect } from '@playwright/test';

test.describe('Bluesky Integration', () => {
	test('should show Bluesky Connect section on home page', async ({ page }) => {
		await page.goto('/');
		await expect(page.getByRole('heading', { name: 'Connect to Bluesky' })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Sign in with Bluesky' })).toBeVisible();
	});

	test('should show Bluesky timeline heading', async ({ page }) => {
		await page.goto('/');
		await expect(page.getByText('Bluesky Timeline')).toBeVisible();
	});

	test('should show Share on Bluesky button on blog post', async ({ page }) => {
		// Navigate to a blog post. We'll pick one that likely exists or use a slug if known.
		// Since this is a digital attic, let's assume there's at least one post.
		await page.goto('/blog');
		const firstPost = page.locator('article h2 a').first();
		if ((await firstPost.count()) > 0) {
			await firstPost.click();
			await expect(page.getByRole('button', { name: 'Share on Bluesky' })).toBeVisible();
		}
	});

	test('oauth callback page should show loading state', async ({ page }) => {
		await page.goto('/bluesky-callback');
		await expect(page.getByText('Authenticating with Bluesky...')).toBeVisible();
	});
});
