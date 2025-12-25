import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SEO } from "@/components/SEO";
import { BhindiFooter } from "@/components/BhindiFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar, MapPin, Heart, Users, Send, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface WeddingWebsite {
  id: string;
  couple_names: string;
  wedding_date: string | null;
  venue_name: string | null;
  venue_address: string | null;
  story: string | null;
  theme: string | null;
  cover_image_url: string | null;
  is_published: boolean;
}

const WeddingView = () => {
  const { slug } = useParams<{ slug: string }>();
  const [website, setWebsite] = useState<WeddingWebsite | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
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
      }
    } catch (error) {
      console.error("Error loading wedding website:", error);
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
      console.error("Error submitting RSVP:", error);
      toast.error("Failed to submit RSVP. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const getThemeClasses = (theme: string | null) => {
    switch (theme) {
      case "royal":
        return "bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50";
      case "modern":
        return "bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100";
      case "romantic":
        return "bg-gradient-to-br from-pink-50 via-rose-50 to-red-50";
      case "traditional":
        return "bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50";
      default:
        return "bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (notFound || !website) {
    return (
      <div className="min-h-screen bg-background">
        <SEO title="Wedding Not Found" description="This wedding website could not be found." />
        <div className="pt-20 container mx-auto px-4 text-center">
          <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Wedding Not Found</h1>
          <p className="text-muted-foreground mb-6">
            This wedding website doesn't exist or hasn't been published yet.
          </p>
          <Button onClick={() => window.location.href = "/"}>
            Go to Homepage
          </Button>
        </div>
        <BhindiFooter />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${getThemeClasses(website.theme)}`}>
      <SEO
        title={`${website.couple_names}'s Wedding`}
        description={`You're invited to ${website.couple_names}'s wedding${website.wedding_date ? ` on ${format(new Date(website.wedding_date), "MMMM d, yyyy")}` : ""}.`}
      />

      {/* Hero Section */}
      <div className="relative pt-20 pb-16">
        {website.cover_image_url && (
          <div className="absolute inset-0 z-0">
            <img
              src={website.cover_image_url}
              alt="Wedding cover"
              className="w-full h-full object-cover opacity-20"
            />
          </div>
        )}
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Heart className="h-8 w-8 text-accent fill-accent" />
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-foreground mb-4">
            {website.couple_names}
          </h1>
          <p className="text-lg text-muted-foreground mb-8">are getting married!</p>
          
          {website.wedding_date && (
            <div className="inline-flex items-center gap-2 bg-background/80 backdrop-blur-sm px-6 py-3 rounded-full border border-border">
              <Calendar className="h-5 w-5 text-accent" />
              <span className="font-medium">
                {format(new Date(website.wedding_date), "EEEE, MMMM d, yyyy")}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Story Section */}
      {website.story && (
        <div className="py-12 bg-background/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 max-w-3xl text-center">
            <h2 className="text-2xl font-serif font-semibold mb-6">Our Story</h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {website.story}
            </p>
          </div>
        </div>
      )}

      {/* Venue Section */}
      {(website.venue_name || website.venue_address) && (
        <div className="py-12">
          <div className="container mx-auto px-4 max-w-3xl text-center">
            <h2 className="text-2xl font-serif font-semibold mb-6">Venue</h2>
            <div className="inline-flex flex-col items-center gap-2">
              <MapPin className="h-6 w-6 text-accent" />
              {website.venue_name && (
                <p className="font-medium text-lg">{website.venue_name}</p>
              )}
              {website.venue_address && (
                <p className="text-muted-foreground">{website.venue_address}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* RSVP Section */}
      <div className="py-12 bg-background/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 max-w-lg">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-serif">RSVP</CardTitle>
              <p className="text-muted-foreground text-sm">
                Please let us know if you can attend
              </p>
            </CardHeader>
            <CardContent>
              {rsvpSubmitted ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Thank You!</h3>
                  <p className="text-muted-foreground">
                    Your RSVP has been submitted. We look forward to celebrating with you!
                  </p>
                </div>
              ) : (
                <form onSubmit={handleRsvpSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="guest_name">Your Name *</Label>
                    <Input
                      id="guest_name"
                      value={rsvpForm.guest_name}
                      onChange={(e) => setRsvpForm({ ...rsvpForm, guest_name: e.target.value })}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={rsvpForm.email}
                        onChange={(e) => setRsvpForm({ ...rsvpForm, email: e.target.value })}
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={rsvpForm.phone}
                        onChange={(e) => setRsvpForm({ ...rsvpForm, phone: e.target.value })}
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="attending"
                      checked={rsvpForm.attending}
                      onCheckedChange={(checked) => 
                        setRsvpForm({ ...rsvpForm, attending: checked as boolean })
                      }
                    />
                    <Label htmlFor="attending" className="cursor-pointer">
                      Yes, I will attend!
                    </Label>
                  </div>

                  {rsvpForm.attending && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="guest_count">Number of Guests</Label>
                          <Select
                            value={rsvpForm.guest_count.toString()}
                            onValueChange={(value) => 
                              setRsvpForm({ ...rsvpForm, guest_count: parseInt(value) })
                            }
                          >
                            <SelectTrigger>
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
                          <Label htmlFor="meal_preference">Meal Preference</Label>
                          <Select
                            value={rsvpForm.meal_preference}
                            onValueChange={(value) => 
                              setRsvpForm({ ...rsvpForm, meal_preference: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="vegetarian">Vegetarian</SelectItem>
                              <SelectItem value="non-vegetarian">Non-Vegetarian</SelectItem>
                              <SelectItem value="vegan">Vegan</SelectItem>
                              <SelectItem value="jain">Jain</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="dietary_restrictions">Dietary Restrictions</Label>
                        <Input
                          id="dietary_restrictions"
                          value={rsvpForm.dietary_restrictions}
                          onChange={(e) => 
                            setRsvpForm({ ...rsvpForm, dietary_restrictions: e.target.value })
                          }
                          placeholder="Any allergies or dietary requirements?"
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <Label htmlFor="message">Message for the Couple</Label>
                    <Textarea
                      id="message"
                      value={rsvpForm.message}
                      onChange={(e) => setRsvpForm({ ...rsvpForm, message: e.target.value })}
                      placeholder="Share your wishes..."
                      rows={3}
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting ? (
                      "Submitting..."
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Submit RSVP
                      </>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <div className="py-8 text-center text-sm text-muted-foreground">
        <p>Made with ❤️ on Karlo Shaadi</p>
      </div>
    </div>
  );
};

export default WeddingView;
