import { useState, useEffect } from "react";
import { Heart, MapPin, Users, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { StorySubmissionForm } from "@/components/StorySubmissionForm";
import { MobilePageHeader } from "@/components/mobile/MobilePageHeader";
import { useIsMobile } from "@/hooks/use-mobile";

const Stories = () => {
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => { fetchStories(); }, [activeFilter]);

  const fetchStories = async () => {
    setLoading(true);
    try {
      let query = supabase.from("wedding_stories").select(`*, city:cities(name), story_photos(photo_url, display_order)`).eq("status", "approved").order("created_at", { ascending: false });
      if (activeFilter === "budget") query = query.lte("budget_max", 1000000);
      else if (activeFilter === "luxury") query = query.gte("budget_min", 1500000);
      else if (activeFilter === "destination") query = query.not("city_id", "is", null);
      const { data } = await query;
      setStories(data || []);
    } catch { /* ignored */ } finally { setLoading(false); }
  };

  const formatBudget = (min?: number, max?: number) => {
    if (!min && !max) return "Budget not disclosed";
    const fmt = (amt: number) => amt >= 10000000 ? `₹${(amt / 10000000).toFixed(1)}Cr` : amt >= 100000 ? `₹${(amt / 100000).toFixed(0)}L` : `₹${(amt / 1000).toFixed(0)}K`;
    if (min && max) return `${fmt(min)}-${fmt(max)}`;
    return min ? `From ${fmt(min)}` : `Up to ${fmt(max!)}`;
  };

  const filters = [
    { label: "All Stories", value: "all" },
    { label: "Budget Friendly", value: "budget" },
    { label: "Luxury", value: "luxury" },
    { label: "Destination", value: "destination" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <MobilePageHeader title="Real Weddings" />

      {/* Hero */}
      <section className={isMobile ? "px-4 pt-4 pb-4" : "pt-24 pb-10"}>
        <div className="container mx-auto px-4 max-w-4xl text-center">
          {!isMobile && (
            <>
              <h1 className="font-bold text-4xl mb-3">Real Wedding Stories</h1>
              <p className="text-muted-foreground mb-6">Get inspired by couples who planned their dream weddings with Karlo Shaadi</p>
            </>
          )}
          <div className="flex flex-wrap justify-center gap-2">
            {filters.map(f => (
              <button
                key={f.value}
                onClick={() => setActiveFilter(f.value)}
                className={`px-4 py-2 rounded-full text-sm transition-all ${
                  activeFilter === f.value
                    ? "bg-foreground text-background font-semibold shadow-[var(--shadow-sm)]"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className={isMobile ? "px-4 pb-24" : "py-10"}>
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : stories.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No stories found for this filter</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {stories.map((story) => (
                <Link key={story.id} to={`/stories/${story.id}`}>
                  <div className="rounded-2xl bg-card shadow-[var(--shadow-sm)] overflow-hidden hover:shadow-[var(--shadow-md)] hover:-translate-y-px transition-all">
                    <div className="aspect-[4/3] relative overflow-hidden group">
                      <img
                        src={story.cover_image_url || story.story_photos?.[0]?.photo_url || "/placeholder.svg"}
                        alt={story.couple_names}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy" decoding="async"
                      />
                      <div className="absolute top-3 right-3">
                        <span className="bg-background/90 px-3 py-1 rounded-full text-xs font-medium">{story.theme}</span>
                      </div>
                      {story.featured && (
                        <div className="absolute top-3 left-3">
                          <span className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-semibold">Featured</span>
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-semibold text-lg mb-2">{story.couple_names}</h3>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{story.city?.name || "India"}</span>
                        {story.guest_count && <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{story.guest_count} guests</span>}
                      </div>
                      {story.quote && <p className="text-sm italic text-muted-foreground line-clamp-2 mb-3">"{story.quote}"</p>}
                      <div className="pt-3 border-t border-border/30">
                        <p className="text-xs text-muted-foreground">{formatBudget(story.budget_min, story.budget_max)}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Share Story CTA */}
      <section className="py-12 bg-muted/20">
        <div className="container mx-auto px-4 max-w-xl text-center">
          <Heart className="h-10 w-10 mx-auto mb-3 text-primary" />
          <h2 className="font-bold text-2xl mb-2">Share Your Wedding Story</h2>
          <p className="text-sm text-muted-foreground mb-5">Inspire other couples and help vendors showcase their amazing work</p>
          <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="rounded-full gap-2"><Plus className="h-4 w-4" />Submit Your Story</Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <StorySubmissionForm onSuccess={() => { setIsSubmitDialogOpen(false); fetchStories(); }} />
            </DialogContent>
          </Dialog>
        </div>
      </section>
    </div>
  );
};

export default Stories;
