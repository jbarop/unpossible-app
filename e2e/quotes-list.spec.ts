import { expect, test } from '@playwright/test';

test.describe('Quote List Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/quotes');
    await page.waitForLoadState('networkidle');
  });

  test('displays list of quotes', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: /All Ralph Wiggum Quotes/i }),
    ).toBeVisible();

    // Wait for quotes to load
    const quotes = page.locator('article');
    await expect(quotes.first()).toBeVisible();
    const count = await quotes.count();
    expect(count).toBeGreaterThan(0);
  });

  test('can filter by season', async ({ page }) => {
    // Select season 3
    await page.selectOption('#season-filter', '3');

    // URL should update
    await expect(page).toHaveURL(/season=3/);

    // Wait for results to load
    await page.waitForLoadState('networkidle');
  });

  test('can filter by episode', async ({ page }) => {
    // Select episode 5
    await page.selectOption('#episode-filter', '5');

    // URL should update
    await expect(page).toHaveURL(/episode=5/);
  });

  test('can sort by votes descending', async ({ page }) => {
    // Select sort by most votes
    await page.selectOption('#sort-filter', 'votes_desc');

    // URL should update
    await expect(page).toHaveURL(/sort=votes_desc/);
  });

  test('can sort by votes ascending', async ({ page }) => {
    // Select sort by fewest votes
    await page.selectOption('#sort-filter', 'votes_asc');

    // URL should update
    await expect(page).toHaveURL(/sort=votes_asc/);
  });

  test('can combine filters', async ({ page }) => {
    // Select season 4 and episode 10
    await page.selectOption('#season-filter', '4');
    await page.selectOption('#episode-filter', '10');

    // URL should have both
    await expect(page).toHaveURL(/season=4/);
    await expect(page).toHaveURL(/episode=10/);
  });

  test('can reset filters', async ({ page }) => {
    // Apply some filters
    await page.selectOption('#season-filter', '5');
    await page.selectOption('#sort-filter', 'votes_desc');

    // Click reset
    await page.getByRole('button', { name: 'Reset' }).click();

    // URL should be clean
    await expect(page).not.toHaveURL(/season=/);
    await expect(page).not.toHaveURL(/sort=/);
  });

  test('can vote from the list', async ({ page }) => {
    // Accept cookies
    const cookieBanner = page.getByRole('dialog');
    if (await cookieBanner.isVisible()) {
      await page.getByRole('button', { name: 'Akzeptieren' }).click();
    }

    await page.waitForLoadState('networkidle');

    // Find a vote button in the list and click it
    const voteButtons = page.getByRole('button', { name: /votes?/i });
    const firstVoteButton = voteButtons.first();

    await expect(firstVoteButton).toBeVisible();
    await firstVoteButton.click();
    await page.waitForLoadState('networkidle');
  });

  test('clicking a quote opens detail view', async ({ page }) => {
    // Wait for quotes to load
    const quotes = page.locator('article');
    await expect(quotes.first()).toBeVisible();

    // Click on a quote link
    const quoteLinks = page.locator('article a');
    const firstLink = quoteLinks.first();

    await firstLink.click();
    await expect(page).toHaveURL(/\/quote\/[a-zA-Z0-9-]+/);
  });
});
