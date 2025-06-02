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
