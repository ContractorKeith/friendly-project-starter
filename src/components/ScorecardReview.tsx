import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Target } from "lucide-react";

export const ScorecardReview = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Scorecard Review (5 min)</CardTitle>
        <Target className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Revenue Target</span>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <span>Customer Satisfaction</span>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <span>Employee Engagement</span>
            <Switch />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};