import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Timer } from "@/components/Timer";
import { SegueInput } from "@/components/SegueInput";
import { ScorecardReview } from "@/components/ScorecardReview";
import { RockReview } from "@/components/RockReview";
import { Headlines } from "@/components/Headlines";
import { TodoList } from "@/components/TodoList";
import { IDSSection } from "@/components/IDSSection";
import { MeetingConclusion } from "@/components/MeetingConclusion";
import { useRealtimeSync } from "@/hooks/useRealtimeSync";
import { useState } from "react";

const MEETING_SEGMENTS = [
  { name: "Segue", duration: 5 },
  { name: "Scorecard Review", duration: 5 },
  { name: "Rock Review", duration: 5 },
  { name: "Headlines", duration: 5 },
  { name: "ToDos", duration: 5 },
  { name: "IDS", duration: 60 },
  { name: "Conclude", duration: 5 }
];

const Index = () => {
  const [meetingProgress, setMeetingProgress] = useState(0);
  useRealtimeSync();

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Level 10 Meeting</h1>
          <Timer 
            initialMinutes={90} 
            onProgressChange={setMeetingProgress} 
            segments={MEETING_SEGMENTS}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Meeting Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={meetingProgress} className="w-full" />
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <SegueInput />
            <ScorecardReview />
            <RockReview />
            <Headlines />
            <TodoList />
            <IDSSection />
            <MeetingConclusion />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;