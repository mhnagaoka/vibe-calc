/**
 * Pure RPN Calculator Engine
 *
 * This module contains the core logic for RPN calculations without any UI dependencies.
 * All functions are pure and return new state objects rather than mutating existing state.
 */

// Core types
export interface RPNStack {
  t: number; // Fourth element (top-most in traditional stack view)
  z: number; // Third element
  y: number; // Second element
  x: number; // First element (bottom-most, most recent)
}

export interface CalculatorState {
  stack: RPNStack;
  lastX?: number; // For "Last X" functionality
}

// Operation types
export type StackOperation = "enter" | "swap" | "drop" | "clear";
export type MathOperation = "add" | "subtract" | "multiply" | "divide";

// Error types
export class CalculatorError extends Error {
  public code: string;
  
  constructor(message: string, code: string) {
    super(message);
    this.name = "CalculatorError";
    this.code = code;
  }
}

// Factory function to create initial calculator state
export function createInitialState(): CalculatorState {
  return {
    stack: {
      t: 0,
      z: 0,
      y: 0,
      x: 0,
    },
    lastX: undefined,
  };
}

// Stack manipulation functions

/**
 * Enter operation: duplicates X register to Y, lifts stack
 * This implements the behavior described in the plan where Enter
 * pushes the current X value to Y while keeping X unchanged
 */
export function enter(state: CalculatorState): CalculatorState {
  return {
    ...state,
    stack: {
      t: state.stack.z, // Old Z moves to T
      z: state.stack.y, // Old Y moves to Z
      y: state.stack.x, // X value duplicated to Y
      x: state.stack.x, // X remains unchanged
    },
  };
}

/**
 * Set X register with a new value (used when typing numbers)
 * This is separate from enter() to handle the typing behavior
 */
export function setX(state: CalculatorState, value: number): CalculatorState {
  return {
    ...state,
    stack: {
      ...state.stack,
      x: value,
    },
  };
}

/**
 * Swap operation: exchanges X and Y registers
 */
export function swap(state: CalculatorState): CalculatorState {
  return {
    ...state,
    stack: {
      ...state.stack,
      x: state.stack.y,
      y: state.stack.x,
    },
  };
}

/**
 * Drop operation: removes X register, pulls stack down
 */
export function drop(state: CalculatorState): CalculatorState {
  return {
    ...state,
    stack: {
      t: state.stack.t, // T stays the same (fills from "infinity")
      z: state.stack.t, // Z gets old T
      y: state.stack.z, // Y gets old Z
      x: state.stack.y, // X gets old Y
    },
    lastX: state.stack.x, // Store dropped value in lastX
  };
}

/**
 * Clear operation: resets entire stack to zeros
 */
export function clear(state: CalculatorState): CalculatorState {
  return {
    ...state,
    stack: {
      t: 0,
      z: 0,
      y: 0,
      x: 0,
    },
  };
}

/**
 * Last X operation: pushes the last X value back onto stack (with stack lift)
 */
export function lastX(state: CalculatorState): CalculatorState {
  if (state.lastX === undefined) {
    return state; // No last X value to restore
  }

  return {
    ...state,
    stack: {
      t: state.stack.z, // Lift stack
      z: state.stack.y,
      y: state.stack.x,
      x: state.lastX, // Restore last X
    },
  };
}

// Math operation functions

/**
 * Addition: Y + X -> X, stack drops
 */
export function add(state: CalculatorState): CalculatorState {
  const result = state.stack.y + state.stack.x;

  return {
    ...state,
    stack: {
      t: state.stack.t, // T stays the same
      z: state.stack.t, // Z gets T (fill from "infinity")
      y: state.stack.z, // Y gets old Z
      x: result, // X gets the result
    },
    lastX: state.stack.x, // Store the consumed X value
  };
}

/**
 * Subtraction: Y - X -> X, stack drops
 */
export function subtract(state: CalculatorState): CalculatorState {
  const result = state.stack.y - state.stack.x;

  return {
    ...state,
    stack: {
      t: state.stack.t,
      z: state.stack.t,
      y: state.stack.z,
      x: result,
    },
    lastX: state.stack.x,
  };
}

/**
 * Multiplication: Y * X -> X, stack drops
 */
export function multiply(state: CalculatorState): CalculatorState {
  const result = state.stack.y * state.stack.x;

  return {
    ...state,
    stack: {
      t: state.stack.t,
      z: state.stack.t,
      y: state.stack.z,
      x: result,
    },
    lastX: state.stack.x,
  };
}

/**
 * Division: Y / X -> X, stack drops
 * Throws error on division by zero
 */
export function divide(state: CalculatorState): CalculatorState {
  if (state.stack.x === 0) {
    throw new CalculatorError("Division by zero", "DIVISION_BY_ZERO");
  }

  const result = state.stack.y / state.stack.x;

  return {
    ...state,
    stack: {
      t: state.stack.t,
      z: state.stack.t,
      y: state.stack.z,
      x: result,
    },
    lastX: state.stack.x,
  };
}

// Generic operation dispatcher
export function performStackOperation(
  state: CalculatorState,
  operation: StackOperation
): CalculatorState {
  switch (operation) {
    case "enter":
      return enter(state);
    case "swap":
      return swap(state);
    case "drop":
      return drop(state);
    case "clear":
      return clear(state);
    default:
      throw new CalculatorError(
        `Unknown stack operation: ${operation}`,
        "UNKNOWN_OPERATION"
      );
  }
}

export function performMathOperation(
  state: CalculatorState,
  operation: MathOperation
): CalculatorState {
  switch (operation) {
    case "add":
      return add(state);
    case "subtract":
      return subtract(state);
    case "multiply":
      return multiply(state);
    case "divide":
      return divide(state);
    default:
      throw new CalculatorError(
        `Unknown math operation: ${operation}`,
        "UNKNOWN_OPERATION"
      );
  }
}
