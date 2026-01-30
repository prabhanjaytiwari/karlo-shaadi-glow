import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, XCircle, Eye, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Link } from "react-router-dom";

export function StoryModerationTab() {
  const { toast } = useToast();
  const [pendingStories, setPendingStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPendingStories();
  }, []);

  const loadPendingStories = async () => {
    try {
      const { data, error } = await supabase
        .from("wedding_stories")
        .select(`
          *,
          city:cities(name)
        `)
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPendingStories(data || []);
    } catch (error) {
      console.error("Error loading stories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (storyId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase
        .from("wedding_stories")
        .update({
          status: "approved",
          approved_by: user?.id,
          approved_at: new Date().toISOString(),
        })
        .eq("id", storyId);

      if (error) throw error;

      toast({
        title: "Story approved",
        description: "The wedding story is now live!",
      });

      loadPendingStories();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleReject = async (storyId: string) => {
    try {
      const { error } = await supabase
        .from("wedding_stories")
        .update({ status: "rejected" })
        .eq("id", storyId);

      if (error) throw error;

      toast({
        title: "Story rejected",
        description: "The story submission has been rejected",
      });

      loadPendingStories();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const formatBudget = (min?: number, max?: number) => {
    if (!min && !max) return "N/A";
    const formatAmount = (amt: number) => {
      if (amt >= 10000000) return `₹${(amt / 10000000).toFixed(1)}Cr`;
      if (amt >= 100000) return `₹${(amt / 100000).toFixed(0)}L`;
      return `₹${(amt / 1000).toFixed(0)}K`;
    };
    if (min && max) return `${formatAmount(min)}-${formatAmount(max)}`;
    if (min) return `From ${formatAmount(min)}`;
    return `Up to ${formatAmount(max)}`;
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Pending Wedding Stories
        </CardTitle>
        <CardDescription>Review and moderate wedding story submissions</CardDescription>
      </CardHeader>
      <CardContent>
        {pendingStories.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No pending stories to review</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Couple</TableHead>
                <TableHead>Theme</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingStories.map((story) => (
                <TableRow key={story.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{story.couple_names}</p>
                      <p className="text-sm text-muted-foreground">
                        Submitted {format(new Date(story.created_at), "MMM dd, yyyy")}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{story.theme}</Badge>
                  </TableCell>
                  <TableCell>{story.city?.name || "N/A"}</TableCell>
                  <TableCell className="text-sm">
                    {formatBudget(story.budget_min, story.budget_max)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {format(new Date(story.created_at), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Link to={`/stories/${story.id}`} target="_blank">
                        <Button size="sm" variant="outline" className="gap-1">
                          <Eye className="h-4 w-4" />
                          Preview
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        onClick={() => handleApprove(story.id)}
                        className="gap-1"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReject(story.id)}
                        className="gap-1 border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
                      >
                        <XCircle className="h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
