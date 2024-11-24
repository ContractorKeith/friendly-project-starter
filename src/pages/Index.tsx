import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Timer } from "@/components/Timer";
import { MeetingSection } from "@/components/MeetingSection";
import { SegueInput } from "@/components/SegueInput";
import { ScorecardReview } from "@/components/ScorecardReview";
import { RockReview } from "@/components/RockReview";
import { Headlines } from "@/components/Headlines";
import { TodoList } from "@/components/TodoList";
import { IDSSection } from "@/components/IDSSection";
import { MeetingConclusion } from "@/components/MeetingConclusion";
import { TodoDashboard } from "@/components/individual/TodoDashboard";
import { RocksDashboard } from "@/components/individual/RocksDashboard";
import { ScorecardDashboard } from "@/components/individual/ScorecardDashboard";
import { IssuesDashboard } from "@/components/individual/IssuesDashboard";
import { useState } from "react";

const Index = () => {
  const [meetingProgress, setMeetingProgress] = useState(0);

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Level 10 Meeting</h1>
          <Timer initialMinutes={90} onProgressChange={setMeetingProgress} />
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
            <h2 className="text-2xl font-bold">Meeting Dashboard</h2>
            <SegueInput />
            <ScorecardReview />
            <RockReview />
            <Headlines />
            <TodoList />
            <IDSSection />
            <MeetingConclusion />
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Individual Dashboard</h2>
            <TodoDashboard />
            <RocksDashboard />
            <ScorecardDashboard />
            <IssuesDashboard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;