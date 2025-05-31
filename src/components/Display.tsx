interface DisplayProps {
  stack: {
    t: number;
    z: number;
    y: number;
    x: number;
  };
}

export function Display({ stack }: DisplayProps) {
  return (
    <div className="bg-secondary/20 rounded-lg p-3 min-h-[140px] border">
      <div className="text-xs text-muted-foreground mb-2">Display:</div>
      <div className="space-y-1 font-mono">
        <div className="text-sm text-muted-foreground flex justify-between">
          <span>T:</span>
          <span>{stack.t}</span>
        </div>
        <div className="text-sm text-muted-foreground flex justify-between">
          <span>Z:</span>
          <span>{stack.z}</span>
        </div>
        <div className="text-sm text-muted-foreground flex justify-between">
          <span>Y:</span>
          <span>{stack.y}</span>
        </div>
        <div className="text-xl font-bold flex justify-between">
          <span>X:</span>
          <span>{stack.x}</span>
        </div>
      </div>
    </div>
  );
}
