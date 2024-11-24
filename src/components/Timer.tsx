import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

interface TimerProps {
  initialMinutes: number;
  onProgressChange: (progress: number) => void;
}

export const Timer = ({ initialMinutes, onProgressChange }: TimerProps) => {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          const newTime = time - 1;
          const progress = ((initialMinutes * 60 - newTime) / (initialMinutes * 60)) * 100;
          onProgressChange(progress);
          return newTime;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, initialMinutes, onProgressChange]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-4">
        <Clock className="h-5 w-5 text-muted-foreground" />
        <span className="font-mono text-2xl">
          {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
        </span>
        <Button
          variant={isRunning ? "destructive" : "default"}
          onClick={() => setIsRunning(!isRunning)}
        >
          {isRunning ? "Pause" : "Start"}
        </Button>
      </CardContent>
    </Card>
  );
};