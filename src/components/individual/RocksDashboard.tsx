import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Diamond } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRocks, useUpdateRock, useAddRock } from "@/hooks/useDashboardData";

export const RocksDashboard = () => {
  const { data: rocks, isLoading } = useRocks();
  const updateRock = useUpdateRock();
  const addRock = useAddRock();
  const [newRockTitle, setNewRockTitle] = useState("");

  const handleAddRock = () => {
    if (!newRockTitle.trim()) return;
    
    addRock.mutate({
      title: newRockTitle,
      onTrack: true,
      progress: 0,
    });
    
    setNewRockTitle("");
  };

  const handleOnTrackChange = (rockId: number, onTrack: boolean) => {
    updateRock.mutate({ id: rockId, onTrack });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">My Rocks</CardTitle>
        <Diamond className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex gap-2">
            <Input
              placeholder="Add new rock..."
              value={newRockTitle}
              onChange={(e) => setNewRockTitle(e.target.value)}
            />
            <Button onClick={handleAddRock}>Add Rock</Button>
          </div>

          {rocks?.map((rock) => (
            <div key={rock.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">{rock.title}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">On Track</span>
                  <Switch 
                    checked={rock.onTrack}
                    onCheckedChange={(checked) => handleOnTrackChange(rock.id, checked)}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Progress value={rock.progress} className="h-2" />
                <span className="text-sm text-muted-foreground">{rock.progress}% Complete</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};