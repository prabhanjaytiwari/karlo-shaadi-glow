import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { format } from "date-fns";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  vendor_response: string | null;
  vendor_responded_at: string | null;
  couple_id: string;
  photos: string[] | null;
}

interface ReviewsListProps {
  vendorId: string;
}

export function ReviewsList({ vendorId }: ReviewsListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [profiles, setProfiles] = useState<Record<string, any>>({});

  useEffect(() => {
    loadReviews();
  }, [vendorId]);

  const loadReviews = async () => {
    const { data: reviewsData } = await supabase
      .from("reviews")
      .select("*")
      .eq("vendor_id", vendorId)
      .order("created_at", { ascending: false });

    if (reviewsData) {
      setReviews(reviewsData);
      
      // Load profiles for reviewers
      const coupleIds = [...new Set(reviewsData.map(r => r.couple_id))];
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("*")
        .in("id", coupleIds);

      if (profilesData) {
        const profilesMap = profilesData.reduce((acc, profile) => {
          acc[profile.id] = profile;
          return acc;
        }, {} as Record<string, any>);
        setProfiles(profilesMap);
      }
    }
  };

  if (reviews.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-muted-foreground">No reviews yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => {
        const profile = profiles[review.couple_id];
        return (
          <Card key={review.id}>
            <CardHeader>
              <div className="flex items-start gap-4">
                <Avatar>
                  <AvatarFallback>
                    {profile?.full_name?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-semibold">{profile?.full_name || "Anonymous"}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(review.created_at), "MMM d, yyyy")}
                      </p>
                    </div>
                    <div className="flex gap-1">
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
                  </div>
                  {review.comment && (
                    <p className="text-foreground mb-3">{review.comment}</p>
                  )}
                  
                  {review.photos && review.photos.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
                      {review.photos.map((photoUrl, idx) => (
                        <a
                          key={idx}
                          href={photoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="aspect-square overflow-hidden rounded-lg border hover:opacity-90 transition-opacity"
                        >
                          <img
                            src={photoUrl}
                            alt={`Review photo ${idx + 1}`}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </a>
                      ))}
                    </div>
                  )}
                  
                  {review.vendor_response && (
                    <div className="mt-4 pl-4 border-l-2 border-primary/20">
                      <p className="text-sm font-semibold mb-1">Vendor Response</p>
                      <p className="text-sm text-muted-foreground">{review.vendor_response}</p>
                      {review.vendor_responded_at && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {format(new Date(review.vendor_responded_at), "MMM d, yyyy")}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>
        );
      })}
    </div>
  );
}
