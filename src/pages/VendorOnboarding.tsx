import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Building2, MapPin, Users, Calendar } from "lucide-react";

import { Database } from "@/integrations/supabase/types";

  const CATEGORIES: Database["public"]["Enums"]["vendor_category"][] = [
    "venues", "catering", "photography", "decoration", 
    "mehendi", "music", "cakes", "planning"
  ];

export default function VendorOnboarding() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [cities, setCities] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    businessName: "",
    category: "",
    cityId: "",
    description: "",
    yearsExperience: "",
    teamSize: "",
    websiteUrl: "",
    instagramHandle: "",
  });

  useEffect(() => {
    loadCities();
  }, []);

  const loadCities = async () => {
    const { data } = await supabase.from("cities").select("*").eq("is_active", true);
    if (data) setCities(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error: vendorError } = await supabase.from("vendors").insert([{
        user_id: user.id,
        business_name: formData.businessName,
        category: formData.category as Database["public"]["Enums"]["vendor_category"],
        city_id: formData.cityId || null,
        description: formData.description,
        years_experience: parseInt(formData.yearsExperience) || 0,
        team_size: parseInt(formData.teamSize) || null,
        website_url: formData.websiteUrl || null,
        instagram_handle: formData.instagramHandle || null,
      }]);

      if (vendorError) throw vendorError;

      const { error: roleError } = await supabase.from("user_roles").insert([{
        user_id: user.id,
        role: "vendor" as Database["public"]["Enums"]["app_role"],
      }]);

      if (roleError) throw roleError;

      toast({
        title: "Success!",
        description: "Your vendor profile has been created.",
      });

      navigate("/vendor/dashboard");
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Become a Vendor</h1>
          <p className="text-muted-foreground">Join Karlo Shaadi and grow your wedding business</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Vendor Registration</CardTitle>
            <CardDescription>Tell us about your business</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name *</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="businessName"
                    placeholder="Your business name"
                    className="pl-10"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Select
                    value={formData.cityId}
                    onValueChange={(value) => setFormData({ ...formData, cityId: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city.id} value={city.id}>
                          {city.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Business Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Tell couples about your services..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="experience">Years of Experience</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="experience"
                      type="number"
                      placeholder="5"
                      className="pl-10"
                      value={formData.yearsExperience}
                      onChange={(e) => setFormData({ ...formData, yearsExperience: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="teamSize">Team Size</Label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="teamSize"
                      type="number"
                      placeholder="10"
                      className="pl-10"
                      value={formData.teamSize}
                      onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website URL</Label>
                <Input
                  id="website"
                  type="url"
                  placeholder="https://yourbusiness.com"
                  value={formData.websiteUrl}
                  onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram Handle</Label>
                <Input
                  id="instagram"
                  placeholder="@yourbusiness"
                  value={formData.instagramHandle}
                  onChange={(e) => setFormData({ ...formData, instagramHandle: e.target.value })}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating Profile..." : "Create Vendor Profile"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
