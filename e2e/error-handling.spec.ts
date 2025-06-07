import { test, expect } from "@playwright/test";

test.describe("RPN Calculator - Error Handling", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should handle division by zero gracefully", async ({ page }) => {
    // Set up: Put 8 on stack, then 0 on top
    await page.getByRole("button", { name: "8" }).click();
    await page.getByRole("button", { name: "Enter" }).click();
    await page.getByRole("button", { name: "0" }).click();

    // Attempt division by zero
    await page.getByRole("button", { name: "÷" }).click();

    // Verify the calculator state remains unchanged
    // Y should still have 8, X should still have 0
    // The division should not have completed
    await expect(page.locator("text=8").first()).toBeVisible();
    await expect(page.locator("text=0").last()).toBeVisible();

    // Verify calculator is still functional after error
    // Clear the input and start fresh calculation
    await page.getByRole("button", { name: "Clear" }).click();
    await page.getByRole("button", { name: "8" }).click();
    await page.getByRole("button", { name: "Enter" }).click();
    await page.getByRole("button", { name: "5" }).click();
    await page.getByRole("button", { name: "+" }).click();

    // Should now show 8 + 5 = 13
    await expect(page.locator("text=13").last()).toBeVisible();
  });

  test("should handle operations with insufficient stack elements", async ({
    page,
  }) => {
    // Clear the stack to start fresh
    await page.getByRole("button", { name: "Clear" }).click();

    // Try to perform addition with only one number (or empty stack)
    await page.getByRole("button", { name: "5" }).click();
    await page.getByRole("button", { name: "+" }).click();

    // Calculator should handle this gracefully
    // With RPN calculator, operations need two operands
    // Result should be 0 + 5 = 5 (Y starts as 0)
    await expect(page.locator("text=5").last()).toBeVisible();
  });

  test("should handle empty stack operations", async ({ page }) => {
    // Clear everything
    await page.getByRole("button", { name: "Clear" }).click();

    // Try swap on empty stack (should not crash)
    await page.getByRole("button", { name: "Swap" }).click();

    // Should still show all zeros
    await expect(page.locator("text=0").last()).toBeVisible();

    // Try drop on empty stack
    await page.getByRole("button", { name: "Drop" }).click();

    // Should still be functional
    await expect(page.locator("text=0").last()).toBeVisible();
  });

  test("should handle Last X with no previous operation", async ({ page }) => {
    // Clear everything to start fresh
    await page.getByRole("button", { name: "Clear" }).click();

    // Try Last X without any previous math operations
    await page.getByRole("button", { name: "Last X" }).click();

    // Should not crash or change state significantly
    // Calculator should remain functional
    await page.getByRole("button", { name: "7" }).click();
    await expect(page.locator("text=7").last()).toBeVisible();
  });

  test("should handle decimal point edge cases", async ({ page }) => {
    // Test multiple decimal points (should be prevented)
    await page.getByRole("button", { name: "3" }).click();
    await page.getByRole("button", { name: "." }).click();
    await page.getByRole("button", { name: "1" }).click();

    // Try to add another decimal point
    await page.getByRole("button", { name: "." }).click();
    await page.getByRole("button", { name: "4" }).click();

    // Should show 3.14, not 3.1.4
    await expect(page.locator("text=3.14").last()).toBeVisible();
  });

  test("should handle very large numbers", async ({ page }) => {
    // Enter a large number through repeated multiplication
    await page.getByRole("button", { name: "9" }).click();
    await page.getByRole("button", { name: "9" }).click();
    await page.getByRole("button", { name: "9" }).click();
    await page.getByRole("button", { name: "Enter" }).click();

    await page.getByRole("button", { name: "9" }).click();
    await page.getByRole("button", { name: "9" }).click();
    await page.getByRole("button", { name: "9" }).click();
    await page.getByRole("button", { name: "×" }).click();

    // Should handle large result (999 × 999 = 998001)
    await expect(page.locator("text=998001").last()).toBeVisible();
  });

  test("should handle backspace on empty input", async ({ page }) => {
    // Clear and try backspace on empty input
    await page.getByRole("button", { name: "Clear" }).click();

    // Try backspace without typing anything
    await page.getByRole("button", { name: "⌫" }).click();

    // Should not crash and should show 0
    await expect(page.locator("text=0").last()).toBeVisible();

    // Calculator should remain functional
    await page.getByRole("button", { name: "5" }).click();
    await expect(page.locator("text=5").last()).toBeVisible();
  });

  test("should handle rapid operation sequence", async ({ page }) => {
    // Test rapid sequence of operations to check for race conditions
    await page.getByRole("button", { name: "1" }).click();
    await page.getByRole("button", { name: "0" }).click();
    await page.getByRole("button", { name: "Enter" }).click();

    // Rapid operations
    await page.getByRole("button", { name: "2" }).click();
    await page.getByRole("button", { name: "×" }).click();
    await page.getByRole("button", { name: "3" }).click();
    await page.getByRole("button", { name: "+" }).click();
    await page.getByRole("button", { name: "4" }).click();
    await page.getByRole("button", { name: "−" }).click();

    // Should handle the sequence: 10 × 2 = 20, then 20 + 3 = 23, then 23 - 4 = 19
    await expect(page.locator("text=19").last()).toBeVisible();
  });

  test("should handle negative results", async ({ page }) => {
    // Test subtraction that results in negative number
    await page.getByRole("button", { name: "5" }).click();
    await page.getByRole("button", { name: "Enter" }).click();
    await page.getByRole("button", { name: "1" }).click();
    await page.getByRole("button", { name: "0" }).click();
    await page.getByRole("button", { name: "−" }).click();

    // Should show -5 (5 - 10 = -5)
    await expect(page.locator("text=-5").last()).toBeVisible();
  });

  test("should handle fractional results", async ({ page }) => {
    // Test division that results in fraction
    await page.getByRole("button", { name: "1" }).click();
    await page.getByRole("button", { name: "Enter" }).click();
    await page.getByRole("button", { name: "3" }).click();
    await page.getByRole("button", { name: "÷" }).click();

    // Should show approximately 0.333... (1 ÷ 3)
    // Check that it starts with 0.3
    const result = page.locator("span").filter({ hasText: /^0\.3/ }).last();
    await expect(result).toBeVisible();
  });

  test("should recover from errors and continue calculations", async ({
    page,
  }) => {
    // Test that after an error (like division by zero), calculator continues to work

    // First, cause a division by zero error
    await page.getByRole("button", { name: "5" }).click();
    await page.getByRole("button", { name: "Enter" }).click();
    await page.getByRole("button", { name: "0" }).click();
    await page.getByRole("button", { name: "÷" }).click();

    // Now clear and perform a normal calculation
    await page.getByRole("button", { name: "Clear" }).click();
    await page.getByRole("button", { name: "6" }).click();
    await page.getByRole("button", { name: "Enter" }).click();
    await page.getByRole("button", { name: "7" }).click();
    await page.getByRole("button", { name: "×" }).click();

    // Should show 42 (6 × 7)
    await expect(page.locator("text=42").last()).toBeVisible();
  });
});
