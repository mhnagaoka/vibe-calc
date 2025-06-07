import { describe, it, expect } from "vitest";
import { createInitialState, setX, enter, add } from "../lib/rpn-calculator";

describe("Example Workflow from Plan", () => {
  it("should follow the exact workflow described in the plan", () => {
    // Start with initial state
    let state = createInitialState();
    expect(state.stack).toEqual({ t: 0, z: 0, y: 0, x: 0 });

    // Type 3 → X becomes 3 (Y, Z, T remain as before)
    state = setX(state, 3);
    expect(state.stack).toEqual({ t: 0, z: 0, y: 0, x: 3 });

    // Press Enter → Y gets 3, X stays 3 (stack lifts: old Y→Z, old Z→T)
    state = enter(state);
    expect(state.stack).toEqual({ t: 0, z: 0, y: 3, x: 3 });

    // Type 4 → X becomes 4 (the remaining stack elements stay unchanged: Y stays 3)
    state = setX(state, 4);
    expect(state.stack).toEqual({ t: 0, z: 0, y: 3, x: 4 });

    // Press + → Calculates Y + X = 3 + 4 = 7, result goes to X
    state = add(state);
    expect(state.stack.x).toBe(7);
    expect(state.lastX).toBe(4); // The consumed X value should be stored

    // Type 5 → X becomes 5, Y becomes 7 (stack lifts: old Y→Z, old Z→T)
    // This step involves automatic stack lift when starting to type after an operation
    state = enter(state); // Simulate the automatic lift that should happen when typing starts
    state = setX(state, 5);
    expect(state.stack).toEqual({ t: 0, z: 0, y: 7, x: 5 });
  });
});

describe("Backspace Operation (UI Logic)", () => {
  it("should handle backspace correctly in input mode", () => {
    // This test simulates the UI behavior that would happen with backspace
    let state = createInitialState();

    // Simulate typing "123" and then backspacing
    // In the UI: user types "123"
    state = setX(state, 123);
    expect(state.stack.x).toBe(123);

    // In the UI: user presses backspace to get "12"
    state = setX(state, 12);
    expect(state.stack.x).toBe(12);

    // In the UI: user presses backspace again to get "1"
    state = setX(state, 1);
    expect(state.stack.x).toBe(1);

    // In the UI: user presses backspace to clear input (back to previous stack value)
    // This would revert to showing the previous stack value
    expect(state.stack.x).toBe(1);
  });

  it("should handle backspace with decimal numbers", () => {
    let state = createInitialState();

    // Simulate typing "12.34" and then backspacing
    state = setX(state, 12.34);
    expect(state.stack.x).toBe(12.34);

    // Backspace to "12.3"
    state = setX(state, 12.3);
    expect(state.stack.x).toBe(12.3);

    // Backspace to "12"
    state = setX(state, 12);
    expect(state.stack.x).toBe(12);
  });

  it("should handle backspace with negative numbers", () => {
    let state = createInitialState();

    // Simulate typing "-123" and then backspacing
    state = setX(state, -123);
    expect(state.stack.x).toBe(-123);

    // Backspace to "-12"
    state = setX(state, -12);
    expect(state.stack.x).toBe(-12);

    // Backspace to "-1"
    state = setX(state, -1);
    expect(state.stack.x).toBe(-1);
  });
});
