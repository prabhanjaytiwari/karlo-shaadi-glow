import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface Story {
  id: string;
  couple_names: string;
  theme: string;
  cover_image_url: string | null;
  quote: string;
  story_content: string;
  wedding_date: string;
  photos: Array<{ photo_url: string; caption: string | null }>;
}

const WebStories = () => {
  const { id } = useParams();
  const [stories, setStories] = useState<Story[]>([]);
  const [currentStory, setCurrentStory] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStories();
  }, [id]);

  const loadStories = async () => {
    try {
      let query = supabase
        .from("wedding_stories")
        .select(`
          id, couple_names, theme, cover_image_url, quote, story_content, wedding_date,
          story_photos(photo_url, caption)
        `)
        .eq("status", "approved")
        .eq("featured", true)
        .order("created_at", { ascending: false })
        .limit(10);

      if (id) {
        query = supabase
          .from("wedding_stories")
          .select(`
            id, couple_names, theme, cover_image_url, quote, story_content, wedding_date,
            story_photos(photo_url, caption)
          `)
          .eq("id", id)
          .eq("status", "approved");
      }

      const { data } = await query;
      if (data) {
        setStories(data.map((s: any) => ({
          ...s,
          photos: s.story_photos || [],
        })));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const story = stories[currentStory];

  // Build slides
  const slides = story ? [
    { type: "cover" as const, image: story.cover_image_url, title: story.couple_names, subtitle: story.theme },
    { type: "quote" as const, text: story.quote, couple: story.couple_names },
    ...story.photos.slice(0, 5).map((p) => ({ type: "photo" as const, image: p.photo_url, caption: p.caption })),
    { type: "cta" as const },
  ] : [];

  const totalSlides = slides.length;
  const slide = slides[currentSlide];

  const goNext = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(currentSlide + 1);
    } else if (currentStory < stories.length - 1) {
      setCurrentStory(currentStory + 1);
      setCurrentSlide(0);
    }
  };

  const goPrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    } else if (currentStory > 0) {
      setCurrentStory(currentStory - 1);
      setCurrentSlide(0);
    }
  };

  // Auto-advance
  useEffect(() => {
    if (!story) return;
    const timer = setTimeout(goNext, 6000);
    return () => clearTimeout(timer);
  }, [currentSlide, currentStory, story]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!story || !slide) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center text-white text-center p-8">
        <div>
          <p className="text-xl mb-4">No stories available yet</p>
          <Link to="/stories">
            <Button variant="outline" className="text-white border-white/30">
              Browse Wedding Stories
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={`${story.couple_names} Wedding Story | Karlo Shaadi`}
        description={story.quote}
      />
      <div className="fixed inset-0 bg-black flex items-center justify-center select-none" style={{ touchAction: "manipulation" }}>
        {/* Story Container */}
        <div className="relative w-full h-full max-w-[430px] mx-auto overflow-hidden">
          {/* Progress Bars */}
          <div className="absolute top-3 left-3 right-3 z-30 flex gap-1">
            {slides.map((_, i) => (
              <div key={i} className="flex-1 h-0.5 rounded-full bg-white/20 overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-300"
                  style={{
                    width: i < currentSlide ? "100%" : i === currentSlide ? "50%" : "0%",
                  }}
                />
              </div>
            ))}
          </div>

          {/* Close */}
          <Link to="/stories" className="absolute top-8 right-3 z-30">
            <X className="h-6 w-6 text-white/80 hover:text-white" />
          </Link>

          {/* Tap Zones */}
          <div className="absolute inset-0 z-20 flex">
            <div className="w-1/3 h-full" onClick={goPrev} />
            <div className="w-1/3 h-full" />
            <div className="w-1/3 h-full" onClick={goNext} />
          </div>

          {/* Slide Content */}
          <div className="relative w-full h-full">
            {slide.type === "cover" && (
              <div className="w-full h-full relative">
                {slide.image && (
                  <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
                <div className="absolute bottom-20 left-6 right-6 text-white">
                  <p className="text-xs font-semibold text-pink-300 uppercase tracking-wider mb-2">Wedding Story</p>
                  <h1 className="text-3xl font-bold mb-2">{slide.title}</h1>
                  <p className="text-white/70 text-sm">{slide.subtitle}</p>
                </div>
              </div>
            )}

            {slide.type === "quote" && (
              <div className="w-full h-full bg-gradient-to-br from-rose-950 via-rose-900 to-pink-950 flex items-center justify-center p-8">
                <div className="text-center">
                  <p className="text-4xl text-white/20 font-serif mb-4">"</p>
                  <p className="text-white text-xl font-light leading-relaxed italic mb-6">
                    {slide.text}
                  </p>
                  <p className="text-pink-300 text-sm font-semibold">— {slide.couple}</p>
                </div>
              </div>
            )}

            {slide.type === "photo" && (
              <div className="w-full h-full relative">
                <img src={slide.image} alt={slide.caption || ""} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                {slide.caption && (
                  <p className="absolute bottom-20 left-6 right-6 text-white text-sm">{slide.caption}</p>
                )}
              </div>
            )}

            {slide.type === "cta" && (
              <div className="w-full h-full bg-gradient-to-br from-rose-950 via-black to-pink-950 flex items-center justify-center p-8">
                <div className="text-center">
                  <p className="text-5xl mb-4">💒</p>
                  <h2 className="text-white text-2xl font-bold mb-3">Plan Your Dream Wedding</h2>
                  <p className="text-white/60 text-sm mb-6">Get a free AI wedding plan in 2 minutes</p>
                  <Link to="/plan-wizard">
                    <Button className="rounded-full bg-pink-600 hover:bg-pink-700 text-white px-8">
                      Start Planning Free →
                    </Button>
                  </Link>
                  <p className="text-white/30 text-xs mt-6">karloshaadi.com</p>
                </div>
              </div>
            )}
          </div>

          {/* Branding */}
          <div className="absolute top-8 left-3 z-30 flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-pink-600 flex items-center justify-center text-white font-bold text-xs">
              K
            </div>
            <span className="text-white text-xs font-semibold">Karlo Shaadi</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default WebStories;
