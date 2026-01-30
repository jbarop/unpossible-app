import { expect, test } from '@playwright/test';

test.describe('Dark Mode', () => {
  test('can toggle dark mode', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Find the theme toggle button
    const themeToggle = page.getByRole('button', { name: /switch to (dark|light) mode/i });
    await expect(themeToggle).toBeVisible();

    // Get initial state
    const initialClass = await page.locator('html').getAttribute('class');
    const initiallyDark = initialClass?.includes('dark') ?? false;

    // Click to toggle
    await themeToggle.click();

    // Verify the class changed
    const newClass = await page.locator('html').getAttribute('class');
    const nowDark = newClass?.includes('dark') ?? false;

    expect(nowDark).not.toBe(initiallyDark);
  });

  test('persists theme preference', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Find and click the theme toggle
    const themeToggle = page.getByRole('button', { name: /switch to (dark|light) mode/i });
    await expect(themeToggle).toBeVisible();
    await themeToggle.click();

    const themeAfterClick = await page.locator('html').getAttribute('class');
    const isDark = themeAfterClick?.includes('dark') ?? false;

    // Reload the page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Verify the theme persisted
    const themeAfterReload = await page.locator('html').getAttribute('class');
    const stillDark = themeAfterReload?.includes('dark') ?? false;

    expect(stillDark).toBe(isDark);
  });

  test('theme toggle has accessible label', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const themeToggle = page.getByRole('button', { name: /switch to (dark|light) mode/i });
    await expect(themeToggle).toBeVisible();

    const ariaLabel = await themeToggle.getAttribute('aria-label');
    expect(ariaLabel).toMatch(/switch to (dark|light) mode/i);
  });
});
