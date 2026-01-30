import { expect, test } from "@playwright/test";

test.describe("Database Seeding", () => {
  test("should never show 'No quotes found' on home page", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Verify "No quotes found" is NOT visible
    const noQuotesMessage = page.getByText("No quotes found");
    await expect(noQuotesMessage).not.toBeVisible();

    // Verify a quote IS visible
    await expect(page.locator("article blockquote")).toBeVisible();
  });

  test("should never show 'No quotes found' on quotes list page", async ({
    page,
  }) => {
    await page.goto("/quotes");
    await page.waitForLoadState("networkidle");

    // Verify "No quotes found" is NOT visible
    const noQuotesMessage = page.getByText("No quotes found");
    await expect(noQuotesMessage).not.toBeVisible();

    // Verify quotes are visible in the list
    await expect(page.locator("article").first()).toBeVisible();
  });

  test("API should return quotes", async ({ request }) => {
    const response = await request.get("/api/quotes");
    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    expect(data.data).toBeDefined();
    expect(Array.isArray(data.data)).toBe(true);
    expect(data.data.length).toBeGreaterThan(0);
    expect(data.pagination.total).toBeGreaterThan(0);
  });

  test("API should return a random quote", async ({ request }) => {
    const response = await request.get("/api/quotes/random");
    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    expect(data.data).toBeDefined();
    expect(data.data.id).toBeDefined();
    expect(data.data.text).toBeTruthy();
    expect(data.data.season).toBeGreaterThan(0);
    expect(data.data.episode).toBeGreaterThan(0);
  });
});
