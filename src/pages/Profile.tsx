import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Save, Download, User } from "lucide-react";
import { SEO } from "@/components/SEO";
import { profileUpdateSchema, sanitizeInput } from "@/lib/validation";
import { MobilePageHeader } from "@/components/mobile/MobilePageHeader";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuthContext } from "@/contexts/AuthContext";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { user, isVendor, isAdmin, loading: authLoading } = useAuthContext();
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
    if (authLoading) return;
    
    if (!user) {
      navigate("/auth");
      return;
    }

    // Vendor users (who aren't also admins) should edit profile from vendor dashboard
    if (isVendor && !isAdmin) {
      toast({ title: "Redirecting...", description: "Please update your profile from the Vendor Dashboard" });
      navigate("/vendor/dashboard?tab=profile");
      return;
    }

    const loadProfile = async () => {
      try {
        const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single();
        if (error) throw error;
        if (data) {
          setProfile({
            full_name: data.full_name || "", phone: data.phone || "", city: data.city || "",
            wedding_date: data.wedding_date || "", budget_range: data.budget_range || "",
            partner_name: data.partner_name || "", venue_city: data.venue_city || "",
            guest_count: data.guest_count || undefined, preferred_season: data.preferred_season || "",
          });
        }
      } catch (error) { console.error("Error loading profile:", error); }
      finally { setLoading(false); }
    };

    loadProfile();
  }, [user, authLoading, isVendor, isAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const trimmedName = profile.full_name.trim();
      const trimmedPhone = profile.phone?.trim() || "";
      const trimmedCity = profile.city?.trim() || "";

      if (!trimmedName || trimmedName.length < 2 || trimmedName.length > 100) {
        toast({ title: "Validation error", description: "Name must be between 2-100 characters", variant: "destructive" });
        setSaving(false); return;
      }
      if (trimmedPhone && !/^[6-9]\d{9}$/.test(trimmedPhone)) {
        toast({ title: "Validation error", description: "Please enter a valid Indian phone number", variant: "destructive" });
        setSaving(false); return;
      }
      if (trimmedCity && trimmedCity.length > 100) {
        toast({ title: "Validation error", description: "City name must be less than 100 characters", variant: "destructive" });
        setSaving(false); return;
      }
      if (profile.guest_count && (profile.guest_count < 1 || profile.guest_count > 10000)) {
        toast({ title: "Validation error", description: "Guest count must be between 1-10,000", variant: "destructive" });
        setSaving(false); return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("profiles").update({
        full_name: sanitizeInput(trimmedName), phone: trimmedPhone || null,
        city: trimmedCity ? sanitizeInput(trimmedCity) : null, wedding_date: profile.wedding_date || null,
        budget_range: profile.budget_range || null, partner_name: profile.partner_name ? sanitizeInput(profile.partner_name.trim()) : null,
        venue_city: profile.venue_city ? sanitizeInput(profile.venue_city.trim()) : null,
        guest_count: profile.guest_count || null, preferred_season: profile.preferred_season || null,
      }).eq("id", user.id);

      if (error) throw error;
      toast({ title: "Profile updated!", description: "Your changes have been saved successfully." });
      navigate("/dashboard");
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to update profile", variant: "destructive" });
    } finally { setSaving(false); }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    );
  }

  const initials = profile.full_name
    ? profile.full_name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <>
      <SEO title="My Profile" description="Manage your wedding profile, preferences, and personal information on Karlo Shaadi" />
      
      <div className="min-h-screen bg-background">
        <MobilePageHeader title="Edit Profile" />
      
        <main className={isMobile ? "px-4 py-4 pb-24" : "pt-24 pb-16"}>
          <div className={isMobile ? "" : "container mx-auto px-6 max-w-2xl"}>
            {/* Avatar */}
            <div className="flex flex-col items-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-border/50 flex items-center justify-center mb-2">
                <span className="text-2xl font-bold text-primary">{initials}</span>
              </div>
              <p className="text-sm text-muted-foreground">{profile.full_name || "Your Name"}</p>
            </div>

            <Card className="rounded-2xl border-border/50 bg-card">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Wedding Details</CardTitle>
                <CardDescription className="text-sm">Update your wedding details and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-1.5">
                    <Label htmlFor="full_name" className="text-sm">Full Name *</Label>
                    <Input id="full_name" value={profile.full_name} onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} required className="rounded-xl" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="phone" className="text-sm">Phone *</Label>
                      <Input id="phone" type="tel" placeholder="98765 43210" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} required className="rounded-xl" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="partner_name" className="text-sm">Partner's Name</Label>
                      <Input id="partner_name" placeholder="Partner name" value={profile.partner_name} onChange={(e) => setProfile({ ...profile, partner_name: e.target.value })} className="rounded-xl" />
                    </div>
                  </div>

                  <div className="h-px bg-border/50" />

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="city" className="text-sm">Your City *</Label>
                      <Input id="city" placeholder="e.g., Mumbai" value={profile.city} onChange={(e) => setProfile({ ...profile, city: e.target.value })} required className="rounded-xl" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="venue_city" className="text-sm">Venue City</Label>
                      <Input id="venue_city" placeholder="Wedding city" value={profile.venue_city} onChange={(e) => setProfile({ ...profile, venue_city: e.target.value })} className="rounded-xl" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="wedding_date" className="text-sm">Wedding Date *</Label>
                      <Input id="wedding_date" type="date" value={profile.wedding_date} onChange={(e) => setProfile({ ...profile, wedding_date: e.target.value })} required className="rounded-xl" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="preferred_season" className="text-sm">Preferred Season</Label>
                      <Select value={profile.preferred_season} onValueChange={(value) => setProfile({ ...profile, preferred_season: value })}>
                        <SelectTrigger className="rounded-xl"><SelectValue placeholder="Select" /></SelectTrigger>
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

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="guest_count" className="text-sm">Guest Count</Label>
                      <Input id="guest_count" type="number" placeholder="e.g., 200" value={profile.guest_count || ""} onChange={(e) => setProfile({ ...profile, guest_count: e.target.value ? parseInt(e.target.value) : undefined })} className="rounded-xl" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="budget_range" className="text-sm">Budget Range *</Label>
                      <Select value={profile.budget_range} onValueChange={(value) => setProfile({ ...profile, budget_range: value })}>
                        <SelectTrigger className="rounded-xl"><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="under-5L">Under ₹5 Lakhs</SelectItem>
                          <SelectItem value="5L-10L">₹5-10 Lakhs</SelectItem>
                          <SelectItem value="10L-25L">₹10-25 Lakhs</SelectItem>
                          <SelectItem value="25L-50L">₹25-50 Lakhs</SelectItem>
                          <SelectItem value="50L-1Cr">₹50L - 1 Crore</SelectItem>
                          <SelectItem value="above-1Cr">Above ₹1 Crore</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button type="submit" className="flex-1 rounded-full" disabled={saving}>
                      <Save className="h-4 w-4 mr-2" />
                      {saving ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => navigate("/dashboard")} className="rounded-full">
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Data Export */}
            <Card className="mt-4 rounded-2xl border-border/50 bg-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Download className="w-4 h-4 text-accent" /> Export Your Data
                </CardTitle>
                <CardDescription className="text-sm">Download all your wedding planning data</CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/data-export">
                  <Button variant="outline" className="w-full sm:w-auto rounded-full border-border/50">
                    <Download className="w-4 h-4 mr-2" /> Go to Data Export
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </>
  );
};

export default Profile;
