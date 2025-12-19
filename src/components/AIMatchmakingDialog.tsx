import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Loader2, ArrowRight, ArrowLeft, CheckCircle2, MapPin, Users, IndianRupee, Calendar, Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface AIMatchmakingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const serviceCategories = [
  { id: "venues", label: "Venue" },
  { id: "photography", label: "Photography" },
  { id: "catering", label: "Catering" },
  { id: "decoration", label: "Decoration" },
  { id: "makeup", label: "Makeup Artist" },
  { id: "mehendi", label: "Mehendi" },
  { id: "music", label: "DJ/Music" },
  { id: "entertainment", label: "Entertainment" },
  { id: "choreography", label: "Choreography" },
  { id: "invitations", label: "Invitations" },
  { id: "jewelry", label: "Jewelry" },
  { id: "transport", label: "Transport" },
  { id: "pandit", label: "Pandit" },
  { id: "cakes", label: "Cakes" },
  { id: "planning", label: "Wedding Planner" },
];

const budgetRanges = [
  { value: "5-10", label: "₹5 - 10 Lakhs" },
  { value: "10-20", label: "₹10 - 20 Lakhs" },
  { value: "20-35", label: "₹20 - 35 Lakhs" },
  { value: "35-50", label: "₹35 - 50 Lakhs" },
  { value: "50-75", label: "₹50 - 75 Lakhs" },
  { value: "75-100", label: "₹75 Lakhs - 1 Crore" },
  { value: "100+", label: "₹1 Crore+" },
];

export const AIMatchmakingDialog = ({ open, onOpenChange }: AIMatchmakingDialogProps) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    side: "",
    partnerName: "",
    weddingDate: "",
    budget: "",
    guestCount: "",
    city: "",
    services: [] as string[],
    weddingStyle: "",
    specialRequirements: "",
  });

  const totalSteps = 4;

  const handleServiceToggle = (serviceId: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter(s => s !== serviceId)
        : [...prev.services, serviceId]
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Login Required",
          description: "Please log in to get AI-powered vendor recommendations",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }

      // Parse budget range
      const budgetParts = formData.budget.split("-");
      const budgetMin = parseInt(budgetParts[0]) * 100000;
      const budgetMax = budgetParts[1] === "+" ? 50000000 : parseInt(budgetParts[1]) * 100000;

      const { data, error } = await supabase.functions.invoke("smart-vendor-matching", {
        body: {
          userId: user.id,
          category: formData.services[0], // Primary category
          budget: { min: budgetMin, max: budgetMax },
          city: formData.city,
          preferences: {
            side: formData.side,
            guestCount: parseInt(formData.guestCount) || 0,
            weddingDate: formData.weddingDate,
            weddingStyle: formData.weddingStyle,
            services: formData.services,
            specialRequirements: formData.specialRequirements,
          }
        },
      });

      if (error) throw error;

      toast({
        title: "Finding Your Matches...",
        description: "Analyzing your preferences to find the perfect vendors",
      });

      onOpenChange(false);
      
      // Navigate to AI results page with preferences as params
      const searchParams = new URLSearchParams();
      if (formData.city) searchParams.set("city", formData.city);
      if (formData.services.length > 0) searchParams.set("services", formData.services.join(","));
      if (formData.budget) {
        const budgetParts = formData.budget.split("-");
        const budgetMin = parseInt(budgetParts[0]) * 100000;
        const budgetMax = budgetParts[1] === "+" ? 50000000 : parseInt(budgetParts[1]) * 100000;
        searchParams.set("budgetMin", budgetMin.toString());
        searchParams.set("budgetMax", budgetMax.toString());
      }
      if (formData.guestCount) searchParams.set("guestCount", formData.guestCount);
      if (formData.weddingDate) searchParams.set("weddingDate", formData.weddingDate);
      if (formData.weddingStyle) searchParams.set("weddingStyle", formData.weddingStyle);
      
      navigate(`/ai-matches?${searchParams.toString()}`);
    } catch (error: any) {
      console.error("AI matching error:", error);
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.side && formData.weddingDate;
      case 2:
        return formData.budget && formData.guestCount;
      case 3:
        return formData.city && formData.services.length > 0;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-5">
            <div className="text-center mb-6">
              <Heart className="h-10 w-10 text-primary mx-auto mb-2" />
              <h3 className="text-lg font-medium">Tell us about your wedding</h3>
              <p className="text-sm text-muted-foreground">Let's start with the basics</p>
            </div>
            
            <div className="space-y-3">
              <Label className="text-sm font-medium">You are from?</Label>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant={formData.side === "groom" ? "default" : "outline"}
                  className="h-14 text-base"
                  onClick={() => setFormData(prev => ({ ...prev, side: "groom" }))}
                >
                  🤵 Groom's Side
                </Button>
                <Button
                  type="button"
                  variant={formData.side === "bride" ? "default" : "outline"}
                  className="h-14 text-base"
                  onClick={() => setFormData(prev => ({ ...prev, side: "bride" }))}
                >
                  👰 Bride's Side
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="partnerName" className="text-sm font-medium">Partner's Name (Optional)</Label>
              <Input
                id="partnerName"
                placeholder="Enter partner's name"
                value={formData.partnerName}
                onChange={(e) => setFormData(prev => ({ ...prev, partnerName: e.target.value }))}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weddingDate" className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" /> Wedding Date
              </Label>
              <Input
                id="weddingDate"
                type="date"
                value={formData.weddingDate}
                onChange={(e) => setFormData(prev => ({ ...prev, weddingDate: e.target.value }))}
                className="h-11"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-5">
            <div className="text-center mb-6">
              <IndianRupee className="h-10 w-10 text-primary mx-auto mb-2" />
              <h3 className="text-lg font-medium">Budget & Guest Count</h3>
              <p className="text-sm text-muted-foreground">Help us find vendors in your range</p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Total Wedding Budget</Label>
              <Select value={formData.budget} onValueChange={(value) => setFormData(prev => ({ ...prev, budget: value }))}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select your budget range" />
                </SelectTrigger>
                <SelectContent>
                  {budgetRanges.map((range) => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="guestCount" className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4" /> Expected Guests
              </Label>
              <Input
                id="guestCount"
                type="number"
                placeholder="e.g., 300"
                value={formData.guestCount}
                onChange={(e) => setFormData(prev => ({ ...prev, guestCount: e.target.value }))}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Wedding Style (Optional)</Label>
              <Select value={formData.weddingStyle} onValueChange={(value) => setFormData(prev => ({ ...prev, weddingStyle: value }))}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select wedding style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="traditional">Traditional / Classic</SelectItem>
                  <SelectItem value="modern">Modern / Contemporary</SelectItem>
                  <SelectItem value="destination">Destination Wedding</SelectItem>
                  <SelectItem value="intimate">Intimate / Small</SelectItem>
                  <SelectItem value="royal">Royal / Grand</SelectItem>
                  <SelectItem value="themed">Themed Wedding</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-5">
            <div className="text-center mb-6">
              <MapPin className="h-10 w-10 text-primary mx-auto mb-2" />
              <h3 className="text-lg font-medium">Location & Services</h3>
              <p className="text-sm text-muted-foreground">Where and what do you need?</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="city" className="text-sm font-medium">Wedding City</Label>
              <Input
                id="city"
                placeholder="e.g., Mumbai, Delhi, Jaipur"
                value={formData.city}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                className="h-11"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium">Services Required</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {serviceCategories.map((service) => (
                  <div
                    key={service.id}
                    onClick={() => handleServiceToggle(service.id)}
                    className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-all ${
                      formData.services.includes(service.id)
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Checkbox
                      checked={formData.services.includes(service.id)}
                      className="pointer-events-none"
                    />
                    <span className="text-sm">{service.label}</span>
                  </div>
                ))}
              </div>
              {formData.services.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {formData.services.map(id => (
                    <Badge key={id} variant="secondary" className="text-xs">
                      {serviceCategories.find(s => s.id === id)?.label}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-5">
            <div className="text-center mb-6">
              <Sparkles className="h-10 w-10 text-primary mx-auto mb-2" />
              <h3 className="text-lg font-medium">Any Special Requirements?</h3>
              <p className="text-sm text-muted-foreground">Tell us anything else we should know</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements" className="text-sm font-medium">Special Requirements (Optional)</Label>
              <Textarea
                id="requirements"
                placeholder="e.g., Need vegetarian catering only, prefer outdoor venue, specific color theme, etc."
                value={formData.specialRequirements}
                onChange={(e) => setFormData(prev => ({ ...prev, specialRequirements: e.target.value }))}
                className="min-h-[120px] resize-none"
              />
            </div>

            {/* Summary */}
            <div className="bg-secondary/50 rounded-lg p-4 space-y-2">
              <h4 className="font-medium text-sm">Your Wedding Summary</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-muted-foreground">Side:</div>
                <div className="capitalize">{formData.side || "-"}</div>
                <div className="text-muted-foreground">Date:</div>
                <div>{formData.weddingDate || "-"}</div>
                <div className="text-muted-foreground">Budget:</div>
                <div>{budgetRanges.find(b => b.value === formData.budget)?.label || "-"}</div>
                <div className="text-muted-foreground">Guests:</div>
                <div>{formData.guestCount || "-"}</div>
                <div className="text-muted-foreground">City:</div>
                <div>{formData.city || "-"}</div>
                <div className="text-muted-foreground">Services:</div>
                <div>{formData.services.length} selected</div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Vendor Matchmaking
          </DialogTitle>
          <DialogDescription>
            Answer a few questions and our AI will find perfect vendors for your wedding
          </DialogDescription>
        </DialogHeader>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-4">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                i + 1 <= step ? "bg-primary" : "bg-secondary"
              }`}
            />
          ))}
        </div>

        <div className="py-2">
          {renderStep()}
        </div>

        <div className="flex justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => setStep(s => s - 1)}
            disabled={step === 1}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>

          {step < totalSteps ? (
            <Button
              onClick={() => setStep(s => s + 1)}
              disabled={!canProceed()}
              className="gap-2"
            >
              Next <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Finding Vendors...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" /> Find My Vendors
                </>
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
