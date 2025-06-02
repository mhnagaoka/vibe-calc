import { useState, useCallback } from 'react';
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
  type CalculatorState,
  type RPNStack,
  type StackOperation,
  type MathOperation,
} from '../lib/rpn-calculator';

export interface UseRPNCalculatorReturn {
  // Current state
  stack: RPNStack;
  lastXValue?: number;
  
  // Stack operations
  enterValue: () => void;
  swapXY: () => void;
  dropX: () => void;
  clearStack: () => void;
  recallLastX: () => void;
  
  // Math operations
  addNumbers: () => void;
  subtractNumbers: () => void;
  multiplyNumbers: () => void;
  divideNumbers: () => void;
  
  // Utility functions
  setXRegister: (value: number) => void;
  performStackOp: (operation: StackOperation) => void;
  performMathOp: (operation: MathOperation) => void;
  
  // Reset calculator
  reset: () => void;
}

/**
 * React hook that provides RPN calculator functionality
 * 
 * This hook wraps the pure calculator engine and provides a React-friendly
 * interface for managing calculator state and operations.
 */
export function useRPNCalculator(): UseRPNCalculatorReturn {
  const [calculatorState, setCalculatorState] = useState<CalculatorState>(createInitialState);

  // Utility function to safely update calculator state
  const updateState = useCallback((updateFn: (state: CalculatorState) => CalculatorState) => {
    setCalculatorState(prevState => {
      try {
        return updateFn(prevState);
      } catch (error) {
        // For now, we'll log errors and return unchanged state
        // In a more sophisticated implementation, we might want to expose error state
        console.error('Calculator operation failed:', error);
        return prevState;
      }
    });
  }, []);

  // Stack operations
  const enterValue = useCallback(() => {
    updateState(enter);
  }, [updateState]);

  const swapXY = useCallback(() => {
    updateState(swap);
  }, [updateState]);

  const dropX = useCallback(() => {
    updateState(drop);
  }, [updateState]);

  const clearStack = useCallback(() => {
    updateState(clear);
  }, [updateState]);

  const recallLastX = useCallback(() => {
    updateState(lastX);
  }, [updateState]);

  // Math operations
  const addNumbers = useCallback(() => {
    updateState(add);
  }, [updateState]);

  const subtractNumbers = useCallback(() => {
    updateState(subtract);
  }, [updateState]);

  const multiplyNumbers = useCallback(() => {
    updateState(multiply);
  }, [updateState]);

  const divideNumbers = useCallback(() => {
    updateState(divide);
  }, [updateState]);

  // Utility functions
  const setXRegister = useCallback((value: number) => {
    updateState(state => setX(state, value));
  }, [updateState]);

  const performStackOp = useCallback((operation: StackOperation) => {
    updateState(state => {
      switch (operation) {
        case 'enter':
          return enter(state);
        case 'swap':
          return swap(state);
        case 'drop':
          return drop(state);
        case 'clear':
          return clear(state);
        default:
          throw new CalculatorError(`Unknown stack operation: ${operation as string}`, 'UNKNOWN_OPERATION');
      }
    });
  }, [updateState]);

  const performMathOp = useCallback((operation: MathOperation) => {
    updateState(state => {
      switch (operation) {
        case 'add':
          return add(state);
        case 'subtract':
          return subtract(state);
        case 'multiply':
          return multiply(state);
        case 'divide':
          return divide(state);
        default:
          throw new CalculatorError(`Unknown math operation: ${operation as string}`, 'UNKNOWN_OPERATION');
      }
    });
  }, [updateState]);

  // Reset calculator to initial state
  const reset = useCallback(() => {
    setCalculatorState(createInitialState());
  }, []);

  return {
    // Current state
    stack: calculatorState.stack,
    lastXValue: calculatorState.lastX,
    
    // Stack operations
    enterValue,
    swapXY,
    dropX,
    clearStack,
    recallLastX,
    
    // Math operations
    addNumbers,
    subtractNumbers,
    multiplyNumbers,
    divideNumbers,
    
    // Utility functions
    setXRegister,
    performStackOp,
    performMathOp,
    
    // Reset
    reset,
  };
}
