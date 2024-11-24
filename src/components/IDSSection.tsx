import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { useState } from "react";

export const IDSSection = () => {
  const [issue, setIssue] = useState("");

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">IDS (60 min)</CardTitle>
        <MessageSquare className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Add an issue to discuss..."
            value={issue}
            onChange={(e) => setIssue(e.target.value)}
          />
          <Button onClick={() => setIssue("")}>Add Issue</Button>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">No issues added yet</p>
        </div>
      </CardContent>
    </Card>
  );
};