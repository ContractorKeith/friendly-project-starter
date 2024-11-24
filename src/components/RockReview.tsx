import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Target } from "lucide-react";

export const RockReview = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Rock Review (5 min)</CardTitle>
        <Target className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Q1 Market Expansion</span>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <span>Process Automation</span>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <span>Team Training Program</span>
            <Switch />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};