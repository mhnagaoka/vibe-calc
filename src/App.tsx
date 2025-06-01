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

function App() {
  // RPN Calculator State
  const [stack, setStack] = useState({
    t: 0,
    z: 0,
    y: 0,
    x: 0,
  });

  // Input state for current number being typed
  const [inputValue, setInputValue] = useState("");
  const [isInputMode, setIsInputMode] = useState(false);

  // Handler for number button clicks
  const handleNumberClick = (digit: string) => {
    setInputValue((prev) => prev + digit);
    setIsInputMode(true);
  };

  // Handler for decimal point
  const handleDecimalClick = () => {
    if (!inputValue.includes(".")) {
      setInputValue((prev) => (prev === "" ? "0." : prev + "."));
      setIsInputMode(true);
    }
  };

  // Suppress unused variable warning for now - will be used in next steps
  void setStack;

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
            stack={stack}
            inputValue={inputValue}
            isInputMode={isInputMode}
          />

          {/* Button Grid */}
          <div className="grid grid-cols-5 gap-2">
            {/* Row 1: Stack Operations */}
            <Button variant="outline" className="text-sm">
              Swap
            </Button>
            <Button variant="outline" className="text-sm">
              Drop
            </Button>
            <Button variant="outline" className="text-sm">
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
            >
              +
            </Button>

            {/* Row 5: Enter Button */}
            <Button
              variant="default"
              className="col-span-4 bg-blue-600 hover:bg-blue-700 font-semibold"
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
