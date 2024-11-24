import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Diamond } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRocks, useUpdateRock, useAddRock } from "@/hooks/useDashboardData";
import { useSession } from "@supabase/auth-helpers-react";

export const RocksDashboard = () => {
  const { data: rocks, isLoading } = useRocks();
  const updateRock = useUpdateRock();
  const addRock = useAddRock();
  const session = useSession();
  const [newRockTitle, setNewRockTitle] = useState("");
  const [dueDate, setDueDate] = useState<Date>();

  const handleAddRock = () => {
    if (!newRockTitle.trim()) return;
    
    addRock.mutate({
      title: newRockTitle,
      onTrack: true,
      progress: 0,
      owner_id: session?.user?.id || "",
      due_date: dueDate || new Date(),
      meeting_id: null,
    });
    
    setNewRockTitle("");
    setDueDate(undefined);
  };

  const handleOnTrackChange = (rockId: number, onTrack: boolean) => {
    updateRock.mutate({ id: rockId, onTrack });
  };

  const handleProgressChange = (rockId: number, progress: number) => {
    updateRock.mutate({ id: rockId, progress });
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
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[200px]">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP") : "Pick due date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Button onClick={handleAddRock}>Add Rock</Button>
          </div>

          {rocks?.map((rock) => (
            <div key={rock.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">{rock.title}</span>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-muted-foreground">
                    Due: {rock.due_date ? format(new Date(rock.due_date), "PPP") : "Not set"}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">On Track</span>
                    <Switch 
                      checked={rock.onTrack}
                      onCheckedChange={(checked) => handleOnTrackChange(rock.id, checked)}
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Progress value={rock.progress} className="h-2 w-3/4" />
                  <Select
                    value={rock.progress?.toString()}
                    onValueChange={(value) => handleProgressChange(rock.id, parseInt(value))}
                  >
                    <SelectTrigger className="w-[100px]">
                      <SelectValue placeholder="Progress" />
                    </SelectTrigger>
                    <SelectContent>
                      {[0, 25, 50, 75, 100].map((value) => (
                        <SelectItem key={value} value={value.toString()}>
                          {value}%
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <span className="text-sm text-muted-foreground">{rock.progress}% Complete</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};