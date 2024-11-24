import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";

interface TimerProps {
  initialMinutes: number;
}

export const Timer = ({ initialMinutes }: TimerProps) => {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <Card>
      <CardContent className="flex items-center gap-2 p-4">
        <Clock className="h-4 w-4" />
        <span className="font-mono text-xl">
          {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
        </span>
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="px-3 py-1 text-sm rounded-full bg-primary text-primary-foreground"
        >
          {isRunning ? "Pause" : "Start"}
        </button>
      </CardContent>
    </Card>
  );
};