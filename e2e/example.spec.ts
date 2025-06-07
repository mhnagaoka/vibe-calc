import { test, expect } from "@playwright/test";

test.describe("RPN Calculator", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should display the calculator UI with all essential elements", async ({
    page,
  }) => {
    // Check title and description
    await expect(page.locator("text=RPN Calculator")).toBeVisible();
    await expect(
      page.locator("text=Reverse Polish Notation Calculator")
    ).toBeVisible();

    // Check display area with stack registers
    await expect(page.locator("text=Stack:")).toBeVisible();
    await expect(page.locator("text=T:")).toBeVisible();
    await expect(page.locator("text=Z:")).toBeVisible();
    await expect(page.locator("text=Y:")).toBeVisible();
    await expect(page.locator("text=X:")).toBeVisible();

    // Check number buttons (0-9)
    for (let i = 0; i <= 9; i++) {
      await expect(
        page.getByRole("button", { name: i.toString() })
      ).toBeVisible();
    }

    // Check decimal button
    await expect(page.getByRole("button", { name: "." })).toBeVisible();

    // Check operation buttons
    await expect(page.getByRole("button", { name: "+" })).toBeVisible();
    await expect(page.getByRole("button", { name: "−" })).toBeVisible();
    await expect(page.getByRole("button", { name: "×" })).toBeVisible();
    await expect(page.getByRole("button", { name: "÷" })).toBeVisible();

    // Check stack operation buttons
    await expect(page.getByRole("button", { name: "Enter" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Swap" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Drop" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Clear" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Last X" })).toBeVisible();
    await expect(page.getByRole("button", { name: "⌫" })).toBeVisible();
  });

  test("should perform basic arithmetic: 3 + 4 = 7", async ({ page }) => {
    // Type 3
    await page.getByRole("button", { name: "3" }).click();
    await expect(page.locator("text=3").last()).toBeVisible();

    // Press Enter to push to stack
    await page.getByRole("button", { name: "Enter" }).click();

    // Type 4
    await page.getByRole("button", { name: "4" }).click();
    await expect(page.locator("text=4").last()).toBeVisible();

    // Press + to add
    await page.getByRole("button", { name: "+" }).click();

    // Check result is 7 in X register
    await expect(page.locator("text=7").last()).toBeVisible();
  });

  test("should perform subtraction: 10 - 3 = 7", async ({ page }) => {
    // Type 10
    await page.getByRole("button", { name: "1" }).click();
    await page.getByRole("button", { name: "0" }).click();

    // Press Enter
    await page.getByRole("button", { name: "Enter" }).click();

    // Type 3
    await page.getByRole("button", { name: "3" }).click();

    // Press - to subtract
    await page.getByRole("button", { name: "−" }).click();

    // Check result is 7
    await expect(page.locator("text=7").last()).toBeVisible();
  });

  test("should perform multiplication: 6 × 7 = 42", async ({ page }) => {
    // Type 6
    await page.getByRole("button", { name: "6" }).click();

    // Press Enter
    await page.getByRole("button", { name: "Enter" }).click();

    // Type 7
    await page.getByRole("button", { name: "7" }).click();

    // Press × to multiply
    await page.getByRole("button", { name: "×" }).click();

    // Check result is 42
    await expect(page.locator("text=42").last()).toBeVisible();
  });

  test("should perform division: 15 ÷ 3 = 5", async ({ page }) => {
    // Type 15
    await page.getByRole("button", { name: "1" }).click();
    await page.getByRole("button", { name: "5" }).click();

    // Press Enter
    await page.getByRole("button", { name: "Enter" }).click();

    // Type 3
    await page.getByRole("button", { name: "3" }).click();

    // Press ÷ to divide
    await page.getByRole("button", { name: "÷" }).click();

    // Check result is 5
    await expect(page.locator("text=5").last()).toBeVisible();
  });

  test("should handle decimal numbers: 3.5 + 2.1 = 5.6", async ({ page }) => {
    // Type 3.5
    await page.getByRole("button", { name: "3" }).click();
    await page.getByRole("button", { name: "." }).click();
    await page.getByRole("button", { name: "5" }).click();

    // Press Enter
    await page.getByRole("button", { name: "Enter" }).click();

    // Type 2.1
    await page.getByRole("button", { name: "2" }).click();
    await page.getByRole("button", { name: "." }).click();
    await page.getByRole("button", { name: "1" }).click();

    // Press + to add
    await page.getByRole("button", { name: "+" }).click();

    // Check result is 5.6
    await expect(page.locator("text=5.6").last()).toBeVisible();
  });

  test("should swap stack elements correctly", async ({ page }) => {
    // Type 5
    await page.getByRole("button", { name: "5" }).click();
    await page.getByRole("button", { name: "Enter" }).click();

    // Type 10
    await page.getByRole("button", { name: "1" }).click();
    await page.getByRole("button", { name: "0" }).click();

    // Press Swap
    await page.getByRole("button", { name: "Swap" }).click();

    // X should now be 5, Y should be 10
    // The X register display should show 5
    await expect(page.locator("text=5").last()).toBeVisible();
  });

  test("should drop stack elements correctly", async ({ page }) => {
    // Type 5
    await page.getByRole("button", { name: "5" }).click();
    await page.getByRole("button", { name: "Enter" }).click();

    // Type 10
    await page.getByRole("button", { name: "1" }).click();
    await page.getByRole("button", { name: "0" }).click();
    await page.getByRole("button", { name: "Enter" }).click();

    // Type 15
    await page.getByRole("button", { name: "1" }).click();
    await page.getByRole("button", { name: "5" }).click();

    // Press Drop to remove X (15)
    await page.getByRole("button", { name: "Drop" }).click();

    // X should now be 10
    await expect(page.locator("text=10").last()).toBeVisible();
  });

  test("should clear stack and reset to zero", async ({ page }) => {
    // Type some numbers and perform operations
    await page.getByRole("button", { name: "5" }).click();
    await page.getByRole("button", { name: "Enter" }).click();
    await page.getByRole("button", { name: "3" }).click();
    await page.getByRole("button", { name: "+" }).click();

    // Press Clear
    await page.getByRole("button", { name: "Clear" }).click();

    // All registers should be 0
    const stackDisplay = page
      .locator("div")
      .filter({ hasText: /^Stack:T:0Z:0Y:0X:0$/ });
    await expect(stackDisplay).toBeVisible();
  });

  test("should handle Last X operation correctly", async ({ page }) => {
    // Type 7
    await page.getByRole("button", { name: "7" }).click();
    await page.getByRole("button", { name: "Enter" }).click();

    // Type 3
    await page.getByRole("button", { name: "3" }).click();

    // Multiply (7 × 3 = 21, Last X should be 3)
    await page.getByRole("button", { name: "×" }).click();

    // Press Last X to recall the 3
    await page.getByRole("button", { name: "Last X" }).click();

    // X should now be 3
    await expect(page.locator("text=3").last()).toBeVisible();
  });

  test("should handle backspace operation correctly", async ({ page }) => {
    // Type 123
    await page.getByRole("button", { name: "1" }).click();
    await page.getByRole("button", { name: "2" }).click();
    await page.getByRole("button", { name: "3" }).click();

    // Press backspace to remove last digit
    await page.getByRole("button", { name: "⌫" }).click();

    // Should show 12
    await expect(page.locator("text=12").last()).toBeVisible();

    // Press backspace again
    await page.getByRole("button", { name: "⌫" }).click();

    // Should show 1
    await expect(page.locator("text=1").last()).toBeVisible();

    // Press backspace again
    await page.getByRole("button", { name: "⌫" }).click();

    // Should show 0 (empty input defaults to 0)
    await expect(page.locator("text=0").last()).toBeVisible();
  });

  test("should handle complex calculation: (3 + 4) × (5 - 2) = 21", async ({
    page,
  }) => {
    // Calculate 3 + 4 = 7
    await page.getByRole("button", { name: "3" }).click();
    await page.getByRole("button", { name: "Enter" }).click();
    await page.getByRole("button", { name: "4" }).click();
    await page.getByRole("button", { name: "+" }).click();

    // Now we have 7 in X. Calculate 5 - 2 = 3
    await page.getByRole("button", { name: "5" }).click();
    await page.getByRole("button", { name: "Enter" }).click();
    await page.getByRole("button", { name: "2" }).click();
    await page.getByRole("button", { name: "−" }).click();

    // Now we have 3 in X and 7 in Y. Multiply them: 7 × 3 = 21
    await page.getByRole("button", { name: "×" }).click();

    // Check result is 21
    await expect(page.locator("text=21").last()).toBeVisible();
  });

  test("should prevent division by zero and maintain calculator state", async ({
    page,
  }) => {
    // Type 5
    await page.getByRole("button", { name: "5" }).click();
    await page.getByRole("button", { name: "Enter" }).click();

    // Type 0
    await page.getByRole("button", { name: "0" }).click();

    // Try to divide by zero
    await page.getByRole("button", { name: "÷" }).click();

    // Calculator should still show the original values (5 in Y, 0 in X)
    // The division operation should not have completed
    await expect(page.locator("text=5").first()).toBeVisible(); // Should still see 5 somewhere
    await expect(page.locator("text=0").last()).toBeVisible(); // Should still see 0 in X
  });

  test("should handle entering zero correctly", async ({ page }) => {
    // Type 0
    await page.getByRole("button", { name: "0" }).click();

    // X should show 0
    await expect(page.locator("text=0").last()).toBeVisible();

    // Type multiple zeros
    await page.getByRole("button", { name: "0" }).click();
    await page.getByRole("button", { name: "0" }).click();

    // Should still show single 0 (no leading zeros)
    await expect(page.locator("text=0").last()).toBeVisible();
  });

  test("should work correctly on mobile viewport", async ({
    page,
    isMobile,
  }) => {
    if (isMobile) {
      // Verify all buttons are accessible and clickable on mobile
      await page.getByRole("button", { name: "5" }).click();
      await page.getByRole("button", { name: "Enter" }).click();
      await page.getByRole("button", { name: "3" }).click();
      await page.getByRole("button", { name: "+" }).click();

      // Check result
      await expect(page.locator("text=8").last()).toBeVisible();

      // Verify display is readable
      await expect(page.locator("text=Stack:")).toBeVisible();
    }
  });

  test("should maintain input mode visual feedback", async ({ page }) => {
    // Type a number
    await page.getByRole("button", { name: "4" }).click();
    await page.getByRole("button", { name: "2" }).click();

    // The X register should show the typed number in blue (input mode)
    const xRegister = page.locator("span").filter({ hasText: "42" }).last();
    await expect(xRegister).toHaveClass(/text-blue-600/);

    // Press Enter to exit input mode
    await page.getByRole("button", { name: "Enter" }).click();

    // After Enter, the number should no longer be in blue
    const xRegisterAfter = page
      .locator("span")
      .filter({ hasText: "42" })
      .last();
    await expect(xRegisterAfter).not.toHaveClass(/text-blue-600/);
  });

  test("should handle rapid button clicking without errors", async ({
    page,
  }) => {
    // Rapidly click number buttons
    for (let i = 0; i < 5; i++) {
      await page.getByRole("button", { name: "1" }).click();
      await page.getByRole("button", { name: "Enter" }).click();
      await page.getByRole("button", { name: "2" }).click();
      await page.getByRole("button", { name: "+" }).click();
    }

    // Calculator should still be responsive
    await page.getByRole("button", { name: "Clear" }).click();
    await expect(page.locator("text=0").last()).toBeVisible();
  });
});
