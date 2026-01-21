import { test, expect } from '@playwright/test';

test('page loads', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('body')).toBeVisible();
});

test('mobile navigation elements exist', async ({ page, isMobile }) => {
	await page.goto('/');

	// Check header exists
	await expect(page.getByRole('banner')).toBeAttached();

	if (isMobile) {
		// Check hamburger button exists in mobile layout
		const hamburger = page.locator('.flex.md\\:hidden [aria-label="Toggle menu"]').first();
		await expect(hamburger).toBeAttached();
	} else {
		// Desktop: nav should be visible
		const nav = page.locator('.hidden.md\\:flex nav');
		await expect(nav).toBeVisible();
	}
});
