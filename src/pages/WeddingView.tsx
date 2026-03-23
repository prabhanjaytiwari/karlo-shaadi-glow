import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  MapPin, 
  Heart, 
  Users, 
  Send, 
  CheckCircle, 
  Clock,
  Sparkles,
  Gift,
  Phone,
  Mail,
  ExternalLink,
  ChevronDown,
  Music,
  PartyPopper
} from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { motion, AnimatePresence } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { cdn } from "@/lib/cdnAssets";

// Import assets for fallback images

interface WeddingWebsite {
  id: string;
  couple_names: string;
  wedding_date: string | null;
  venue_name: string | null;
  venue_address: string | null;
  story: string | null;
  theme: string | null;
  template: string | null;
  cover_image_url: string | null;
  is_published: boolean;
  tagline: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  bride_parents: string | null;
  groom_parents: string | null;
}

interface WeddingEvent {
  id: string;
  event_name: string;
  event_date: string | null;
  event_time: string | null;
  venue_name: string | null;
  venue_address: string | null;
  dress_code: string | null;
  sort_order: number;
}

const themeStyles: Record<string, { gradient: string; accent: string; bg: string; text: string }> = {
  "royal-maroon": {
    gradient: "from-[#8B1538] via-[#A91D3A] to-[#C73659]",
    accent: "#D4AF37",
    bg: "bg-gradient-to-br from-[#2D0A1A] via-[#1A0510] to-[#0D0208]",
    text: "text-amber-100"
  },
  "peacock-green": {
    gradient: "from-[#0D6E6E] via-[#4A9B9B] to-[#7DC8C8]",
    accent: "#FFD700",
    bg: "bg-gradient-to-br from-[#0A2525] via-[#051515] to-[#020808]",
    text: "text-emerald-100"
  },
  "rose-gold": {
    gradient: "from-[#B76E79] via-[#E8B4BC] to-[#F5D5D8]",
    accent: "#D4A574",
    bg: "bg-gradient-to-br from-[#2D1F21] via-[#1A1315] to-[#0D0A0B]",
    text: "text-rose-100"
  },
  "midnight-blue": {
    gradient: "from-[#1A237E] via-[#303F9F] to-[#5C6BC0]",
    accent: "#FFD700",
    bg: "bg-gradient-to-br from-[#0A0D2E] via-[#050718] to-[#02030A]",
    text: "text-blue-100"
  }
};

const defaultEvents: Partial<WeddingEvent>[] = [
  { event_name: "Mehendi", sort_order: 1 },
  { event_name: "Haldi", sort_order: 2 },
  { event_name: "Wedding Ceremony", sort_order: 3 },
  { event_name: "Reception", sort_order: 4 },
];

const eventEmojis: Record<string, string> = {
  "Mehendi": "🌿",
  "Haldi": "💛",
  "Sangeet": "💃",
  "Wedding Ceremony": "💍",
  "Wedding": "💍",
  "Reception": "🎉",
  "Cocktail": "🍸",
};

const WeddingView = () => {
  const { slug } = useParams<{ slug: string }>();
  const [website, setWebsite] = useState<WeddingWebsite | null>(null);
  const [events, setEvents] = useState<WeddingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showRsvpForm, setShowRsvpForm] = useState(false);
  
  // RSVP form state
  const [rsvpForm, setRsvpForm] = useState({
    guest_name: "",
    email: "",
    phone: "",
    attending: true,
    guest_count: 1,
    meal_preference: "",
    dietary_restrictions: "",
    message: "",
  });

  useEffect(() => {
    if (slug) {
      loadWebsite();
    }
  }, [slug]);

  const loadWebsite = async () => {
    try {
      const { data, error } = await supabase
        .from("wedding_websites")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        setNotFound(true);
      } else {
        setWebsite(data);
        // Load events
        const { data: eventsData } = await supabase
          .from("wedding_events")
          .select("*")
          .eq("website_id", data.id)
          .order("sort_order", { ascending: true });
        
        setEvents(eventsData || []);
      }
    } catch (error) {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!website || !rsvpForm.guest_name.trim()) {
      toast.error("Please enter your name");
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from("wedding_rsvps").insert({
        website_id: website.id,
        guest_name: rsvpForm.guest_name.trim(),
        email: rsvpForm.email.trim() || null,
        phone: rsvpForm.phone.trim() || null,
        attending: rsvpForm.attending,
        guest_count: rsvpForm.attending ? rsvpForm.guest_count : 0,
        meal_preference: rsvpForm.meal_preference || null,
        dietary_restrictions: rsvpForm.dietary_restrictions.trim() || null,
        message: rsvpForm.message.trim() || null,
      });

      if (error) throw error;

      setRsvpSubmitted(true);
      toast.success("RSVP submitted successfully!");
    } catch (error) {
      toast.error("Failed to submit RSVP. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const getTheme = () => {
    return themeStyles[website?.theme || "royal-maroon"] || themeStyles["royal-maroon"];
  };

  const getDaysUntilWedding = () => {
    if (!website?.wedding_date) return null;
    const days = differenceInDays(new Date(website.wedding_date), new Date());
    return days > 0 ? days : null;
  };

  const getCoupleNames = () => {
    if (!website?.couple_names) return { bride: "Bride", groom: "Groom" };
    const names = website.couple_names.split(" & ");
    return { bride: names[0] || "Bride", groom: names[1] || "Groom" };
  };

  const getBackgroundImage = () => {
    if (website?.cover_image_url) return website.cover_image_url;
    // Use theme-based fallback
    switch (website?.theme) {
      case "peacock-green": return cdn.weddingDecoration;
      case "rose-gold": return cdn.weddingCoupleRomantic;
      default: return cdn.weddingCeremony;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 to-amber-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Heart className="w-16 h-16 text-rose-500 mx-auto mb-4 animate-pulse" />
          <p className="text-rose-800 font-medium">Loading your invitation...</p>
        </motion.div>
      </div>
    );
  }

  if (notFound || !website) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-amber-50 to-orange-50 flex items-center justify-center p-4">
        <SEO title="Wedding Not Found" description="This wedding website could not be found." />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-rose-100 flex items-center justify-center">
            <Heart className="w-12 h-12 text-rose-400" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-rose-900 mb-4">Wedding Not Found</h1>
          <p className="text-rose-700 mb-8">
            This wedding website doesn't exist or hasn't been published yet.
          </p>
          <Button 
            onClick={() => window.location.href = "/"} 
            className="bg-rose-600 hover:bg-rose-700"
          >
            Visit Karlo Shaadi
          </Button>
        </motion.div>
      </div>
    );
  }

  const theme = getTheme();
  const daysUntil = getDaysUntilWedding();
  const { bride, groom } = getCoupleNames();

  return (
    <div className={`min-h-screen ${theme.bg}`}>
      <SEO
        title={`${website.couple_names}'s Wedding`}
        description={`You're invited to ${website.couple_names}'s wedding${website.wedding_date ? ` on ${format(new Date(website.wedding_date), "MMMM d, yyyy")}` : ""}.`}
      />

      {/* Hero Section - Full Screen */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={getBackgroundImage()}
            alt="Wedding"
            className="w-full h-full object-cover"
          />
          <div className={`absolute inset-0 bg-gradient-to-b ${theme.gradient} opacity-70`} />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/30 to-transparent z-10" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/50 to-transparent z-10" />

        {/* Content */}
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Decorative Header */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-16 md:w-24 h-[1px] bg-gradient-to-r from-transparent to-white/60" />
              <Sparkles className="w-6 h-6 text-amber-300" />
              <div className="w-16 md:w-24 h-[1px] bg-gradient-to-l from-transparent to-white/60" />
            </div>

            <p className="text-white/80 text-sm md:text-base uppercase tracking-[0.4em] mb-4 font-light">
              Wedding Invitation
            </p>

            {/* Couple Names */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white mb-2 leading-tight">
              {bride}
            </h1>
            <div className="flex items-center justify-center gap-4 my-4">
              <div className="w-12 h-[1px] bg-amber-300/60" />
              <Heart className="w-8 h-8 text-amber-300 fill-amber-300" />
              <div className="w-12 h-[1px] bg-amber-300/60" />
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white mb-6 leading-tight">
              {groom}
            </h1>

            {/* Tagline */}
            {website.tagline && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-xl md:text-2xl italic text-white/90 mb-8 font-light"
              >
                "{website.tagline}"
              </motion.p>
            )}

            {/* Date Badge */}
            {website.wedding_date && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="inline-flex flex-col items-center bg-white/10 backdrop-blur-md rounded-2xl px-8 py-4 border border-white/20 mb-8"
              >
                <Calendar className="w-6 h-6 text-amber-300 mb-2" />
                <p className="text-white font-semibold text-lg md:text-xl">
                  {format(new Date(website.wedding_date), "EEEE")}
                </p>
                <p className="text-amber-200 text-2xl md:text-3xl font-serif font-bold">
                  {format(new Date(website.wedding_date), "MMMM d, yyyy")}
                </p>
                {daysUntil && (
                  <Badge className="mt-2 bg-amber-500/80 text-white border-0">
                    {daysUntil} days to go!
                  </Badge>
                )}
              </motion.div>
            )}

            {/* Venue */}
            {website.venue_name && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center justify-center gap-2 text-white/80 mb-8"
              >
                <MapPin className="w-5 h-5 text-amber-300" />
                <span className="text-lg">{website.venue_name}</span>
                {website.venue_address && <span className="text-white/60">• {website.venue_address}</span>}
              </motion.div>
            )}

            {/* RSVP Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Button
                size="lg"
                onClick={() => {
                  setShowRsvpForm(true);
                  document.getElementById('rsvp')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-amber-500 hover:bg-amber-600 text-amber-950 font-semibold px-8 py-6 text-lg rounded-full shadow-2xl hover:shadow-amber-500/30 transition-all"
              >
                <PartyPopper className="w-5 h-5 mr-2" /> RSVP Now
              </Button>
            </motion.div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ChevronDown className="w-8 h-8 text-white/60" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Family Section */}
      {(website.bride_parents || website.groom_parents) && (
        <section className="py-20 relative">
          <div className={`absolute inset-0 bg-gradient-to-b ${theme.gradient} opacity-10`} />
          <div className="container mx-auto px-4 max-w-4xl relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <Users className="w-10 h-10 text-amber-400 mx-auto mb-4" />
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
                Our Families
              </h2>
              <div className="w-24 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto" />
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {website.bride_parents && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="text-center p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10"
                >
                  <p className="text-amber-300 text-sm uppercase tracking-wider mb-2">Bride's Parents</p>
                  <p className="text-xl font-semibold text-white">{website.bride_parents}</p>
                  <p className="text-white/60 mt-2">Cordially invite you to celebrate</p>
                </motion.div>
              )}
              {website.groom_parents && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="text-center p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10"
                >
                  <p className="text-amber-300 text-sm uppercase tracking-wider mb-2">Groom's Parents</p>
                  <p className="text-xl font-semibold text-white">{website.groom_parents}</p>
                  <p className="text-white/60 mt-2">Warmly welcome you to the celebration</p>
                </motion.div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Our Story Section */}
      {website.story && (
        <section className="py-20 relative">
          <div className="container mx-auto px-4 max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <Heart className="w-10 h-10 text-rose-400 mx-auto mb-4" />
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
                Our Love Story
              </h2>
              <div className="w-24 h-[2px] bg-gradient-to-r from-transparent via-rose-400 to-transparent mx-auto mb-8" />
              <div className="relative">
                <div className="absolute -top-4 -left-4 text-6xl text-white/10 font-serif">"</div>
                <p className="text-lg md:text-xl text-white/80 leading-relaxed whitespace-pre-wrap italic">
                  {website.story}
                </p>
                <div className="absolute -bottom-4 -right-4 text-6xl text-white/10 font-serif rotate-180">"</div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Events Section */}
      <section className="py-20 relative">
        <div className={`absolute inset-0 bg-gradient-to-b ${theme.gradient} opacity-5`} />
        <div className="container mx-auto px-4 max-w-4xl relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Calendar className="w-10 h-10 text-amber-400 mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
              Wedding Events
            </h2>
            <div className="w-24 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto" />
          </motion.div>

          <div className="space-y-6">
            {/* Show actual events or default events */}
            {(events.length > 0 ? events : defaultEvents).map((event, index) => (
              <motion.div
                key={event.id || index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4 md:gap-8"
              >
                {/* Timeline Line */}
                <div className="hidden md:flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full bg-amber-400 shadow-lg shadow-amber-400/30" />
                  {index < (events.length > 0 ? events : defaultEvents).length - 1 && (
                    <div className="w-0.5 h-16 bg-gradient-to-b from-amber-400 to-transparent" />
                  )}
                </div>

                {/* Event Card */}
                <div className="flex-1 p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-amber-400/30 transition-all group">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{eventEmojis[event.event_name] || "🎊"}</span>
                        <h3 className="text-xl font-semibold text-white group-hover:text-amber-300 transition-colors">
                          {event.event_name}
                        </h3>
                      </div>
                      {(event.event_date || event.event_time) && (
                        <div className="flex items-center gap-4 text-white/60 text-sm mb-2">
                          {event.event_date && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {format(new Date(event.event_date), "MMM d, yyyy")}
                            </span>
                          )}
                          {event.event_time && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {event.event_time}
                            </span>
                          )}
                        </div>
                      )}
                      {event.venue_name && (
                        <p className="flex items-center gap-1 text-white/60 text-sm">
                          <MapPin className="w-4 h-4" />
                          {event.venue_name}
                          {event.venue_address && ` • ${event.venue_address}`}
                        </p>
                      )}
                    </div>
                    {event.dress_code && (
                      <Badge className="bg-amber-500/20 text-amber-300 border-amber-400/30">
                        {event.dress_code}
                      </Badge>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            {events.length === 0 && (
              <p className="text-center text-white/50 text-sm mt-4">
                Detailed event schedule coming soon!
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Venue Section */}
      {(website.venue_name || website.venue_address) && (
        <section className="py-20 relative">
          <div className="container mx-auto px-4 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <MapPin className="w-10 h-10 text-amber-400 mx-auto mb-4" />
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
                Wedding Venue
              </h2>
              <div className="w-24 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mb-8" />
              
              <div className="p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                {website.venue_name && (
                  <h3 className="text-2xl font-semibold text-white mb-2">{website.venue_name}</h3>
                )}
                {website.venue_address && (
                  <p className="text-white/70 mb-6">{website.venue_address}</p>
                )}
                <Button
                  variant="outline"
                  className="border-amber-400/50 text-amber-300 hover:bg-amber-400/10"
                  onClick={() => {
                    const address = website.venue_address || website.venue_name;
                    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address || "")}`, '_blank');
                  }}
                >
                  <ExternalLink className="w-4 h-4 mr-2" /> Get Directions
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* RSVP Section */}
      <section id="rsvp" className="py-20 relative">
        <div className={`absolute inset-0 bg-gradient-to-t ${theme.gradient} opacity-10`} />
        <div className="container mx-auto px-4 max-w-lg relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="bg-white/10 backdrop-blur-md border-white/20 overflow-hidden">
              <div className={`h-2 bg-gradient-to-r ${theme.gradient}`} />
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-3xl font-serif text-white flex items-center justify-center gap-2">
                  <PartyPopper className="w-6 h-6 text-amber-400" />
                  RSVP
                </CardTitle>
                <p className="text-white/70 text-sm">
                  Please let us know if you can attend
                </p>
              </CardHeader>
              <CardContent className="pb-8">
                <AnimatePresence mode="wait">
                  {rsvpSubmitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-8"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", damping: 15 }}
                        className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center"
                      >
                        <CheckCircle className="w-10 h-10 text-green-400" />
                      </motion.div>
                      <h3 className="text-2xl font-semibold text-white mb-2">Thank You! 🎉</h3>
                      <p className="text-white/70">
                        Your RSVP has been submitted. We look forward to celebrating with you!
                      </p>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onSubmit={handleRsvpSubmit}
                      className="space-y-4"
                    >
                      <div>
                        <Label htmlFor="guest_name" className="text-white/80">Your Name *</Label>
                        <Input
                          id="guest_name"
                          value={rsvpForm.guest_name}
                          onChange={(e) => setRsvpForm({ ...rsvpForm, guest_name: e.target.value })}
                          placeholder="Enter your full name"
                          required
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-amber-400"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="email" className="text-white/80">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={rsvpForm.email}
                            onChange={(e) => setRsvpForm({ ...rsvpForm, email: e.target.value })}
                            placeholder="your@email.com"
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-amber-400"
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone" className="text-white/80">Phone</Label>
                          <Input
                            id="phone"
                            value={rsvpForm.phone}
                            onChange={(e) => setRsvpForm({ ...rsvpForm, phone: e.target.value })}
                            placeholder="+91 XXXXX XXXXX"
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-amber-400"
                          />
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 p-4 rounded-lg bg-white/5 border border-white/10">
                        <Checkbox
                          id="attending"
                          checked={rsvpForm.attending}
                          onCheckedChange={(checked) => 
                            setRsvpForm({ ...rsvpForm, attending: checked as boolean })
                          }
                          className="border-white/30 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
                        />
                        <Label htmlFor="attending" className="cursor-pointer text-white">
                          🎉 Yes, I will attend!
                        </Label>
                      </div>

                      {rsvpForm.attending && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-4"
                        >
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="guest_count" className="text-white/80">Number of Guests</Label>
                              <Select
                                value={rsvpForm.guest_count.toString()}
                                onValueChange={(value) => 
                                  setRsvpForm({ ...rsvpForm, guest_count: parseInt(value) })
                                }
                              >
                                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {[1, 2, 3, 4, 5].map((num) => (
                                    <SelectItem key={num} value={num.toString()}>
                                      {num} {num === 1 ? "guest" : "guests"}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="meal_preference" className="text-white/80">Meal Preference</Label>
                              <Select
                                value={rsvpForm.meal_preference}
                                onValueChange={(value) => 
                                  setRsvpForm({ ...rsvpForm, meal_preference: value })
                                }
                              >
                                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                                  <SelectValue placeholder="Select..." />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="vegetarian">🥗 Vegetarian</SelectItem>
                                  <SelectItem value="non-vegetarian">🍗 Non-Vegetarian</SelectItem>
                                  <SelectItem value="vegan">🌱 Vegan</SelectItem>
                                  <SelectItem value="jain">🙏 Jain</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="dietary_restrictions" className="text-white/80">Dietary Restrictions</Label>
                            <Input
                              id="dietary_restrictions"
                              value={rsvpForm.dietary_restrictions}
                              onChange={(e) => 
                                setRsvpForm({ ...rsvpForm, dietary_restrictions: e.target.value })
                              }
                              placeholder="Any allergies or dietary requirements?"
                              className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-amber-400"
                            />
                          </div>
                        </motion.div>
                      )}

                      <div>
                        <Label htmlFor="message" className="text-white/80">Message for the Couple</Label>
                        <Textarea
                          id="message"
                          value={rsvpForm.message}
                          onChange={(e) => setRsvpForm({ ...rsvpForm, message: e.target.value })}
                          placeholder="Share your wishes..."
                          rows={3}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-amber-400 resize-none"
                        />
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full bg-amber-500 hover:bg-amber-600 text-amber-950 font-semibold py-6" 
                        disabled={submitting}
                      >
                        {submitting ? (
                          <span className="flex items-center gap-2">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                              <Heart className="w-4 h-4" />
                            </motion.div>
                            Submitting...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <Send className="w-4 h-4" />
                            Submit RSVP
                          </span>
                        )}
                      </Button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      {(website.contact_phone || website.contact_email) && (
        <section className="py-12">
          <div className="container mx-auto px-4 max-w-2xl">
            <div className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">Questions? Reach out to us</h3>
              <div className="flex flex-wrap justify-center gap-4">
                {website.contact_phone && (
                  <a
                    href={`tel:${website.contact_phone}`}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white/80 hover:text-white hover:bg-white/20 transition-all"
                  >
                    <Phone className="w-4 h-4" />
                    {website.contact_phone}
                  </a>
                )}
                {website.contact_email && (
                  <a
                    href={`mailto:${website.contact_email}`}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white/80 hover:text-white hover:bg-white/20 transition-all"
                  >
                    <Mail className="w-4 h-4" />
                    {website.contact_email}
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-8 border-t border-white/10">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 text-white/50 text-sm">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
            <span>on</span>
            <a 
              href="https://karloshaadi.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-amber-400 hover:text-amber-300 font-semibold transition-colors"
            >
              Karlo Shaadi
            </a>
          </div>
          <p className="text-white/30 text-xs mt-2">
            Create your own free wedding website
          </p>
        </div>
      </footer>
    </div>
  );
};

export default WeddingView;
