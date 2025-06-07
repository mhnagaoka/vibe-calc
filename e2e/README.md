# RPN Calculator E2E Tests

This directory contains comprehensive end-to-end tests for the RPN Calculator using Playwright.

## Test Structure

### Core Functionality Tests (`example.spec.ts`)
- **UI Elements**: Verifies all calculator buttons and display components are visible and accessible
- **Basic Arithmetic**: Tests addition, subtraction, multiplication, and division operations
- **Decimal Numbers**: Validates decimal point input and calculations
- **Stack Operations**: Tests Enter, Swap, Drop, Clear, and Last X operations
- **Complex Calculations**: Multi-step calculations combining various operations
- **Input Handling**: Backspace functionality and input mode visual feedback
- **Mobile Support**: Tests calculator functionality on mobile viewports
- **Performance**: Rapid button clicking stress tests

### Error Handling Tests (`error-handling.spec.ts`)
- **Division by Zero**: Ensures graceful handling without state corruption
- **Edge Cases**: Empty stack operations, insufficient operands
- **Input Validation**: Multiple decimal points, empty input backspace
- **Large Numbers**: Very large calculation results
- **Negative Results**: Subtraction resulting in negative numbers
- **Fractional Results**: Division resulting in decimal fractions
- **Error Recovery**: Calculator functionality after errors
- **Rapid Operations**: Race condition testing

## Test Coverage

### Desktop and Mobile
All tests run on both Desktop Chrome and Mobile Chrome viewports to ensure responsive design compatibility.

### Core Workflows Covered
1. **Number Entry**: Typing numbers, decimal points, zero handling
2. **Stack Management**: Enter, Swap, Drop, Clear operations
3. **Arithmetic Operations**: +, -, ×, ÷ with proper RPN semantics
4. **Advanced Features**: Last X recall, backspace editing
5. **Error Scenarios**: Division by zero, invalid operations
6. **Edge Cases**: Empty stacks, large numbers, negative results

### Total Test Count: 56 tests
- 34 core functionality tests (17 × 2 browsers)
- 22 error handling tests (11 × 2 browsers)

## Running Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run with visual browser (headed mode)
npm run test:e2e:headed

# Run with Playwright UI for debugging
npm run test:e2e:ui

# Run specific test file
npx playwright test example
npx playwright test error-handling
```

## Test Configuration

Tests are configured to:
- Run against development server at `http://localhost:5173`
- Capture screenshots on failure
- Record videos for failed tests
- Generate trace files for debugging
- Timeout after 30 seconds per test

## Coverage Summary

✅ **Complete coverage of all planned calculator features**
✅ **Error handling and edge cases**
✅ **Mobile responsiveness verification**
✅ **Performance and stress testing**
✅ **Visual feedback validation**
✅ **Cross-browser compatibility (Desktop + Mobile Chrome)**

All tests passing ensures the RPN calculator meets the requirements specified in the development plan and provides a robust, error-free user experience.
