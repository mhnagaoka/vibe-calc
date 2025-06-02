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
      expect(droppedState.lastX).toBe(4); // Stores dropped value
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
    it("should restore last X value with stack lift", () => {
      let state = createInitialState();
      state = setX(state, 5);
      state = enter(state);
      state = setX(state, 3);
      state = drop(state); // This sets lastX to 3

      const restoredState = lastX(state);

      expect(restoredState.stack.x).toBe(3); // Restored lastX
      expect(restoredState.stack.y).toBe(5); // Lifted
      expect(restoredState.stack.z).toBe(0); // Lifted
      expect(restoredState.stack.t).toBe(0); // Lifted
    });

    it("should do nothing if no lastX value exists", () => {
      const state = createInitialState();
      const unchangedState = lastX(state);

      expect(unchangedState).toEqual(state);
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
        expect(result.stack.y).toBe(0); // Stack drops
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
        expect(result.lastX).toBe(3);
      });

      it("should handle negative results", () => {
        let state = createInitialState();
        state = setX(state, 5);
        state = enter(state);
        state = setX(state, 8);

        const result = subtract(state);

        expect(result.stack.x).toBe(-3); // 5 - 8
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
        expect(result.lastX).toBe(3);
      });

      it("should handle decimal results", () => {
        let state = createInitialState();
        state = setX(state, 10);
        state = enter(state);
        state = setX(state, 3);

        const result = divide(state);

        expect(result.stack.x).toBeCloseTo(3.333333333333333); // 10 / 3
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
