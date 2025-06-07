import { describe, it, expect } from "vitest";
import {
  createInitialState,
  setX,
  enter,
  swap,
  drop,
  clear,
  lastX,
  add,
  subtract,
  multiply,
  divide,
  CalculatorError,
} from "../lib/rpn-calculator";

describe("RPN Calculator Engine", () => {
  describe("Initial State", () => {
    it("should create initial state with all zeros", () => {
      const state = createInitialState();
      expect(state.stack.t).toBe(0);
      expect(state.stack.z).toBe(0);
      expect(state.stack.y).toBe(0);
      expect(state.stack.x).toBe(0);
      expect(state.lastX).toBeUndefined();
    });
  });

  describe("setX operation", () => {
    it("should set X register value", () => {
      const state = createInitialState();
      const newState = setX(state, 42);

      expect(newState.stack.x).toBe(42);
      expect(newState.stack.y).toBe(0);
      expect(newState.stack.z).toBe(0);
      expect(newState.stack.t).toBe(0);
    });

    it("should not mutate original state", () => {
      const state = createInitialState();
      const newState = setX(state, 42);

      expect(state.stack.x).toBe(0); // Original unchanged
      expect(newState.stack.x).toBe(42); // New state changed
    });
  });

  describe("Enter operation", () => {
    it("should duplicate X to Y and lift stack", () => {
      const state = setX(createInitialState(), 3);
      const newState = enter(state);

      expect(newState.stack.x).toBe(3); // X stays the same
      expect(newState.stack.y).toBe(3); // Y gets X value
      expect(newState.stack.z).toBe(0); // Z gets old Y
      expect(newState.stack.t).toBe(0); // T gets old Z
    });

    it("should implement the workflow from the plan", () => {
      // Type 3 → X becomes 3
      let state = setX(createInitialState(), 3);
      expect(state.stack.x).toBe(3);

      // Press Enter → Y gets 3, X stays 3 (stack lifts)
      state = enter(state);
      expect(state.stack.x).toBe(3);
      expect(state.stack.y).toBe(3);

      // Type 4 → X becomes 4 (Y stays 3)
      state = setX(state, 4);
      expect(state.stack.x).toBe(4);
      expect(state.stack.y).toBe(3);
    });

    it("should work with full stack", () => {
      let state = createInitialState();

      // Fill the stack: 1, 2, 3, 4
      state = setX(state, 1);
      state = enter(state);
      state = setX(state, 2);
      state = enter(state);
      state = setX(state, 3);
      state = enter(state);
      state = setX(state, 4);
      state = enter(state);

      expect(state.stack.x).toBe(4);
      expect(state.stack.y).toBe(4); // Enter duplicates X
      expect(state.stack.z).toBe(3);
      expect(state.stack.t).toBe(2); // 1 gets pushed out
    });
  });

  describe("Swap operation", () => {
    it("should exchange X and Y registers", () => {
      let state = createInitialState();
      state = setX(state, 3);
      state = enter(state);
      state = setX(state, 4);

      const swappedState = swap(state);

      expect(swappedState.stack.x).toBe(3); // Was Y
      expect(swappedState.stack.y).toBe(4); // Was X
      expect(swappedState.stack.z).toBe(0); // Unchanged
      expect(swappedState.stack.t).toBe(0); // Unchanged
    });
  });

  describe("Drop operation", () => {
    it("should remove X and pull stack down", () => {
      let state = createInitialState();
      // Set up stack: T=1, Z=2, Y=3, X=4
      state = setX(state, 1);
      state = enter(state);
      state = setX(state, 2);
      state = enter(state);
      state = setX(state, 3);
      state = enter(state);
      state = setX(state, 4);

      const droppedState = drop(state);

      expect(droppedState.stack.x).toBe(3); // Was Y
      expect(droppedState.stack.y).toBe(2); // Was Z
      expect(droppedState.stack.z).toBe(1); // Was T
      expect(droppedState.stack.t).toBe(0); // Fills from "infinity"
      expect(droppedState.lastX).toBeUndefined(); // Drop should not set lastX
    });
  });

  describe("Clear operation", () => {
    it("should reset all registers to zero", () => {
      let state = createInitialState();
      state = setX(state, 42);
      state = enter(state);
      state = setX(state, 24);

      const clearedState = clear(state);

      expect(clearedState.stack.x).toBe(0);
      expect(clearedState.stack.y).toBe(0);
      expect(clearedState.stack.z).toBe(0);
      expect(clearedState.stack.t).toBe(0);
    });
  });

  describe("Last X operation", () => {
    it("should restore last X value with stack lift after math operation", () => {
      let state = createInitialState();
      state = setX(state, 5);
      state = enter(state);
      state = setX(state, 3);
      state = add(state); // This sets lastX to 3 (the X value before addition)

      const restoredState = lastX(state);

      expect(restoredState.stack.x).toBe(3); // Restored lastX
      expect(restoredState.stack.y).toBe(8); // Lifted (result of 5+3)
      expect(restoredState.stack.z).toBe(0); // Lifted
      expect(restoredState.stack.t).toBe(0); // Lifted
    });

    it("should do nothing if no lastX value exists", () => {
      const state = createInitialState();
      const unchangedState = lastX(state);

      expect(unchangedState).toEqual(state);
    });

    it("should not be affected by setX operations", () => {
      let state = createInitialState();
      state = setX(state, 5);
      state = enter(state);
      state = setX(state, 3);
      state = add(state); // Sets lastX to 3

      // Setting X should not change lastX
      state = setX(state, 42);

      expect(state.lastX).toBe(3); // Should still be 3
    });

    it("should not be affected by enter operations", () => {
      let state = createInitialState();
      state = setX(state, 5);
      state = enter(state);
      state = setX(state, 3);
      state = add(state); // Sets lastX to 3

      // Enter should not change lastX
      state = enter(state);

      expect(state.lastX).toBe(3); // Should still be 3
    });
  });

  describe("Math Operations", () => {
    describe("Addition", () => {
      it("should add Y + X and store in X", () => {
        let state = createInitialState();
        state = setX(state, 3);
        state = enter(state);
        state = setX(state, 4);

        const result = add(state);

        expect(result.stack.x).toBe(7); // 3 + 4
        expect(result.stack.y).toBe(0); // Old Z (was 0)
        expect(result.stack.z).toBe(0); // Old T (was 0)
        expect(result.stack.t).toBe(0); // Filled from "infinity"
        expect(result.lastX).toBe(4); // Stores consumed X
      });

      it("should implement the workflow example from plan", () => {
        let state = createInitialState();

        // Type 3 → X becomes 3
        state = setX(state, 3);
        // Press Enter → Y gets 3, X stays 3
        state = enter(state);
        // Type 4 → X becomes 4
        state = setX(state, 4);
        // Press + → Calculates Y + X = 3 + 4 = 7
        state = add(state);

        expect(state.stack.x).toBe(7);
      });
    });

    describe("Subtraction", () => {
      it("should calculate Y - X and store in X", () => {
        let state = createInitialState();
        state = setX(state, 10);
        state = enter(state);
        state = setX(state, 3);

        const result = subtract(state);

        expect(result.stack.x).toBe(7); // 10 - 3
        expect(result.stack.y).toBe(0); // Old Z (was 0)
        expect(result.stack.z).toBe(0); // Old T (was 0)
        expect(result.stack.t).toBe(0); // Filled from "infinity"
        expect(result.lastX).toBe(3);
      });

      it("should handle negative results", () => {
        let state = createInitialState();
        state = setX(state, 5);
        state = enter(state);
        state = setX(state, 8);

        const result = subtract(state);

        expect(result.stack.x).toBe(-3); // 5 - 8
        expect(result.stack.y).toBe(0); // Old Z (was 0)
        expect(result.stack.z).toBe(0); // Old T (was 0)
        expect(result.stack.t).toBe(0); // Filled from "infinity"
      });
    });

    describe("Multiplication", () => {
      it("should calculate Y * X and store in X", () => {
        let state = createInitialState();
        state = setX(state, 6);
        state = enter(state);
        state = setX(state, 7);

        const result = multiply(state);

        expect(result.stack.x).toBe(42); // 6 * 7
        expect(result.stack.y).toBe(0); // Old Z (was 0)
        expect(result.stack.z).toBe(0); // Old T (was 0)
        expect(result.stack.t).toBe(0); // Filled from "infinity"
        expect(result.lastX).toBe(7);
      });
    });

    describe("Division", () => {
      it("should calculate Y / X and store in X", () => {
        let state = createInitialState();
        state = setX(state, 15);
        state = enter(state);
        state = setX(state, 3);

        const result = divide(state);

        expect(result.stack.x).toBe(5); // 15 / 3
        expect(result.stack.y).toBe(0); // Old Z (was 0)
        expect(result.stack.z).toBe(0); // Old T (was 0)
        expect(result.stack.t).toBe(0); // Filled from "infinity"
        expect(result.lastX).toBe(3);
      });

      it("should handle decimal results", () => {
        let state = createInitialState();
        state = setX(state, 10);
        state = enter(state);
        state = setX(state, 3);

        const result = divide(state);

        expect(result.stack.x).toBeCloseTo(3.333333333333333); // 10 / 3
        expect(result.stack.y).toBe(0); // Old Z (was 0)
        expect(result.stack.z).toBe(0); // Old T (was 0)
        expect(result.stack.t).toBe(0); // Filled from "infinity"
      });

      it("should throw error on division by zero", () => {
        let state = createInitialState();
        state = setX(state, 5);
        state = enter(state);
        state = setX(state, 0);

        expect(() => divide(state)).toThrow(CalculatorError);
        expect(() => divide(state)).toThrow("Division by zero");
      });
    });
  });

  describe("Stack Drop Behavior in Math Operations", () => {
    it("should properly drop stack through multiple operations: 2, enter, 4, enter, 6, enter, 8, +, -, ×", () => {
      let state = createInitialState();

      // Build the stack: 2, enter, 4, enter, 6, enter, 8
      state = setX(state, 2);
      state = enter(state);
      // Stack: T=0, Z=0, Y=2, X=2

      state = setX(state, 4);
      state = enter(state);
      // Stack: T=0, Z=2, Y=4, X=4

      state = setX(state, 6);
      state = enter(state);
      // Stack: T=2, Z=4, Y=6, X=6

      state = setX(state, 8);
      // Stack: T=2, Z=4, Y=6, X=8

      // Addition: 6 + 8 = 14
      state = add(state);
      // Should be: T=0, Z=2, Y=4, X=14 (proper stack drop)
      expect(state.stack.x).toBe(14);
      expect(state.stack.y).toBe(4); // Old Z
      expect(state.stack.z).toBe(2); // Old T
      expect(state.stack.t).toBe(0); // Filled from "infinity"

      // Subtraction: 4 - 14 = -10
      state = subtract(state);
      // Should be: T=0, Z=0, Y=2, X=-10 (proper stack drop)
      expect(state.stack.x).toBe(-10);
      expect(state.stack.y).toBe(2); // Old Z
      expect(state.stack.z).toBe(0); // Old T
      expect(state.stack.t).toBe(0); // Filled from "infinity"

      // Multiplication: 2 × -10 = -20
      state = multiply(state);
      // Should be: T=0, Z=0, Y=0, X=-20 (proper stack drop)
      expect(state.stack.x).toBe(-20);
      expect(state.stack.y).toBe(0); // Old Z
      expect(state.stack.z).toBe(0); // Old T
      expect(state.stack.t).toBe(0); // Filled from "infinity"
    });

    it("should properly drop stack in addition operation", () => {
      let state = createInitialState();

      // Set up stack: T=10, Z=20, Y=30, X=40
      state = setX(state, 10);
      state = enter(state);
      state = setX(state, 20);
      state = enter(state);
      state = setX(state, 30);
      state = enter(state);
      state = setX(state, 40);

      // Addition: 30 + 40 = 70
      const result = add(state);

      expect(result.stack.x).toBe(70); // Result
      expect(result.stack.y).toBe(20); // Old Z
      expect(result.stack.z).toBe(10); // Old T
      expect(result.stack.t).toBe(0); // Filled from "infinity"
      expect(result.lastX).toBe(40); // Consumed X
    });

    it("should properly drop stack in subtraction operation", () => {
      let state = createInitialState();

      // Set up stack: T=10, Z=20, Y=30, X=5
      state = setX(state, 10);
      state = enter(state);
      state = setX(state, 20);
      state = enter(state);
      state = setX(state, 30);
      state = enter(state);
      state = setX(state, 5);

      // Subtraction: 30 - 5 = 25
      const result = subtract(state);

      expect(result.stack.x).toBe(25); // Result
      expect(result.stack.y).toBe(20); // Old Z
      expect(result.stack.z).toBe(10); // Old T
      expect(result.stack.t).toBe(0); // Filled from "infinity"
      expect(result.lastX).toBe(5); // Consumed X
    });

    it("should properly drop stack in multiplication operation", () => {
      let state = createInitialState();

      // Set up stack: T=1, Z=2, Y=3, X=4
      state = setX(state, 1);
      state = enter(state);
      state = setX(state, 2);
      state = enter(state);
      state = setX(state, 3);
      state = enter(state);
      state = setX(state, 4);

      // Multiplication: 3 * 4 = 12
      const result = multiply(state);

      expect(result.stack.x).toBe(12); // Result
      expect(result.stack.y).toBe(2); // Old Z
      expect(result.stack.z).toBe(1); // Old T
      expect(result.stack.t).toBe(0); // Filled from "infinity"
      expect(result.lastX).toBe(4); // Consumed X
    });

    it("should properly drop stack in division operation", () => {
      let state = createInitialState();

      // Set up stack: T=5, Z=10, Y=20, X=4
      state = setX(state, 5);
      state = enter(state);
      state = setX(state, 10);
      state = enter(state);
      state = setX(state, 20);
      state = enter(state);
      state = setX(state, 4);

      // Division: 20 / 4 = 5
      const result = divide(state);

      expect(result.stack.x).toBe(5); // Result
      expect(result.stack.y).toBe(10); // Old Z
      expect(result.stack.z).toBe(5); // Old T
      expect(result.stack.t).toBe(0); // Filled from "infinity"
      expect(result.lastX).toBe(4); // Consumed X
    });
  });

  describe("Error Handling", () => {
    it("should create proper CalculatorError instances", () => {
      try {
        let state = createInitialState();
        state = setX(state, 5);
        state = enter(state);
        state = setX(state, 0);
        divide(state);
      } catch (error) {
        expect(error).toBeInstanceOf(CalculatorError);
        expect(error).toHaveProperty("code", "DIVISION_BY_ZERO");
        expect(error).toHaveProperty("message", "Division by zero");
      }
    });
  });

  describe("State Immutability", () => {
    it("should never mutate the original state", () => {
      const originalState = createInitialState();
      const originalStackCopy = { ...originalState.stack };

      // Perform various operations
      setX(originalState, 42);
      enter(originalState);
      swap(originalState);
      drop(originalState);
      clear(originalState);

      // Original state should be unchanged
      expect(originalState.stack).toEqual(originalStackCopy);
    });
  });
});
