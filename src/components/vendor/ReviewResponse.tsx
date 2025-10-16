import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Star, MessageSquare, Loader2 } from "lucide-react";
import { format } from "date-fns";

interface ReviewResponseProps {
  review: any;
  onUpdate: () => void;
}

export function ReviewResponse({ review, onUpdate }: ReviewResponseProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(review.vendor_response || "");
  const [isEditing, setIsEditing] = useState(!review.vendor_response);

  const handleSubmit = async () => {
    if (!response.trim()) {
      toast({ title: "Please enter a response", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("reviews")
        .update({
          vendor_response: response,
          vendor_responded_at: new Date().toISOString(),
        })
        .eq("id", review.id);

      if (error) throw error;

      toast({ title: "Response saved successfully" });
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error("Error:", error);
      toast({ title: "Error saving response", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < review.rating
                    ? "fill-primary text-primary"
                    : "text-muted-foreground"
                }`}
              />
            ))}
          </div>
          {review.vendor_response && (
            <Badge variant="secondary">
              <MessageSquare className="h-3 w-3 mr-1" />
              Responded
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          {format(new Date(review.created_at), "PPP")}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-3 bg-muted rounded-md">
          <p className="text-sm">{review.comment || "No comment provided"}</p>
        </div>

        {isEditing ? (
          <div className="space-y-2">
            <Textarea
              placeholder="Write your response..."
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              rows={4}
            />
            <div className="flex gap-2">
              <Button onClick={handleSubmit} disabled={loading} size="sm">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {review.vendor_response ? "Update Response" : "Submit Response"}
              </Button>
              {review.vendor_response && (
                <Button
                  onClick={() => {
                    setResponse(review.vendor_response);
                    setIsEditing(false);
                  }}
                  variant="outline"
                  size="sm"
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="p-3 bg-primary/5 border border-primary/10 rounded-md">
              <p className="text-sm font-medium text-primary mb-1">Your Response:</p>
              <p className="text-sm">{review.vendor_response}</p>
              {review.vendor_responded_at && (
                <p className="text-xs text-muted-foreground mt-2">
                  Responded on {format(new Date(review.vendor_responded_at), "PPP")}
                </p>
              )}
            </div>
            <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
              Edit Response
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
