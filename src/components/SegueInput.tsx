import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

export const SegueInput = () => {
  const [wins, setWins] = useState("");

  const handleSubmit = () => {
    // TODO: Implement win logging functionality
    console.log("Win logged:", wins);
    setWins("");
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Segue (5 min)</CardTitle>
        <Users className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Share your personal or business wins..."
          value={wins}
          onChange={(e) => setWins(e.target.value)}
          className="min-h-[100px]"
        />
        <Button onClick={handleSubmit}>Log Win</Button>
      </CardContent>
    </Card>
  );
};