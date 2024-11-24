import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Newspaper } from "lucide-react";

export const Headlines = () => {
  const [headline, setHeadline] = useState("");

  const handleSubmit = () => {
    // TODO: Implement headline logging functionality
    console.log("Headline logged:", headline);
    setHeadline("");
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Headlines (5 min)</CardTitle>
        <Newspaper className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Add a customer or employee headline..."
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
          />
          <Button onClick={handleSubmit}>Add</Button>
        </div>
      </CardContent>
    </Card>
  );
};