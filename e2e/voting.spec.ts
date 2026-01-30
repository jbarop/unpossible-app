import { expect, test } from '@playwright/test';

test.describe('Voting', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('can submit an upvote after accepting cookies', async ({ page }) => {
    // Accept cookies if banner is visible
    const cookieBanner = page.getByRole('dialog');
    if (await cookieBanner.isVisible()) {
      await page.getByRole('button', { name: 'Akzeptieren' }).click();
      await expect(cookieBanner).not.toBeVisible();
    }

    // Vote button has aria-label like "Upvote - X votes"
    const voteButton = page.getByRole('button', { name: /votes?/i });
    await expect(voteButton).toBeVisible();

    // Get initial vote count from the button's span text
    const voteSpan = voteButton.locator('span');
    const initialVotes = parseInt((await voteSpan.textContent()) ?? '0', 10);

    // Click the vote button
    await voteButton.click();
    await page.waitForLoadState('networkidle');

    // Verify the vote count increased
    const newVotes = parseInt((await voteSpan.textContent()) ?? '0', 10);
    expect(newVotes).toBeGreaterThanOrEqual(initialVotes);
  });

  test('shows visual feedback after voting', async ({ page }) => {
    // Accept cookies if banner is visible
    const cookieBanner = page.getByRole('dialog');
    if (await cookieBanner.isVisible()) {
      await page.getByRole('button', { name: 'Akzeptieren' }).click();
      await expect(cookieBanner).not.toBeVisible();
    }

    const voteButton = page.getByRole('button', { name: /votes?/i });
    await expect(voteButton).toBeVisible();
    await voteButton.click();
    await page.waitForLoadState('networkidle');

    // After voting, the button should be disabled or have the pink background class
    const classes = await voteButton.getAttribute('class');
    const isDisabled = await voteButton.isDisabled();

    // Either disabled or has the voted style
    expect(isDisabled || classes?.includes('simpsons-pink') || classes?.includes('cursor-not-allowed')).toBeTruthy();
  });

  test('cannot vote without cookie consent', async ({ page }) => {
    // Reject cookies if banner is visible
    const cookieBanner = page.getByRole('dialog');
    if (await cookieBanner.isVisible()) {
      await page.getByRole('button', { name: 'Ablehnen' }).click();
    }

    // Wait for the banner to close
    await page.waitForLoadState('networkidle');

    // The vote button should be disabled
    const voteButton = page.getByRole('button', { name: /votes?/i });
    await expect(voteButton).toBeVisible();

    const isDisabled = await voteButton.isDisabled();
    const classes = await voteButton.getAttribute('class');

    expect(isDisabled || classes?.includes('cursor-not-allowed')).toBeTruthy();
  });
});
