import { Button } from "./components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";

function App() {
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
          <div className="bg-secondary/20 rounded-lg p-3 min-h-[140px] border">
            <div className="text-xs text-muted-foreground mb-2">Display:</div>
            <div className="space-y-1 font-mono">
              <div className="text-sm text-muted-foreground flex justify-between">
                <span>T:</span>
                <span>0</span>
              </div>
              <div className="text-sm text-muted-foreground flex justify-between">
                <span>Z:</span>
                <span>0</span>
              </div>
              <div className="text-sm text-muted-foreground flex justify-between">
                <span>Y:</span>
                <span>0</span>
              </div>
              <div className="text-xl font-bold flex justify-between">
                <span>X:</span>
                <span>0</span>
              </div>
            </div>
          </div>

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
            <Button variant="secondary">7</Button>
            <Button variant="secondary">8</Button>
            <Button variant="secondary">9</Button>
            <Button
              variant="default"
              className="bg-orange-500 hover:bg-orange-600"
            >
              ÷
            </Button>

            {/* Row 2: Numbers and Multiplication */}
            <Button variant="secondary">4</Button>
            <Button variant="secondary">5</Button>
            <Button variant="secondary">6</Button>
            <Button
              variant="default"
              className="bg-orange-500 hover:bg-orange-600"
            >
              ×
            </Button>

            {/* Row 3: Numbers and Subtraction */}
            <Button variant="secondary">1</Button>
            <Button variant="secondary">2</Button>
            <Button variant="secondary">3</Button>
            <Button
              variant="default"
              className="bg-orange-500 hover:bg-orange-600"
            >
              −
            </Button>

            {/* Row 4: Zero, Decimal, Addition */}
            <Button variant="secondary" className="col-span-2">
              0
            </Button>
            <Button variant="secondary">.</Button>
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
