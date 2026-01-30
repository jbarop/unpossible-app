import { expect, test } from '@playwright/test';

test.describe('Navigation', () => {
  test('can navigate to home page', async ({ page }) => {
    await page.goto('/quotes');
    await page.waitForLoadState('networkidle');
    // The Umpossible link in header navigates home
    await page.getByRole('link', { name: 'Umpossible' }).click();
    await expect(page).toHaveURL('/');
  });

  test('can navigate to quotes list', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.getByRole('link', { name: 'All Quotes' }).click();
    await expect(page).toHaveURL('/quotes');
  });

  test('can navigate to privacy page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    // Privacy link is in the footer
    await page.getByRole('link', { name: /privacy|datenschutz/i }).click();
    await expect(page).toHaveURL('/privacy');
  });

  test('displays 404 for unknown routes', async ({ page }) => {
    await page.goto('/nonexistent-page-xyz123');
    await page.waitForLoadState('networkidle');
    await expect(page.getByText(/not found|404/i)).toBeVisible();
  });

  test('has skip link for accessibility', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Tab to activate skip link
    await page.keyboard.press('Tab');

    const skipLink = page.getByRole('link', { name: 'Skip to main content' });
    await expect(skipLink).toBeVisible();
  });
});

test.describe('Share Functionality', () => {
  test('share button copies link to clipboard', async ({ page, context }) => {
    // Grant clipboard permissions
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Wait for quote to load
    await expect(page.locator('article blockquote')).toBeVisible();

    // Click share button - aria-label is "Copy link to quote"
    const shareButton = page.getByRole('button', { name: 'Copy link to quote' });
    await shareButton.click();

    // After clicking, the button should show "Copied!" text
    await expect(page.getByText('Copied!')).toBeVisible();
  });
});

test.describe('Direct Quote Links', () => {
  test('can access a quote by direct link', async ({ page }) => {
    // First, get a quote ID from the list
    await page.goto('/quotes');
    await page.waitForLoadState('networkidle');

    // Find a link to a specific quote
    const quotes = page.locator('article');
    await expect(quotes.first()).toBeVisible();

    const quoteLink = page.locator('article a').first();
    const href = await quoteLink.getAttribute('href');

    // Navigate directly to that URL
    if (href) {
      await page.goto(href);
      await page.waitForLoadState('networkidle');
      await expect(page.locator('article blockquote')).toBeVisible();
    }
  });
});
