import { useState } from "react";
import { Button } from "./components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Display } from "./components/Display";
import { useRPNCalculator } from "./hooks/useRPNCalculator";

function App() {
  // Use the RPN calculator hook
  const calculator = useRPNCalculator();

  // Input state for current number being typed (UI concern)
  const [inputValue, setInputValue] = useState("");
  const [isInputMode, setIsInputMode] = useState(false);
  const [shouldLiftOnNextInput, setShouldLiftOnNextInput] = useState(false);

  // Handler for number button clicks
  const handleNumberClick = (digit: string) => {
    // If we should lift the stack on next input (after an operation), do it now
    if (shouldLiftOnNextInput && !isInputMode) {
      calculator.enterValue(); // Lift the stack
      setShouldLiftOnNextInput(false);
    }

    // Prevent multiple leading zeros (except for decimal cases)
    if (digit === "0" && inputValue === "0") {
      return;
    }

    let newInputValue: string;
    // If inputValue is "0" and we're adding a non-zero digit, replace the zero
    if (inputValue === "0" && digit !== "0") {
      newInputValue = digit;
    } else {
      newInputValue = inputValue + digit;
    }

    setInputValue(newInputValue);
    setIsInputMode(true);

    // Immediately update the X register as per the plan
    const numericValue = parseFloat(newInputValue);
    if (!isNaN(numericValue)) {
      calculator.setXRegister(numericValue);
    }
  };

  // Handler for decimal point
  const handleDecimalClick = () => {
    if (!inputValue.includes(".")) {
      // If we should lift the stack on next input (after an operation), do it now
      if (shouldLiftOnNextInput && !isInputMode) {
        calculator.enterValue(); // Lift the stack
        setShouldLiftOnNextInput(false);
      }

      const newInputValue = inputValue === "" ? "0." : inputValue + ".";
      setInputValue(newInputValue);
      setIsInputMode(true);

      // Immediately update the X register
      const numericValue = parseFloat(newInputValue);
      if (!isNaN(numericValue)) {
        calculator.setXRegister(numericValue);
      }
    }
  };

  // Handler for Enter button (Push operation)
  const handleEnterClick = () => {
    if (isInputMode && inputValue !== "") {
      const numericValue = parseFloat(inputValue);

      // Only push if the value is valid (not NaN)
      if (!isNaN(numericValue)) {
        // X register is already set, just perform enter operation
        calculator.enterValue();

        // Clear input and exit input mode
        setInputValue("");
        setIsInputMode(false);
        setShouldLiftOnNextInput(false); // Enter resets this flag
      }
    } else if (!isInputMode) {
      // If not in input mode but Enter is pressed, duplicate X register (lift stack)
      calculator.enterValue();
      setShouldLiftOnNextInput(false);
    }
  };

  // Handler for addition operation
  const handleAdditionClick = () => {
    // Perform the addition operation
    calculator.addNumbers();

    // Clear input state and set flag to lift stack on next input
    setInputValue("");
    setIsInputMode(false);
    setShouldLiftOnNextInput(true);
  };

  // Handler for subtraction operation
  const handleSubtractionClick = () => {
    // Perform the subtraction operation
    calculator.subtractNumbers();

    // Clear input state and set flag to lift stack on next input
    setInputValue("");
    setIsInputMode(false);
    setShouldLiftOnNextInput(true);
  };

  // Handler for multiplication operation
  const handleMultiplicationClick = () => {
    // Perform the multiplication operation
    calculator.multiplyNumbers();

    // Clear input state and set flag to lift stack on next input
    setInputValue("");
    setIsInputMode(false);
    setShouldLiftOnNextInput(true);
  };

  // Handler for division operation
  const handleDivisionClick = () => {
    // Perform the division operation
    calculator.divideNumbers();

    // Clear input state and set flag to lift stack on next input
    setInputValue("");
    setIsInputMode(false);
    setShouldLiftOnNextInput(true);
  };

  // Handler for swap operation
  const handleSwapClick = () => {
    // Perform the swap operation (exchanges X and Y registers)
    calculator.swapXY();

    // When swap is performed, we should exit input mode to show the updated X register
    // This ensures the display reflects the swapped value immediately
    setInputValue("");
    setIsInputMode(false);
    setShouldLiftOnNextInput(true); // After swap, next input should lift the stack
  };

  // Handler for drop operation
  const handleDropClick = () => {
    // Perform the drop operation (removes X register, pulls stack down)
    calculator.dropX();

    // When drop is performed, we should exit input mode to show the updated X register
    // This ensures the display reflects the dropped value immediately
    setInputValue("");
    setIsInputMode(false);
    setShouldLiftOnNextInput(true); // After drop, next input should lift the stack
  };

  // Handler for clear operation
  const handleClearClick = () => {
    // Perform the clear operation (clears entire stack and resets)
    calculator.clearStack();

    // Clear input state and reset all input-related flags
    setInputValue("");
    setIsInputMode(false);
    setShouldLiftOnNextInput(false); // After clear, we start fresh
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            RPN Calculator
          </CardTitle>
          <CardDescription className="text-center">
            Reverse Polish Notation Calculator
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Display Area */}
          <Display
            stack={calculator.stack}
            inputValue={inputValue}
            isInputMode={isInputMode}
          />

          {/* Button Grid */}
          <div className="grid grid-cols-5 gap-2">
            {/* Row 1: Stack Operations */}
            <Button
              variant="outline"
              className="text-sm"
              onClick={handleSwapClick}
            >
              Swap
            </Button>
            <Button
              variant="outline"
              className="text-sm"
              onClick={handleDropClick}
            >
              Drop
            </Button>
            <Button
              variant="outline"
              className="text-sm"
              onClick={handleClearClick}
            >
              Clear
            </Button>
            <Button variant="outline" className="text-sm">
              Last X
            </Button>
            <Button variant="destructive" className="text-sm">
              ⌫
            </Button>
          </div>

          {/* Number and Operation Grid */}
          <div className="grid grid-cols-4 gap-2">
            {/* Row 1: Numbers and Division */}
            <Button variant="secondary" onClick={() => handleNumberClick("7")}>
              7
            </Button>
            <Button variant="secondary" onClick={() => handleNumberClick("8")}>
              8
            </Button>
            <Button variant="secondary" onClick={() => handleNumberClick("9")}>
              9
            </Button>
            <Button
              variant="default"
              className="bg-orange-500 hover:bg-orange-600"
              onClick={handleDivisionClick}
            >
              ÷
            </Button>

            {/* Row 2: Numbers and Multiplication */}
            <Button variant="secondary" onClick={() => handleNumberClick("4")}>
              4
            </Button>
            <Button variant="secondary" onClick={() => handleNumberClick("5")}>
              5
            </Button>
            <Button variant="secondary" onClick={() => handleNumberClick("6")}>
              6
            </Button>
            <Button
              variant="default"
              className="bg-orange-500 hover:bg-orange-600"
              onClick={handleMultiplicationClick}
            >
              ×
            </Button>

            {/* Row 3: Numbers and Subtraction */}
            <Button variant="secondary" onClick={() => handleNumberClick("1")}>
              1
            </Button>
            <Button variant="secondary" onClick={() => handleNumberClick("2")}>
              2
            </Button>
            <Button variant="secondary" onClick={() => handleNumberClick("3")}>
              3
            </Button>
            <Button
              variant="default"
              className="bg-orange-500 hover:bg-orange-600"
              onClick={handleSubtractionClick}
            >
              −
            </Button>

            {/* Row 4: Zero, Decimal, Addition */}
            <Button
              variant="secondary"
              className="col-span-2"
              onClick={() => handleNumberClick("0")}
            >
              0
            </Button>
            <Button variant="secondary" onClick={handleDecimalClick}>
              .
            </Button>
            <Button
              variant="default"
              className="bg-orange-500 hover:bg-orange-600"
              onClick={handleAdditionClick}
            >
              +
            </Button>

            {/* Row 5: Enter Button */}
            <Button
              variant="default"
              className="col-span-4 bg-blue-600 hover:bg-blue-700 font-semibold"
              onClick={handleEnterClick}
            >
              Enter
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
