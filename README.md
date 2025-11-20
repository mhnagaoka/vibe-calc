# Vibe Calc - RPN Calculator

A modern web-based **Reverse Polish Notation (RPN) Calculator** built with React, TypeScript, Tailwind CSS, and ShadCN components. This project showcases "vibe coding" - developing a complete application through collaborative interaction with AI while learning frontend development.

## 🚀 [Try the Live Demo](https://mau.codes/vibe-calc/](https://mhnagaoka.github.io/vibe-calc/)

Experience the calculator in action before diving into the details!

![RPN Calculator](./docs/rpn-calc-layout.png)

## ✨ Features

### Currently Implemented

- ✅ **Number Input**: Full numeric input with decimal point support
- ✅ **RPN Stack Display**: Shows all 4 stack registers (T, Z, Y, X)
- ✅ **Enter Operation**: Pushes values onto the stack with proper stack lifting
- ✅ **Math Operations**: Addition, subtraction, multiplication, division with proper RPN semantics
- ✅ **Stack Operations**: Swap, drop, clear stack, last X recall
- ✅ **Backspace**: Remove digits from current input with proper X register handling
- ✅ **Core RPN Engine**: Pure TypeScript implementation with comprehensive tests
- ✅ **Modern UI**: Built with Tailwind CSS and ShadCN components

### Coming Soon

- 🔄 **Error Handling**: Enhanced error messages and edge case handling
- 🔄 **Keyboard Support**: Full keyboard navigation and shortcuts
- 🔄 **Mobile Optimization**: Touch-friendly responsive design improvements
- ⏭️ **Clear X**: Core logic implemented but UI intentionally skipped (may reconsider in future)

## 🧮 What is RPN?

**Reverse Polish Notation (RPN)** is a mathematical notation where operators follow their operands. Instead of typing `3 + 4 =`, you enter:

1. **Type 3** → X register shows 3
2. **Press Enter** → Stack lifts, Y gets 3, X stays 3
3. **Type 4** → X becomes 4, Y remains 3
4. **Press +** → Calculates 3 + 4 = 7

### Stack Registers

- **X**: Current/top value (most recent)
- **Y**: Second value
- **Z**: Third value
- **T**: Fourth value

## 🎯 Why Choose RPN?

RPN calculators offer several advantages over traditional infix calculators:

### 1. **No Parentheses Needed**

RPN eliminates the need for parentheses in complex calculations:

- **Regular**: `(3 + 4) × (5 + 6) =`
- **RPN**: `3 4 + 5 6 + ×`

### 2. **Natural Problem-Solving Flow**

RPN follows how you naturally solve math problems step by step:

- Calculate intermediate results as you go
- Each step builds on the previous result
- No need to remember operator precedence rules

### 3. **More Efficient Entry**

For chain calculations, RPN requires fewer keystrokes:

- **Regular**: `15 + 25 = 40, then 40 × 3 = 120`
- **RPN**: `15 25 + 3 ×` (no equals button needed)

### 4. **Complete Visibility**

The 4-register stack (T, Z, Y, X) gives you:

- Full visibility of your calculation state
- Easy reuse of previous results
- Better understanding of intermediate values

### 5. **Fewer Calculation Errors**

RPN reduces mistakes because:

- No ambiguity about order of operations
- Immediate feedback on intermediate results
- Stack operations (swap, drop, last X) help correct errors quickly

### 6. **Professional Heritage**

RPN is the preferred choice of:

- Engineers and scientists
- Financial professionals
- Anyone doing complex calculations regularly
- Users of classic HP calculators

### 7. **Consistent Logic**

Every RPN operation follows the same simple pattern:

1. Enter operands onto the stack
2. Press the operator
3. Result appears immediately

The trade-off is an initial learning curve, but users who master RPN often find it much more efficient and intuitive for their calculation workflows!

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd vibe-calc

# Install dependencies
npm install

# Start development server
npm run dev
```

The calculator will be available at `http://localhost:5173`

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Unit Testing (Vitest)
npm run test         # Run unit tests in watch mode
npm run test:run     # Run unit tests once
npm run test:coverage # Run unit tests with coverage (watch mode)
npm run test:coverage:run # Run unit tests with coverage once (CI)

# E2E Testing (Playwright)
npm run test:e2e     # Run E2E tests with Playwright
npm run test:e2e:headed # Run E2E tests with browser UI
npm run test:e2e:ui  # Run E2E tests with Playwright UI
```

## 🏗️ Architecture

### Project Structure

```
src/
├── components/          # React components
│   ├── Display.tsx     # Stack display component
│   └── ui/             # ShadCN UI components
├── hooks/              # Custom React hooks
│   └── useRPNCalculator.ts
├── lib/                # Core logic
│   ├── rpn-calculator.ts   # Pure RPN engine
│   └── utils.ts       # Utility functions
└── test/              # Test files
    ├── rpn-calculator.test.ts
    └── workflow.test.ts
```

### Key Principles

- **Separation of Concerns**: Pure calculator logic separate from UI
- **Immutable State**: All operations return new state objects
- **Type Safety**: Full TypeScript coverage
- **Comprehensive Testing**: Unit tests for all calculator operations
- **Component-Based**: Modular React components

## 🧪 Testing

The project includes comprehensive testing at multiple levels:

### Unit Tests

- Core RPN calculator operations (enter, setX, stack lifting)
- Stack management operations (swap, drop, clear, last X)
- Math operations (addition, subtraction, multiplication, division)
- Input handling (backspace, number entry, decimal points)
- Error handling (division by zero, invalid operations)
- Real-world calculation workflows

### End-to-End Tests

- Complete calculator workflows with Playwright
- UI interaction testing (button clicks, display updates)
- Cross-browser compatibility (Desktop Chrome, Mobile Chrome)
- Error scenario testing

```bash
# Run unit tests
npm run test:run

# Run with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Run E2E tests with browser UI visible
npm run test:e2e:headed
```

## 🧪 Testing

This project includes comprehensive testing with both unit tests and end-to-end tests, ensuring robust functionality and preventing regressions.

### Test Coverage

- **32 unit tests** covering all RPN calculator engine functions
- **56 end-to-end tests** across desktop and mobile viewports
- **76.75% line coverage** of core calculator logic
- **Continuous Integration** runs all tests before deployment

### Unit Tests (Vitest + React Testing Library)

- **Core RPN Operations**: Enter, setX, stack lifting, register management
- **Stack Operations**: Swap, drop, clear, last X functionality
- **Math Operations**: Addition, subtraction, multiplication, division with RPN semantics
- **Input Handling**: Number entry, decimal points, backspace behavior
- **Error Scenarios**: Division by zero, invalid operations, edge cases
- **Workflow Testing**: Real-world calculation sequences

### End-to-End Tests (Playwright)

- **Complete Workflows**: Full calculator operation from UI perspective
- **Cross-Browser**: Desktop Chrome and Mobile Chrome compatibility
- **UI Interaction**: Button clicks, display updates, visual feedback
- **Error Handling**: Graceful error recovery and user feedback
- **Performance**: Rapid input stress testing and race condition validation

### Running Tests

```bash
# Unit tests
npm run test              # Watch mode for development
npm run test:run          # Run once
npm run test:coverage:run # With coverage report

# E2E tests
npm run test:e2e         # Headless mode
npm run test:e2e:headed  # With browser UI
npm run test:e2e:ui      # Playwright debug interface
```

## 🎨 Tech Stack

- **Frontend**: React 19.1.0 with TypeScript
- **Styling**: Tailwind CSS 4.1.8 + ShadCN components
- **Build Tool**: Vite 6.3.5
- **Testing**: Vitest + React Testing Library (unit tests) + Playwright (E2E tests)
- **Code Quality**: ESLint + TypeScript ESLint

## 📋 Development Plan

This project follows an incremental development approach. See the complete [development plan](./docs/plan.md) for detailed progress tracking.

### Phase 1: Foundation ✅ Completed

- [x] Project setup with React + Vite + TypeScript
- [x] Tailwind CSS + ShadCN integration
- [x] Basic calculator layout
- [x] Number input and display
- [x] Enter operation with stack management

### Phase 2: Math Operations ✅ Completed

- [x] Addition operation
- [x] Subtraction operation
- [x] Multiplication operation
- [x] Division operation

### Phase 3: Stack Operations ✅ Completed

- [x] Swap, Drop, Clear operations
- [x] Last X functionality
- [x] Backspace operation

### Phase 4: Testing & CI ✅ Largely Completed

- [x] Unit testing setup with Vitest (32 tests, 76.75% coverage)
- [x] E2E testing setup with Playwright (56 tests across desktop/mobile)
- [x] GitHub Actions CI pipeline with automated testing
- [x] Test separation configuration (unit vs E2E tests)
- [x] Coverage reporting with @vitest/coverage-v8
- [x] Clear X operation (core logic completed, UI intentionally skipped)

### Phase 5: Enhancement & Polish 🔄 Future

- [ ] Enhanced UI/UX and visual design improvements
- [ ] Keyboard support and navigation shortcuts
- [ ] Mobile optimization and touch interactions
- [ ] Advanced error handling and user feedback
- [ ] Performance optimizations

## 🤝 Contributing

This project is developed using "vibe coding" methodology - collaborative development with AI assistance. The development process is documented in the [plan.md](./docs/plan.md) file.

### Development Workflow

1. Each feature is implemented as a separate step
2. Tests are written alongside implementation
3. Progress is tracked using checkboxes in the plan
4. Code reviews focus on maintaining separation of concerns

## 📚 Learning Resources

- [RPN Calculator Basics](./docs/plan.md#rpn-basics)
- [Project Setup Guide](./docs/project-setup.instructions.md)
- [Development Plan](./docs/plan.md)

## 📄 License

This project is developed for educational purposes as part of learning frontend development through "vibe coding".

## 🔗 Links

- **Live Demo**: [https://mau.codes/vibe-calc/](https://mau.codes/vibe-calc/)
- **Documentation**: [./docs/](./docs/)
- **Issues**: Please refer to the development plan for current status

---

Built with ❤️ using React, TypeScript, and "vibe coding" methodology.
