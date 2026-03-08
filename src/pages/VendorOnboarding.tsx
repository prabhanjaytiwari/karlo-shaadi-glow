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
import { Building2, MapPin, Users, Calendar, Phone, Instagram, Facebook, Upload, Loader2, Globe, Map, IndianRupee, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { sanitizeInput } from "@/lib/validation";
import { Progress } from "@/components/ui/progress";
import { MobilePageHeader } from "@/components/mobile/MobilePageHeader";
import { useIsMobile } from "@/hooks/use-mobile";

import { Database } from "@/integrations/supabase/types";

const CATEGORIES: { value: Database["public"]["Enums"]["vendor_category"]; label: string }[] = [
  { value: "venues", label: "Venues" },
  { value: "catering", label: "Catering" },
  { value: "photography", label: "Photography" },
  { value: "decoration", label: "Decoration" },
  { value: "mehendi", label: "Mehendi" },
  { value: "music", label: "Music & DJ" },
  { value: "cakes", label: "Cakes & Desserts" },
  { value: "planning", label: "Wedding Planning" },
  { value: "makeup", label: "Makeup" },
  { value: "invitations", label: "Invitations" },
  { value: "choreography", label: "Choreography" },
  { value: "transport", label: "Transport" },
  { value: "jewelry", label: "Jewelry" },
  { value: "pandit", label: "Pandit" },
  { value: "entertainment", label: "Entertainment" },
  { value: "influencer", label: "Influencer" },
  { value: "anchor", label: "Anchor / Emcee" },
  { value: "content-creator", label: "Content Creator" },
  { value: "social-media-managers", label: "Shaadi Social Media Manager" },
];

export default function VendorOnboarding() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [cities, setCities] = useState<any[]>([]);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    businessName: "",
    category: "",
    cityId: "",
    description: "",
    yearsExperience: "",
    teamSize: "",
    websiteUrl: "",
    instagramHandle: "",
    facebookPage: "",
    googleMapsLink: "",
    phoneNumber: "",
    whatsappNumber: "",
    address: "",
    startingPrice: "",
    genderPreference: "",
  });

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  useEffect(() => {
    checkExistingVendor();
    loadCities();
  }, []);

  const checkExistingVendor = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: vendorData } = await supabase
      .from("vendors")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (vendorData) {
      toast({
        title: "Already Registered",
        description: "You already have a vendor profile. Redirecting to your dashboard.",
      });
      navigate("/vendor/dashboard");
    }
  };

  const loadCities = async () => {
    const { data } = await supabase.from("cities").select("*").eq("is_active", true);
    if (data) setCities(data);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadLogo = async (userId: string): Promise<string | null> => {
    if (!logoFile) return null;
    
    const fileExt = logoFile.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('vendor-logos')
      .upload(fileName, logoFile);

    if (uploadError) {
      console.error("Logo upload error:", uploadError);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('vendor-logos')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const validateStep1 = () => {
    const trimmedBusinessName = formData.businessName.trim();
    if (!trimmedBusinessName || trimmedBusinessName.length < 3 || trimmedBusinessName.length > 100) {
      toast({
        title: "Validation error",
        description: "Business name must be between 3-100 characters",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.category || !formData.cityId) {
      toast({
        title: "Validation error",
        description: "Category and city are required",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    const trimmedDescription = formData.description.trim();
    if (!trimmedDescription || trimmedDescription.length < 20 || trimmedDescription.length > 500) {
      toast({
        title: "Validation error",
        description: "Description must be between 20-500 characters",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Upload logo if provided
      let logoUrl = null;
      if (logoFile) {
        logoUrl = await uploadLogo(user.id);
      }

      const { error: vendorError } = await supabase.from("vendors").insert([{
        user_id: user.id,
        business_name: sanitizeInput(formData.businessName.trim()),
        category: formData.category as Database["public"]["Enums"]["vendor_category"],
        city_id: formData.cityId || null,
        description: sanitizeInput(formData.description.trim()),
        years_experience: parseInt(formData.yearsExperience) || 0,
        team_size: parseInt(formData.teamSize) || null,
        website_url: formData.websiteUrl ? sanitizeInput(formData.websiteUrl.trim()) : null,
        instagram_handle: formData.instagramHandle ? sanitizeInput(formData.instagramHandle.trim()) : null,
        facebook_page: formData.facebookPage ? sanitizeInput(formData.facebookPage.trim()) : null,
        google_maps_link: formData.googleMapsLink ? sanitizeInput(formData.googleMapsLink.trim()) : null,
        phone_number: formData.phoneNumber ? sanitizeInput(formData.phoneNumber.trim()) : null,
        whatsapp_number: formData.whatsappNumber ? sanitizeInput(formData.whatsappNumber.trim()) : null,
        address: formData.address ? sanitizeInput(formData.address.trim()) : null,
        starting_price: formData.startingPrice ? parseInt(formData.startingPrice) : null,
        gender_preference: formData.genderPreference || null,
        logo_url: logoUrl,
        verification_status: 'pending',
      }]);

      if (vendorError) throw vendorError;

      toast({
        title: "Registration Successful!",
        description: "Your vendor profile has been created. Our team will review and verify your profile within 24-48 hours.",
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
    <div className="min-h-screen bg-gradient-to-br from-rose-50/80 via-white to-amber-50/60 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Badge className="bg-accent text-accent-foreground mb-4">For Vendors</Badge>
          <h1 className="text-4xl font-bold mb-2">Become a Vendor</h1>
          <p className="text-muted-foreground">Join Karlo Shaadi and grow your wedding business</p>
          <div className="w-24 h-1 bg-gradient-to-r from-accent/50 via-accent to-accent/50 mx-auto mt-4 rounded-full" />
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Step {step} of {totalSteps}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="bg-white/90 backdrop-blur-sm border-2 border-accent/20 shadow-lg">
          <CardHeader>
            <CardTitle>
              {step === 1 && "Basic Information"}
              {step === 2 && "Business Details"}
              {step === 3 && "Verification Details"}
            </CardTitle>
            <CardDescription>
              {step === 1 && "Tell us about your business"}
              {step === 2 && "Help couples understand your services"}
              {step === 3 && "Required for profile verification"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Basic Information */}
              {step === 1 && (
                <>
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
                            <SelectItem key={cat.value} value={cat.value}>
                              {cat.label}
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

                  {/* Starting Price */}
                  <div className="space-y-2">
                    <Label htmlFor="startingPrice">Starting Price (₹) *</Label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="startingPrice"
                        type="number"
                        placeholder="25000"
                        className="pl-10"
                        value={formData.startingPrice}
                        onChange={(e) => setFormData({ ...formData, startingPrice: e.target.value })}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      This helps couples filter vendors by budget
                    </p>
                  </div>

                  {/* Gender Preference - Only for relevant categories */}
                  {(formData.category === 'makeup' || formData.category === 'photography' || formData.category === 'mehendi') && (
                    <div className="space-y-2">
                      <Label htmlFor="genderPreference">Service Provider Gender</Label>
                      <Select
                        value={formData.genderPreference}
                        onValueChange={(value) => setFormData({ ...formData, genderPreference: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select preference" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="female">Female Only</SelectItem>
                          <SelectItem value="male">Male Only</SelectItem>
                          <SelectItem value="any">Both Available</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        Important for clients who prefer a specific gender
                      </p>
                    </div>
                  )}
                </>
              )}

              {/* Step 2: Business Details */}
              {step === 2 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="description">Business Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Tell couples about your services, experience, and what makes you special... (min 20 characters)"
                      rows={5}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      {formData.description.length}/500 characters
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Website URL</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="website"
                        type="url"
                        placeholder="https://yourbusiness.com"
                        className="pl-10"
                        value={formData.websiteUrl}
                        onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="instagram">Instagram Profile *</Label>
                      <div className="relative">
                        <Instagram className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="instagram"
                          placeholder="https://instagram.com/..."
                          className="pl-10"
                          value={formData.instagramHandle}
                          onChange={(e) => setFormData({ ...formData, instagramHandle: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="facebook">Facebook Page</Label>
                      <div className="relative">
                        <Facebook className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="facebook"
                          placeholder="https://facebook.com/..."
                          className="pl-10"
                          value={formData.facebookPage}
                          onChange={(e) => setFormData({ ...formData, facebookPage: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Step 3: Verification Details */}
              {step === 3 && (
                <>
                  <div className="bg-accent/10 border border-accent/30 rounded-lg p-4 mb-6">
                    <h4 className="font-semibold text-sm mb-2">Why these details?</h4>
                    <p className="text-xs text-muted-foreground">
                      We verify all vendors to ensure quality and trust. Complete profiles get verified faster and rank higher in search results.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+91 98765 43210"
                          className="pl-10"
                          value={formData.phoneNumber}
                          onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="whatsapp">WhatsApp Number *</Label>
                      <div className="relative">
                        <MessageCircle className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="whatsapp"
                          type="tel"
                          placeholder="+91 98765 43210"
                          className="pl-10"
                          value={formData.whatsappNumber}
                          onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Couples will use this for direct WhatsApp chat
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Business Address *</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Textarea
                        id="address"
                        placeholder="Full business address for verification"
                        className="pl-10 min-h-[80px]"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="googleMaps">Google Maps Link</Label>
                    <div className="relative">
                      <Map className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="googleMaps"
                        type="url"
                        placeholder="https://maps.google.com/..."
                        className="pl-10"
                        value={formData.googleMapsLink}
                        onChange={(e) => setFormData({ ...formData, googleMapsLink: e.target.value })}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Share your Google Maps business location for easier verification
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="logo">Business Logo</Label>
                    <div className="border-2 border-dashed border-accent/30 rounded-lg p-6 text-center hover:border-accent/50 transition-colors">
                      {logoPreview ? (
                        <div className="space-y-4">
                          <img 
                            src={logoPreview} 
                            alt="Logo preview" 
                            className="w-24 h-24 object-contain mx-auto rounded-lg"
                          />
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setLogoFile(null);
                              setLogoPreview(null);
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <label className="cursor-pointer">
                          <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">
                            Click to upload your logo
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            PNG, JPG up to 2MB
                          </p>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleLogoChange}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-4 pt-4">
                {step > 1 && (
                  <Button type="button" variant="outline" onClick={handleBack} className="flex-1">
                    Back
                  </Button>
                )}
                {step < totalSteps ? (
                  <Button type="button" onClick={handleNext} className="flex-1">
                    Continue
                  </Button>
                ) : (
                  <Button type="submit" className="flex-1" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating Profile...
                      </>
                    ) : (
                      "Complete Registration"
                    )}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Trust Signals */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Join 10,000+ verified vendors on Karlo Shaadi
          </p>
          <div className="flex justify-center gap-6 text-xs text-muted-foreground">
            <span>✓ Free Registration</span>
            <span>✓ Quick Verification</span>
            <span>✓ Secure Platform</span>
          </div>
        </div>
      </div>
    </div>
  );
}
