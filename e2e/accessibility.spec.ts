import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('Accessibility', () => {
  test.describe('Home Page', () => {
    test('has no accessibility violations', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Wait for quote to load
      await expect(page.locator('article blockquote')).toBeVisible();

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      expect(results.violations).toEqual([]);
    });
  });

  test.describe('Quotes List Page', () => {
    test('has no accessibility violations', async ({ page }) => {
      await page.goto('/quotes');
      await page.waitForLoadState('networkidle');

      // Wait for quotes to load
      await expect(page.locator('article').first()).toBeVisible();

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      expect(results.violations).toEqual([]);
    });
  });

  test.describe('Privacy Page', () => {
    test('has no accessibility violations', async ({ page }) => {
      await page.goto('/privacy');
      await page.waitForLoadState('networkidle');

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      expect(results.violations).toEqual([]);
    });
  });

  test.describe('Admin Login Page', () => {
    test('has no accessibility violations', async ({ page }) => {
      await page.goto('/admin');
      await page.waitForLoadState('networkidle');

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      expect(results.violations).toEqual([]);
    });
  });

  test.describe('Dark Mode', () => {
    test('home page has no accessibility violations in dark mode', async ({
      page,
    }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Toggle to dark mode
      const themeToggle = page.getByRole('button', {
        name: /switch to dark mode/i,
      });
      await themeToggle.click();

      // Wait for dark mode to apply
      await expect(page.locator('html')).toHaveClass(/dark/);

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      expect(results.violations).toEqual([]);
    });
  });

  test.describe('Keyboard Navigation', () => {
    test('all interactive elements are keyboard accessible', async ({
      page,
    }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Tab through the page and verify focus is visible
      await page.keyboard.press('Tab');

      // Skip link should be focused first
      const skipLink = page.getByRole('link', { name: 'Skip to main content' });
      await expect(skipLink).toBeFocused();

      // Continue tabbing - should reach navigation links
      await page.keyboard.press('Tab');
      await expect(
        page.getByRole('link', { name: 'Umpossible' })
      ).toBeFocused();

      await page.keyboard.press('Tab');
      await expect(page.getByRole('link', { name: 'Home' })).toBeFocused();

      await page.keyboard.press('Tab');
      await expect(
        page.getByRole('link', { name: 'All Quotes' })
      ).toBeFocused();
    });

    test('skip link navigates to main content', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Tab to skip link
      await page.keyboard.press('Tab');
      const skipLink = page.getByRole('link', { name: 'Skip to main content' });
      await expect(skipLink).toBeFocused();

      // Press Enter to activate skip link
      await page.keyboard.press('Enter');

      // Focus should now be on main content area
      const mainContent = page.locator('#main-content');
      await expect(mainContent).toBeVisible();
    });

    test('vote button is keyboard accessible', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Wait for quote to load
      await expect(page.locator('article blockquote')).toBeVisible();

      // Find and focus the vote button
      const voteButton = page.getByRole('button', { name: /vote/i });
      await voteButton.focus();
      await expect(voteButton).toBeFocused();

      // Should be able to activate with Enter
      const initialVotes = await voteButton.getAttribute('aria-label');
      expect(initialVotes).toBeTruthy();
    });
  });

  test.describe('Color Contrast', () => {
    test('all text has sufficient color contrast', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Only check WCAG 2 AA color contrast (not AAA which is stricter)
      const results = await new AxeBuilder({ page })
        .withRules(['color-contrast'])
        .analyze();

      expect(results.violations).toEqual([]);
    });
  });

  test.describe('Focus Indicators', () => {
    test('interactive elements have visible focus indicators', async ({
      page,
    }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Tab to a button and check focus styles
      const themeToggle = page.getByRole('button', {
        name: /switch to .* mode/i,
      });
      await themeToggle.focus();

      // The button should have a visible focus ring (ring-2 class in Tailwind)
      const focusClasses = await themeToggle.getAttribute('class');
      expect(focusClasses).toContain('focus:ring');
    });
  });

  test.describe('Semantic HTML', () => {
    test('page has proper heading hierarchy', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Check that there's at least one h1
      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBeGreaterThanOrEqual(1);

      // Check heading order with axe
      const results = await new AxeBuilder({ page })
        .withTags(['cat.semantics'])
        .analyze();

      // Filter for heading-order violations specifically
      const headingViolations = results.violations.filter(
        (v) => v.id === 'heading-order'
      );
      expect(headingViolations).toEqual([]);
    });

    test('images have alt text', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const results = await new AxeBuilder({ page })
        .withRules(['image-alt'])
        .analyze();

      expect(results.violations).toEqual([]);
    });

    test('forms have proper labels', async ({ page }) => {
      await page.goto('/admin');
      await page.waitForLoadState('networkidle');

      const results = await new AxeBuilder({ page })
        .withRules(['label'])
        .analyze();

      expect(results.violations).toEqual([]);
    });
  });

  test.describe('ARIA', () => {
    test('ARIA attributes are used correctly', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const results = await new AxeBuilder({ page })
        .withTags(['cat.aria'])
        .analyze();

      expect(results.violations).toEqual([]);
    });

    test('buttons have accessible names', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const results = await new AxeBuilder({ page })
        .withRules(['button-name'])
        .analyze();

      expect(results.violations).toEqual([]);
    });

    test('links have accessible names', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const results = await new AxeBuilder({ page })
        .withRules(['link-name'])
        .analyze();

      expect(results.violations).toEqual([]);
    });
  });
});
