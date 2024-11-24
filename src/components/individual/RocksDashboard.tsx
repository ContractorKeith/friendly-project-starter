import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Diamond } from "lucide-react";

interface Rock {
  id: number;
  title: string;
  onTrack: boolean;
  progress: number;
}

export const RocksDashboard = () => {
  const rocks: Rock[] = [
    { id: 1, title: "Market Expansion", onTrack: true, progress: 75 },
    { id: 2, title: "Team Training", onTrack: false, progress: 30 },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">My Rocks</CardTitle>
        <Diamond className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {rocks.map((rock) => (
            <div key={rock.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">{rock.title}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">On Track</span>
                  <Switch checked={rock.onTrack} />
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