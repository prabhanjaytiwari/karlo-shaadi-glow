import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { BhindiHeader } from "@/components/BhindiHeader";
import { BhindiFooter } from "@/components/BhindiFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Download } from "lucide-react";
import { SEO } from "@/components/SEO";
import { sanitizeInput } from "@/lib/validation";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    full_name: "",
    phone: "",
    city: "",
    wedding_date: "",
    budget_range: "",
    partner_name: "",
    venue_city: "",
    guest_count: undefined as number | undefined,
    preferred_season: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/auth");
        return;
      }

      // Check if user is a vendor - redirect to vendor dashboard
      const { data: vendorData } = await supabase
        .from("vendors")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (vendorData) {
        toast({
          title: "Redirecting...",
          description: "Please update your profile from the Vendor Dashboard",
        });
        navigate("/vendor/dashboard?tab=profile");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;

      if (data) {
        setProfile({
          full_name: data.full_name || "",
          phone: data.phone || "",
          city: data.city || "",
          wedding_date: data.wedding_date || "",
          budget_range: data.budget_range || "",
          partner_name: data.partner_name || "",
          venue_city: data.venue_city || "",
          guest_count: data.guest_count || undefined,
          preferred_season: data.preferred_season || "",
        });
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Validation
      const trimmedName = profile.full_name.trim();
      const trimmedPhone = profile.phone?.trim() || "";
      const trimmedCity = profile.city?.trim() || "";

      if (!trimmedName || trimmedName.length < 2 || trimmedName.length > 100) {
        toast({
          title: "Validation error",
          description: "Name must be between 2-100 characters",
          variant: "destructive",
        });
        setSaving(false);
        return;
      }

      if (trimmedPhone && !/^[6-9]\d{9}$/.test(trimmedPhone)) {
        toast({
          title: "Validation error",
          description: "Please enter a valid Indian phone number",
          variant: "destructive",
        });
        setSaving(false);
        return;
      }

      if (trimmedCity && trimmedCity.length > 100) {
        toast({
          title: "Validation error",
          description: "City name must be less than 100 characters",
          variant: "destructive",
        });
        setSaving(false);
        return;
      }

      if (profile.guest_count && (profile.guest_count < 1 || profile.guest_count > 10000)) {
        toast({
          title: "Validation error",
          description: "Guest count must be between 1-10,000",
          variant: "destructive",
        });
        setSaving(false);
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: sanitizeInput(trimmedName),
          phone: trimmedPhone || null,
          city: trimmedCity ? sanitizeInput(trimmedCity) : null,
          wedding_date: profile.wedding_date || null,
          budget_range: profile.budget_range || null,
          partner_name: profile.partner_name ? sanitizeInput(profile.partner_name.trim()) : null,
          venue_city: profile.venue_city ? sanitizeInput(profile.venue_city.trim()) : null,
          guest_count: profile.guest_count || null,
          preferred_season: profile.preferred_season || null,
        })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Profile updated!",
        description: "Your changes have been saved successfully.",
      });
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="My Profile"
        description="Manage your wedding profile, preferences, and personal information on Karlo Shaadi"
        keywords="profile, wedding planning, user settings"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-rose-50/80 via-white to-amber-50/60">
        <BhindiHeader />
      
      <main className="pt-16 sm:pt-24 pb-8 sm:pb-16">
        <div className="container mx-auto px-4 sm:px-6 max-w-2xl">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="mb-4 sm:mb-6 hover:text-accent text-sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <Card className="animate-fade-up bg-white/90 border border-accent/20 shadow-xl">
            <CardHeader className="p-4 sm:p-6">
              <div className="w-12 sm:w-16 h-1 bg-gradient-to-r from-accent/50 via-accent to-accent/50 rounded-full mb-3 sm:mb-4" />
              <CardTitle className="text-2xl sm:text-3xl text-foreground">Edit Profile</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Update your wedding details and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name *</Label>
                  <Input
                    id="full_name"
                    value={profile.full_name}
                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="partner_name">Partner's Name</Label>
                    <Input
                      id="partner_name"
                      placeholder="Your partner's full name"
                      value={profile.partner_name}
                      onChange={(e) => setProfile({ ...profile, partner_name: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Your Current City *</Label>
                    <Input
                      id="city"
                      placeholder="e.g., Mumbai, Delhi, Bangalore"
                      value={profile.city}
                      onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="venue_city">Wedding Venue City</Label>
                    <Input
                      id="venue_city"
                      placeholder="Where will the wedding be held?"
                      value={profile.venue_city}
                      onChange={(e) => setProfile({ ...profile, venue_city: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="wedding_date">Wedding Date *</Label>
                    <Input
                      id="wedding_date"
                      type="date"
                      value={profile.wedding_date}
                      onChange={(e) => setProfile({ ...profile, wedding_date: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preferred_season">Preferred Season</Label>
                    <Select
                      value={profile.preferred_season}
                      onValueChange={(value) => setProfile({ ...profile, preferred_season: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select season" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="winter">Winter (Nov-Feb)</SelectItem>
                        <SelectItem value="spring">Spring (Mar-Apr)</SelectItem>
                        <SelectItem value="summer">Summer (May-Jun)</SelectItem>
                        <SelectItem value="monsoon">Monsoon (Jul-Sep)</SelectItem>
                        <SelectItem value="autumn">Autumn (Oct-Nov)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="guest_count">Expected Guest Count</Label>
                    <Input
                      id="guest_count"
                      type="number"
                      placeholder="e.g., 200"
                      value={profile.guest_count || ""}
                      onChange={(e) => setProfile({ ...profile, guest_count: e.target.value ? parseInt(e.target.value) : undefined })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="budget_range">Budget Range *</Label>
                    <Select
                      value={profile.budget_range}
                      onValueChange={(value) => setProfile({ ...profile, budget_range: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your budget" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="under-5L">Under ₹5 Lakhs</SelectItem>
                        <SelectItem value="5L-10L">₹5-10 Lakhs</SelectItem>
                        <SelectItem value="10L-25L">₹10-25 Lakhs</SelectItem>
                        <SelectItem value="25L-50L">₹25-50 Lakhs</SelectItem>
                        <SelectItem value="50L-1Cr">₹50 Lakhs - 1 Crore</SelectItem>
                        <SelectItem value="above-1Cr">Above ₹1 Crore</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="submit" className="flex-1" disabled={saving}>
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate("/dashboard")}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Data Export Card */}
          <Card className="mt-6 bg-white/90 border-2 border-accent/20">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Download className="w-5 h-5 text-accent" />
                Export Your Data
              </CardTitle>
              <CardDescription>
                Download all your wedding planning data including bookings, favorites, and messages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/data-export">
                <Button variant="outline" className="w-full sm:w-auto border-accent/30 hover:border-accent/50">
                  <Download className="w-4 h-4 mr-2" />
                  Go to Data Export
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>

      <BhindiFooter />
    </div>
    </>
  );
};

export default Profile;
