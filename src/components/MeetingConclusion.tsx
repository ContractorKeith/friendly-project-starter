import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Flag } from "lucide-react";

export const MeetingConclusion = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Conclusion (5 min)</CardTitle>
        <Flag className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">Meeting Rating (1-10)</label>
          <Input type="number" min="1" max="10" placeholder="Rate the meeting..." />
        </div>
        <div>
          <label className="text-sm font-medium">Cascading Messages</label>
          <Textarea placeholder="Add messages for other teams..." />
        </div>
      </CardContent>
    </Card>
  );
};