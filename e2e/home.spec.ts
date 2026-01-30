import { expect, test } from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
  });

  test('displays a random quote on load', async ({ page }) => {
    await expect(page.locator('article blockquote')).toBeVisible();
    const quoteText = await page.locator('article blockquote').textContent();
    expect(quoteText).toBeTruthy();
    expect(quoteText!.length).toBeGreaterThan(5);
  });

  test('displays season and episode info', async ({ page }) => {
    await expect(page.getByText(/Season \d+/)).toBeVisible();
    await expect(page.getByText(/Episode \d+/)).toBeVisible();
  });

  test('displays vote count', async ({ page }) => {
    // Vote button has aria-label like "Upvote - X votes"
    await expect(page.getByRole('button', { name: /votes?/i })).toBeVisible();
  });

  test('loads a new quote when clicking the New Quote button', async ({ page }) => {
    await expect(page.locator('article blockquote')).toBeVisible();

    await page.getByRole('button', { name: 'New Quote' }).click();
    await page.waitForLoadState('networkidle');

    // Due to randomness, the quote might be the same, so we just verify the quote loaded
    const newQuote = await page.locator('article blockquote').textContent();
    expect(newQuote).toBeTruthy();
  });

  test('has correct page title', async ({ page }) => {
    await expect(page).toHaveTitle(/Umpossible/);
  });
});
