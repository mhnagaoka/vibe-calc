import { test, expect } from "@playwright/test";

test.describe("RPN Calculator", () => {
  test("should display the calculator UI", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("text=Enter")).toBeVisible();
    await expect(page.locator("text=+")).toBeVisible();
    await expect(page.locator("text=Swap")).toBeVisible();
  });
});
