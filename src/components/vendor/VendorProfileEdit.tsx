import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Building2, MapPin, Globe, Instagram, Users, Briefcase } from "lucide-react";

interface VendorProfileEditProps {
  vendor: any;
  onUpdate: () => void;
}

export function VendorProfileEdit({ vendor, onUpdate }: VendorProfileEditProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    business_name: vendor?.business_name || "",
    description: vendor?.description || "",
    website_url: vendor?.website_url || "",
    instagram_handle: vendor?.instagram_handle || "",
    years_experience: vendor?.years_experience || 0,
    team_size: vendor?.team_size || 1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("vendors")
        .update(formData)
        .eq("id", vendor.id);

      if (error) throw error;

      toast({
        title: "Profile Updated",
        description: "Your vendor profile has been updated successfully.",
      });
      onUpdate();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
            <CardDescription>Update your business details and contact information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="business_name">
                <Building2 className="h-4 w-4 inline mr-2" />
                Business Name
              </Label>
              <Input
                id="business_name"
                value={formData.business_name}
                onChange={(e) => handleChange("business_name", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Tell clients about your services, expertise, and what makes you unique..."
                rows={4}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="years_experience">
                  <Briefcase className="h-4 w-4 inline mr-2" />
                  Years of Experience
                </Label>
                <Input
                  id="years_experience"
                  type="number"
                  min="0"
                  value={formData.years_experience}
                  onChange={(e) => handleChange("years_experience", parseInt(e.target.value) || 0)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="team_size">
                  <Users className="h-4 w-4 inline mr-2" />
                  Team Size
                </Label>
                <Input
                  id="team_size"
                  type="number"
                  min="1"
                  value={formData.team_size}
                  onChange={(e) => handleChange("team_size", parseInt(e.target.value) || 1)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Online Presence</CardTitle>
            <CardDescription>Connect your social media and website</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="website_url">
                <Globe className="h-4 w-4 inline mr-2" />
                Website URL
              </Label>
              <Input
                id="website_url"
                type="url"
                placeholder="https://yourwebsite.com"
                value={formData.website_url}
                onChange={(e) => handleChange("website_url", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instagram_handle">
                <Instagram className="h-4 w-4 inline mr-2" />
                Instagram Handle
              </Label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                  @
                </span>
                <Input
                  id="instagram_handle"
                  placeholder="yourhandle"
                  value={formData.instagram_handle}
                  onChange={(e) => handleChange("instagram_handle", e.target.value)}
                  className="rounded-l-none"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </form>
  );
}
