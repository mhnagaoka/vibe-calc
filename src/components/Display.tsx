interface DisplayProps {
  stack: {
    t: number;
    z: number;
    y: number;
    x: number;
  };
  inputValue?: string;
  isInputMode?: boolean;
}

export function Display({
  stack,
  inputValue = "",
  isInputMode = false,
}: DisplayProps) {
  // Determine what to show in the X register
  const xDisplayValue = isInputMode && inputValue !== "" ? inputValue : stack.x;

  // Format numbers for display (remove unnecessary decimals)
  const formatNumber = (num: number): string => {
    if (num === 0) return "0";
    return num.toString();
  };

  return (
    <div className="bg-secondary/20 rounded-lg p-3 min-h-[140px] border">
      <div className="text-xs text-muted-foreground mb-2">Stack:</div>
      <div className="space-y-1 font-mono">
        <div className="text-sm text-muted-foreground flex justify-between">
          <span>T:</span>
          <span>{formatNumber(stack.t)}</span>
        </div>
        <div className="text-sm text-muted-foreground flex justify-between">
          <span>Z:</span>
          <span>{formatNumber(stack.z)}</span>
        </div>
        <div className="text-sm text-muted-foreground flex justify-between">
          <span>Y:</span>
          <span>{formatNumber(stack.y)}</span>
        </div>
        <div className="text-xl font-bold flex justify-between">
          <span>X:</span>
          <span className={isInputMode ? "text-blue-600" : ""}>
            {isInputMode ? xDisplayValue : formatNumber(stack.x)}
          </span>
        </div>
      </div>
    </div>
  );
}
