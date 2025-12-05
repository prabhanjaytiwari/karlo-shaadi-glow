import { useState, useEffect } from "react";
import { BhindiFooter } from "@/components/BhindiFooter";
import { GlassCard } from "@/components/GlassCard";
import { Heart, MapPin, Users, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { StorySubmissionForm } from "@/components/StorySubmissionForm";

const Stories = () => {
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);

  useEffect(() => {
    fetchStories();
  }, [activeFilter]);

  const fetchStories = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("wedding_stories")
        .select(`
          *,
          city:cities(name),
          story_photos(photo_url, display_order)
        `)
        .eq("status", "approved")
        .order("created_at", { ascending: false });

      // Apply filters
      if (activeFilter === "budget") {
        query = query.lte("budget_max", 1000000); // ≤ 10 lakhs
      } else if (activeFilter === "luxury") {
        query = query.gte("budget_min", 1500000); // ≥ 15 lakhs
      } else if (activeFilter === "destination") {
        query = query.not("city_id", "is", null);
      }

      const { data, error } = await query;

      if (error) throw error;
      setStories(data || []);
    } catch (error) {
      console.error("Error fetching stories:", error);
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

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-muted/20 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center animate-fade-up">
            <h1 className="font-display font-bold text-5xl mb-4">
              Real Wedding Stories
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Get inspired by couples who planned their dream weddings with Karlo Shaadi
            </p>
            
            {/* Filter Pills */}
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { label: "All Stories", value: "all" },
                { label: "Budget Friendly", value: "budget" },
                { label: "Luxury", value: "luxury" },
                { label: "Destination", value: "destination" },
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setActiveFilter(filter.value)}
                  className={`px-4 py-2 rounded-full text-sm transition-all ${
                    activeFilter === filter.value
                      ? "glass-intense font-semibold"
                      : "glass-subtle hover:glass-intense"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stories Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-[4/3] w-full rounded-lg" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ))}
            </div>
          ) : stories.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">No stories found for this filter</p>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {stories.map((story, i) => (
                  <Link key={story.id} to={`/stories/${story.id}`}>
                    <GlassCard 
                      hover
                      className="overflow-hidden h-full animate-fade-up"
                      style={{ animationDelay: `${i * 100}ms` }}
                    >
                      {/* Image */}
                      <div className="aspect-[4/3] relative overflow-hidden group">
                        <img 
                          src={story.cover_image_url || story.story_photos?.[0]?.photo_url || "/placeholder.svg"} 
                          alt={story.couple_names}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-4 right-4">
                          <span className="glass-intense px-3 py-1 rounded-full text-xs font-semibold">
                            {story.theme}
                          </span>
                        </div>
                        {story.featured && (
                          <div className="absolute top-4 left-4">
                            <span className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-semibold">
                              Featured
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <h3 className="font-display font-semibold text-2xl mb-2">{story.couple_names}</h3>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{story.city?.name || "Unknown"}</span>
                          </div>
                          {story.guest_count && (
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              <span>{story.guest_count} guests</span>
                            </div>
                          )}
                        </div>

                        <p className="font-quote italic text-muted-foreground mb-4 line-clamp-2">
                          "{story.quote}"
                        </p>

                        <div className="pt-4 border-t border-border/50">
                          <p className="text-sm text-muted-foreground mb-2">
                            Budget: {formatBudget(story.budget_min, story.budget_max)}
                          </p>
                        </div>
                      </div>
                    </GlassCard>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Share Your Story CTA */}
      <section className="py-20 bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <GlassCard variant="intense" className="max-w-2xl mx-auto p-12 text-center">
            <Heart className="h-12 w-12 mx-auto mb-4 text-accent" />
            <h2 className="font-display font-bold text-3xl mb-4">
              Share Your Wedding Story
            </h2>
            <p className="text-muted-foreground mb-6">
              Inspire other couples and help vendors showcase their amazing work
            </p>
            <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="gap-2">
                  <Plus className="h-5 w-5" />
                  Submit Your Story
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <StorySubmissionForm onSuccess={() => {
                  setIsSubmitDialogOpen(false);
                  fetchStories();
                }} />
              </DialogContent>
            </Dialog>
          </GlassCard>
        </div>
      </section>

      <BhindiFooter />
    </div>
  );
};

export default Stories;
