import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface TimerProps {
  initialMinutes: number;
  onProgressChange: (progress: number) => void;
  segments: { name: string; duration: number }[];
}

export const Timer = ({ initialMinutes, onProgressChange, segments }: TimerProps) => {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [currentSegment, setCurrentSegment] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          const newTime = time - 1;
          const progress = ((initialMinutes * 60 - newTime) / (initialMinutes * 60)) * 100;
          onProgressChange(progress);

          // Check if current segment is complete
          const segmentEndTime = segments
            .slice(0, currentSegment + 1)
            .reduce((acc, seg) => acc + seg.duration * 60, 0);
          const totalElapsedTime = initialMinutes * 60 - newTime;

          if (totalElapsedTime >= segmentEndTime && currentSegment < segments.length - 1) {
            setCurrentSegment(curr => curr + 1);
            toast({
              title: `${segments[currentSegment].name} Complete`,
              description: `Moving to ${segments[currentSegment + 1].name}`,
            });
          }

          return newTime;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, initialMinutes, onProgressChange, segments, currentSegment, toast]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const currentSegmentName = segments[currentSegment]?.name || "Meeting Complete";

  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-4">
        <Clock className="h-5 w-5 text-muted-foreground" />
        <div className="flex flex-col">
          <span className="font-mono text-2xl">
            {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
          </span>
          <span className="text-sm text-muted-foreground">{currentSegmentName}</span>
        </div>
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