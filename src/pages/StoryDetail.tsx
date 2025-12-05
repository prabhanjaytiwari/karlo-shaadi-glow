import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { BhindiFooter } from "@/components/BhindiFooter";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, MapPin, Users, DollarSign, Heart, Share2, Camera, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

const StoryDetail = () => {
  const { id } = useParams();
  const [liked, setLiked] = useState(false);
  const [story, setStory] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStory();
  }, [id]);

  const fetchStory = async () => {
    if (!id) return;
    
    try {
      const { data: storyData, error } = await supabase
        .from("wedding_stories")
        .select(`
          *,
          city:cities(name),
          story_photos(photo_url, caption, display_order),
          story_budget_breakdown(category, amount, percentage),
          story_timeline(phase, description, display_order),
          story_vendors(role, vendor:vendors(id, business_name))
        `)
        .eq("id", id)
        .eq("status", "approved")
        .single();

      if (error) throw error;
      setStory(storyData);
    } catch (error) {
      console.error("Error fetching story:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatBudget = (min?: number, max?: number) => {
    if (!min && !max) return "Budget not disclosed";
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
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12 space-y-8">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
        <BhindiFooter />
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl mb-4">Story not found</p>
            <Link to="/stories">
              <Button>Back to Stories</Button>
            </Link>
          </div>
        </div>
        <BhindiFooter />
      </div>
    );
  }

  const sortedPhotos = story.story_photos?.sort((a: any, b: any) => a.display_order - b.display_order) || [];
  const sortedTimeline = story.story_timeline?.sort((a: any, b: any) => a.display_order - b.display_order) || [];
  const sortedBudget = story.story_budget_breakdown?.sort((a: any, b: any) => b.percentage - a.percentage) || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-end overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={story.cover_image_url || sortedPhotos[0]?.photo_url || "/placeholder.svg"}
            alt={story.couple_names}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />
        </div>

        <div className="container mx-auto px-4 relative z-10 pb-12">
          <div className="max-w-4xl animate-fade-up">
            {story.featured && (
              <Badge className="mb-2 bg-accent text-accent-foreground">
                Featured Story
              </Badge>
            )}
            <Badge className="mb-4">
              <Sparkles className="h-3 w-3 mr-1" />
              {story.theme}
            </Badge>

            <h1 className="font-display font-bold text-5xl md:text-6xl mb-4">
              {story.couple_names}
            </h1>

            <div className="flex flex-wrap gap-6 text-lg">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <span>{story.city?.name || "Unknown"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>{format(new Date(story.wedding_date), "MMMM dd, yyyy")}</span>
              </div>
              {story.guest_count && (
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span>{story.guest_count} guests</span>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                variant={liked ? "default" : "outline"}
                size="lg"
                onClick={() => setLiked(!liked)}
                className="gap-2"
              >
                <Heart className={`h-5 w-5 ${liked ? "fill-current" : ""}`} />
                {liked ? "Liked" : "Like Story"}
              </Button>
              <Button variant="outline" size="lg" className="gap-2">
                <Share2 className="h-5 w-5" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Story Content */}
          <div className="lg:col-span-2 space-y-8">
            <GlassCard className="p-8">
              <h2 className="font-display font-bold text-3xl mb-6">Our Wedding Story</h2>
              <div className="prose prose-lg max-w-none">
                {story.story_content.split('\n').map((paragraph: string, i: number) => (
                  <p key={i} className="mb-4 text-muted-foreground leading-relaxed">
                    {paragraph.trim()}
                  </p>
                ))}
              </div>

              <div className="mt-8 p-6 glass-subtle rounded-lg border-l-4 border-accent">
                <p className="font-quote text-xl italic">"{story.quote}"</p>
                <p className="text-sm text-muted-foreground mt-2">- {story.couple_names}</p>
              </div>
            </GlassCard>

            {/* Photo Gallery */}
            {sortedPhotos.length > 0 && (
              <GlassCard className="p-8">
                <h3 className="font-display font-semibold text-2xl mb-6 flex items-center gap-2">
                  <Camera className="h-6 w-6" />
                  Photo Gallery
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {sortedPhotos.map((photo: any, i: number) => (
                    <div key={i} className="space-y-2">
                      <div className="aspect-square overflow-hidden rounded-lg group">
                        <img
                          src={photo.photo_url}
                          alt={photo.caption || `Wedding photo ${i + 1}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      {photo.caption && (
                        <p className="text-sm text-muted-foreground">{photo.caption}</p>
                      )}
                    </div>
                  ))}
                </div>
              </GlassCard>
            )}

            {/* Vendors */}
            {story.story_vendors && story.story_vendors.length > 0 && (
              <GlassCard className="p-8">
                <h3 className="font-display font-semibold text-2xl mb-6">Our Amazing Vendors</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {story.story_vendors.map((sv: any, i: number) => (
                    <Link key={i} to={`/vendor/${sv.vendor.id}`}>
                      <div className="p-4 glass-subtle rounded-lg hover:glass-intense transition-all group">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <Badge variant="outline" className="mb-2">{sv.role}</Badge>
                            <h4 className="font-semibold text-lg group-hover:text-accent transition-colors">
                              {sv.vendor.business_name}
                            </h4>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    💡 All vendors are verified by Karlo Shaadi with 100% payment protection
                  </p>
                </div>
              </GlassCard>
            )}

            {/* Timeline */}
            {sortedTimeline.length > 0 && (
              <GlassCard className="p-8">
                <h3 className="font-display font-semibold text-2xl mb-6">Planning Timeline</h3>
                <div className="space-y-4">
                  {sortedTimeline.map((item: any, i: number) => (
                    <div key={i} className="flex gap-4 items-start">
                      <div className="min-w-[140px]">
                        <Badge variant="outline">{item.phase}</Badge>
                      </div>
                      <p className="text-muted-foreground">{item.description}</p>
                    </div>
                  ))}
                </div>
              </GlassCard>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            <GlassCard className="sticky top-24 p-6">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="h-5 w-5 text-accent" />
                <h3 className="font-display font-bold text-xl">Budget Breakdown</h3>
              </div>
              
              {sortedBudget.length > 0 ? (
                <>
                  <div className="space-y-4">
                    {sortedBudget.map((item: any, i: number) => (
                      <div key={i}>
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">{item.category}</span>
                          <span className="text-muted-foreground">{item.percentage}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-accent to-primary"
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          ₹{Number(item.amount).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-6 border-t border-border">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Total Budget</span>
                      <span className="font-bold text-xl">{formatBudget(story.budget_min, story.budget_max)}</span>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-muted-foreground">Budget breakdown not available</p>
              )}
            </GlassCard>

            {/* CTA */}
            <GlassCard variant="intense" className="p-6 text-center">
              <Sparkles className="h-8 w-8 mx-auto mb-3 text-accent" />
              <h3 className="font-bold text-lg mb-2">Start Your Story</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Find your perfect vendors on Karlo Shaadi
              </p>
              <Link to="/categories">
                <Button className="w-full">
                  Browse Vendors
                </Button>
              </Link>
            </GlassCard>
          </div>
        </div>
      </div>

      {/* Related Stories */}
      <section className="py-12 bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <h2 className="font-display font-bold text-3xl mb-8 text-center">
            More Wedding Stories
          </h2>
          <div className="text-center">
            <Link to="/stories">
              <Button variant="outline" size="lg">
                View All Stories →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <BhindiFooter />
    </div>
  );
};

export default StoryDetail;
