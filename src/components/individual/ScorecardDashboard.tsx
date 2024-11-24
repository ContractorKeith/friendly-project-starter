import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BarChart } from "lucide-react";

interface Metric {
  id: number;
  name: string;
  value: string;
  target: string;
}

export const ScorecardDashboard = () => {
  const metrics: Metric[] = [
    { id: 1, name: "Revenue", value: "250000", target: "300000" },
    { id: 2, name: "Customer Satisfaction", value: "4.5", target: "4.8" },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">My Metrics</CardTitle>
        <BarChart className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {metrics.map((metric) => (
            <div key={metric.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">{metric.name}</span>
                <span className="text-sm text-muted-foreground">Target: {metric.target}</span>
              </div>
              <Input
                type="text"
                value={metric.value}
                className="max-w-[200px]"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};