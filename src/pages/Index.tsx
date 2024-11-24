import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Timer } from "@/components/Timer";
import { MeetingSection } from "@/components/MeetingSection";
import { Clock, Users, Target, Newspaper, CheckSquare, MessageSquare } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Level 10 Meeting</h1>
          <Timer initialMinutes={90} />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <MeetingSection
            title="Segue"
            duration={5}
            icon={Users}
            description="Share personal and professional wins"
          />
          
          <MeetingSection
            title="Scorecard Review"
            duration={5}
            icon={Target}
            description="Review key metrics status"
          />
          
          <MeetingSection
            title="Rock Review"
            duration={5}
            icon={Target}
            description="Review quarterly goals progress"
          />
          
          <MeetingSection
            title="Headlines"
            duration={5}
            icon={Newspaper}
            description="Customer and employee updates"
          />
          
          <MeetingSection
            title="ToDos"
            duration={5}
            icon={CheckSquare}
            description="Review previous meeting tasks"
          />
          
          <MeetingSection
            title="IDS"
            duration={60}
            icon={MessageSquare}
            description="Identify, Discuss, Solve issues"
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Meeting Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={33} className="w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;