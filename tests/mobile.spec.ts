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

test('tooltips work on desktop', async ({ page, isMobile }) => {
	test.skip(isMobile, 'Tooltips are tested on desktop only due to positioning');

	await page.goto('/');

	// Test theme toggle tooltip
	const themeButton = page.getByRole('button', { name: 'Toggle Theme' });
	await expect(themeButton).toBeVisible();

	// Hover to show tooltip
	await themeButton.hover();
	await page.waitForTimeout(500); // Wait for tooltip to appear
	const themeTooltip = page.locator('[role="tooltip"]').filter({ hasText: /theme enabled/ });
	await expect(themeTooltip).toBeVisible();

	// Move mouse away to hide
	await page.locator('body').hover();
	await expect(themeTooltip).not.toBeVisible();

	// Test FontSizePopover tooltip and click-outside
	const fontSizeButton = page.getByRole('button', { name: /Font size/ });
	await expect(fontSizeButton).toBeVisible();

	await fontSizeButton.hover();
	await page.waitForTimeout(500);
	const fontTooltip = page.locator('[role="tooltip"]').filter({ hasText: /Font Size/ });
	await expect(fontTooltip).toBeVisible();

	// Click the button to open popover
	await fontSizeButton.click();
	const popover = page.locator('[role="dialog"]').filter({ hasText: 'Font Size' });
	await expect(popover).toBeVisible();

	// Click outside to close
	await page.locator('body').click({ position: { x: 10, y: 10 } });
	await expect(popover).not.toBeVisible();
});
