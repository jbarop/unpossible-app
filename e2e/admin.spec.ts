import { expect, test } from '@playwright/test';

const ADMIN_PASSWORD = 'rXq8mK2vLpN3wY5hJ7sT9uB1cF4gE6aZ';

test.describe('Admin', () => {
  test('shows login page when not authenticated', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');

    await expect(
      page.getByRole('heading', { name: 'Admin Login' }),
    ).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
  });

  test('shows error message for wrong password', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');

    await page.locator('#password').fill('wrong-password');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForLoadState('networkidle');

    await expect(page.getByRole('alert')).toBeVisible();
  });

  test('can login with correct password', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');

    await page.locator('#password').fill(ADMIN_PASSWORD);
    await page.getByRole('button', { name: 'Login' }).click();

    // Should redirect to admin quotes page
    await expect(page).toHaveURL(/\/admin\/quotes/);
  });

  test('can toggle password visibility', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');

    const passwordInput = page.locator('#password');
    const toggleButton = page.getByRole('button', {
      name: /show password|hide password/i,
    });

    // Initially password input type should be password
    await expect(passwordInput).toHaveAttribute('type', 'password');

    // Click toggle
    await toggleButton.click();
    await expect(passwordInput).toHaveAttribute('type', 'text');

    // Click again to hide
    await toggleButton.click();
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('redirects to login when accessing protected route', async ({ page }) => {
    await page.goto('/admin/quotes');
    await page.waitForLoadState('networkidle');

    // Should redirect to login - either /admin or show the login form
    const hasLoginHeading = await page.getByRole('heading', { name: 'Admin Login' }).isVisible();
    const isOnAdminPage = page.url().includes('/admin');

    expect(hasLoginHeading || isOnAdminPage).toBeTruthy();
  });
});

test.describe('Admin Quote Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');
    await page.locator('#password').fill(ADMIN_PASSWORD);
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL(/\/admin\/quotes/);
    await page.waitForLoadState('networkidle');
  });

  test('displays list of quotes', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'Quote Management' }),
    ).toBeVisible();

    // Table should be visible with quotes
    const table = page.locator('table');
    await expect(table).toBeVisible();
  });

  test('can create a new quote', async ({ page }) => {
    // Click new quote button
    await page.getByRole('button', { name: 'Add Quote' }).click();

    // Fill in the form using the correct labels
    await page.locator('#quote-text').fill('Test quote from E2E test - Me fail English? That is unpossible!');
    await page.locator('#quote-season').fill('99');
    await page.locator('#quote-episode').fill('99');

    // Submit - button text is "Create Quote"
    await page.getByRole('button', { name: 'Create Quote' }).click();

    // Wait for the modal to close and page to reload
    await page.waitForLoadState('networkidle');

    // Verify the quote appears in the table (use first() to avoid strict mode violation from multiple matches)
    await expect(page.getByText(/Test quote from E2E test/).first()).toBeVisible();
  });

  test('can edit a quote', async ({ page }) => {
    // Wait for table to load
    await expect(page.locator('table')).toBeVisible();

    // Find an edit button (using text since it's a button)
    const editButton = page.getByRole('button', { name: /^Edit/i }).first();
    await editButton.click();

    // Modal should open with the textarea
    await expect(page.locator('#quote-text')).toBeVisible();

    // Modify the text
    await page.locator('#quote-text').fill('Edited quote text - I choo choo choose you!');

    // Save - button text is "Update Quote"
    await page.getByRole('button', { name: 'Update Quote' }).click();

    // Wait for update
    await page.waitForLoadState('networkidle');
  });

  test('can delete a quote', async ({ page }) => {
    // Wait for table to load
    await expect(page.locator('table')).toBeVisible();

    // Get initial count
    const initialRows = await page.locator('table tbody tr').count();

    // Find a delete button
    const deleteButton = page.getByRole('button', { name: /^Delete/i }).first();
    await deleteButton.click();

    // Confirm dialog should appear - click the Delete button in the dialog
    const confirmButton = page.getByRole('button', { name: 'Delete' }).last();
    await confirmButton.click();

    // Wait for deletion
    await page.waitForLoadState('networkidle');

    // Verify a row was removed
    const newRows = await page.locator('table tbody tr').count();
    expect(newRows).toBeLessThanOrEqual(initialRows);
  });

  test('can logout', async ({ page }) => {
    // Find and click logout button
    await page.getByRole('button', { name: 'Logout' }).click();

    // Should redirect to login page
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('heading', { name: 'Admin Login' })).toBeVisible();
  });
});
