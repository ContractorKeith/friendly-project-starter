import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Flag } from "lucide-react";

interface Issue {
  id: number;
  title: string;
  priority: "low" | "medium" | "high";
}

export const IssuesDashboard = () => {
  const issues: Issue[] = [
    { id: 1, title: "System Performance", priority: "high" },
    { id: 2, title: "Training Documentation", priority: "medium" },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">My Issues</CardTitle>
        <Flag className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input placeholder="Add new issue..." className="flex-1" />
            <Select defaultValue="medium">
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
            <Button>Add</Button>
          </div>
          <div className="space-y-2">
            {issues.map((issue) => (
              <div key={issue.id} className="flex items-center justify-between border-b pb-2">
                <span>{issue.title}</span>
                <span className={`text-sm ${
                  issue.priority === "high" 
                    ? "text-red-500" 
                    : issue.priority === "medium" 
                    ? "text-yellow-500" 
                    : "text-green-500"
                }`}>
                  {issue.priority.charAt(0).toUpperCase() + issue.priority.slice(1)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};