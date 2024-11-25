import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { supabase } from "@/lib/supabase";
import { Archive } from "lucide-react";

const ArchivedMeetings = () => {
  const session = useSession();
  const navigate = useNavigate();

  const { data: profile } = useQuery({
    queryKey: ["profile", session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session?.user?.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const { data: archivedMeetings, isLoading } = useQuery({
    queryKey: ["archived-meetings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("archived_meetings")
        .select("*")
        .order("meeting_date", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (!session) {
      navigate("/");
    } else if (profile && profile.role !== "admin") {
      navigate("/dashboard");
    }
  }, [session, profile, navigate]);

  if (!session || (profile && profile.role !== "admin")) {
    return null;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center space-x-2">
          <Archive className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Archived Meetings</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Meeting History</CardTitle>
            <CardDescription>
              View details of past meetings including rocks, issues, and KPIs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {archivedMeetings?.map((meeting) => (
                  <TableRow key={meeting.id}>
                    <TableCell>
                      {format(new Date(meeting.meeting_date), "PPP")}
                    </TableCell>
                    <TableCell>{meeting.meeting_rating}/10</TableCell>
                    <TableCell>
                      {meeting.revenue
                        ? new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                          }).format(meeting.revenue)
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      <Accordion type="single" collapsible>
                        <AccordionItem value={`meeting-${meeting.id}`}>
                          <AccordionTrigger>View Details</AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-semibold">
                                  Cascading Messages
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {meeting.cascading_messages || "None"}
                                </p>
                              </div>

                              {meeting.scorecard_data && (
                                <div>
                                  <h4 className="font-semibold">Scorecard</h4>
                                  <pre className="text-sm bg-gray-50 p-2 rounded">
                                    {JSON.stringify(
                                      meeting.scorecard_data,
                                      null,
                                      2
                                    )}
                                  </pre>
                                </div>
                              )}

                              {meeting.rocks_data && (
                                <div>
                                  <h4 className="font-semibold">Rocks</h4>
                                  <pre className="text-sm bg-gray-50 p-2 rounded">
                                    {JSON.stringify(meeting.rocks_data, null, 2)}
                                  </pre>
                                </div>
                              )}

                              {meeting.issues_data && (
                                <div>
                                  <h4 className="font-semibold">Issues</h4>
                                  <pre className="text-sm bg-gray-50 p-2 rounded">
                                    {JSON.stringify(meeting.issues_data, null, 2)}
                                  </pre>
                                </div>
                              )}

                              {meeting.todos_data && (
                                <div>
                                  <h4 className="font-semibold">ToDos</h4>
                                  <pre className="text-sm bg-gray-50 p-2 rounded">
                                    {JSON.stringify(meeting.todos_data, null, 2)}
                                  </pre>
                                </div>
                              )}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ArchivedMeetings;