import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface Rock {
  id: number;
  title: string;
  progress: number;
  due_date?: string;
  owner: { username: string } | null;
}

interface RockListProps {
  rocks?: Rock[];
}

export const RockList = ({ rocks }: RockListProps) => {
  return (
    <div className="space-y-4">
      {rocks?.map((rock) => (
        <div key={rock.id} className="space-y-2 border-b pb-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">{rock.title}</span>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {rock.due_date && (
                <div className="flex items-center gap-1">
                  <CalendarIcon className="h-3 w-3" />
                  {format(new Date(rock.due_date), 'MMM d, yyyy')}
                </div>
              )}
              {rock.owner?.username && (
                <span>• Owner: {rock.owner.username}</span>
              )}
            </div>
          </div>
          <Progress value={rock.progress || 0} className="h-2" />
          <span className="text-sm text-muted-foreground">{rock.progress || 0}% Complete</span>
        </div>
      ))}
    </div>
  );
};