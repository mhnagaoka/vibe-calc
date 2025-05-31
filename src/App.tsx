import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Project setup complete! ✨
            </p>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">
                ✅ Vite + React + TypeScript
              </p>
              <p className="text-xs text-muted-foreground">
                ✅ Tailwind CSS v4
              </p>
              <p className="text-xs text-muted-foreground">
                ✅ ShadCN UI Components
              </p>
            </div>
          </div>
          <Button className="w-full" variant="default">
            Ready to Build Calculator
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
