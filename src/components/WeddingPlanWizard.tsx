import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, ArrowRight, ArrowLeft, Sparkles, Heart, Loader2, MapPin, Users, IndianRupee, Palette, UtensilsCrossed, Music, Building2, Star, Truck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PremiumBackground, PoweredByBadge } from "@/components/ui/premium-background";
import { PremiumCard, PremiumBadge } from "@/components/ui/premium-card";
import { useIsMobile } from "@/hooks/use-mobile";

interface WizardData {
  side: "bride" | "groom" | null;
  yourName: string;
  partnerName: string;
  weddingDate: Date | null;
  city: string;
  religion: string;
  ceremonies: string[];
  budget: number;
  brideSideGuests: number;
  groomSideGuests: number;
  venueType: string;
  foodType: string;
  alcohol: string;
  weddingStyle: "traditional" | "modern" | "destination" | "intimate" | "royal" | null;
  priorities: string[];
  specialRequirements: string[];
}

const cities = [
  "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata",
  "Pune", "Jaipur", "Udaipur", "Goa", "Ahmedabad", "Lucknow",
  "Chandigarh", "Kochi", "Jodhpur", "Agra", "Varanasi", "Shimla",
  "Indore", "Bhopal", "Patna", "Ranchi", "Dehradun", "Mysore",
];

const religions = [
  { id: "hindu", label: "Hindu", emoji: "🪔" },
  { id: "muslim", label: "Muslim", emoji: "☪️" },
  { id: "sikh", label: "Sikh", emoji: "🙏" },
  { id: "christian", label: "Christian", emoji: "✝️" },
  { id: "jain", label: "Jain", emoji: "☸️" },
  { id: "buddhist", label: "Buddhist", emoji: "🕉️" },
  { id: "interfaith", label: "Inter-faith", emoji: "💕" },
];

const allCeremonies = [
  { id: "roka", label: "Roka", emoji: "💍" },
  { id: "engagement", label: "Engagement", emoji: "🎊" },
  { id: "haldi", label: "Haldi", emoji: "🌼" },
  { id: "mehendi", label: "Mehendi", emoji: "🤚" },
  { id: "sangeet", label: "Sangeet", emoji: "💃" },
  { id: "cocktail", label: "Cocktail/DJ Night", emoji: "🍸" },
  { id: "wedding", label: "Wedding Ceremony", emoji: "🪔" },
  { id: "reception", label: "Reception", emoji: "🎉" },
  { id: "vidaai", label: "Vidaai", emoji: "😢" },
  { id: "griha_pravesh", label: "Griha Pravesh", emoji: "🏠" },
];

const venueTypes = [
  { id: "banquet", label: "Banquet Hall", emoji: "🏛️" },
  { id: "hotel", label: "5-Star Hotel", emoji: "🏨" },
  { id: "farmhouse", label: "Farmhouse", emoji: "🌿" },
  { id: "beach", label: "Beach Resort", emoji: "🏖️" },
  { id: "palace", label: "Palace/Haveli", emoji: "🏰" },
  { id: "lawn", label: "Garden/Lawn", emoji: "🌳" },
  { id: "temple", label: "Temple/Gurudwara", emoji: "🛕" },
  { id: "home", label: "Home", emoji: "🏡" },
];

const foodTypes = [
  { id: "veg", label: "Pure Vegetarian", emoji: "🥗" },
  { id: "nonveg", label: "Non-Vegetarian", emoji: "🍗" },
  { id: "jain", label: "Jain Food", emoji: "🥬" },
  { id: "multicuisine", label: "Multi-Cuisine", emoji: "🍽️" },
];

const alcoholOptions = [
  { id: "no", label: "No Alcohol", emoji: "🚫" },
  { id: "bar_only", label: "Bar Only", emoji: "🍷" },
  { id: "full_bar", label: "Full Open Bar", emoji: "🥂" },
];

const weddingStyles = [
  { id: "traditional", label: "Traditional", emoji: "🪔", desc: "Classic rituals & customs" },
  { id: "modern", label: "Modern", emoji: "✨", desc: "Contemporary & chic" },
  { id: "destination", label: "Destination", emoji: "🏝️", desc: "Away from home" },
  { id: "intimate", label: "Intimate", emoji: "💕", desc: "Close friends & family" },
  { id: "royal", label: "Royal", emoji: "👑", desc: "Grand & luxurious" },
];

const priorityOptions = [
  { id: "venue", label: "Venue", icon: "🏛️" },
  { id: "food", label: "Food & Catering", icon: "🍽️" },
  { id: "photography", label: "Photography", icon: "📸" },
  { id: "decoration", label: "Decoration", icon: "🌸" },
  { id: "entertainment", label: "Entertainment", icon: "🎵" },
  { id: "makeup", label: "Bridal Makeup", icon: "💄" },
];

const specialRequirementsOptions = [
  { id: "baarat", label: "Baarat (Groom's Procession)", emoji: "🐎" },
  { id: "dhol", label: "Dhol/Band Baaja", emoji: "🥁" },
  { id: "fireworks", label: "Fireworks/Cold Pyro", emoji: "🎆" },
  { id: "varmala_stage", label: "Varmala Stage", emoji: "🌺" },
  { id: "mandap", label: "Vidhi Mandap Setup", emoji: "🪔" },
  { id: "parking", label: "Valet Parking", emoji: "🚗" },
  { id: "accommodation", label: "Guest Accommodation", emoji: "🏨" },
  { id: "shuttle", label: "Shuttle Service", emoji: "🚌" },
];

function getBudgetLabel(budget: number) {
  if (budget <= 5) return "Budget-Friendly 💰";
  if (budget <= 15) return "Smart & Beautiful 💕";
  if (budget <= 30) return "Grand Celebration 🎉";
  if (budget <= 75) return "Luxury Wedding 💎";
  if (budget <= 200) return "Ultra Premium 🌟";
  return "Royal Extravaganza 👑";
}

export function WeddingPlanWizard() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [data, setData] = useState<WizardData>({
    side: null,
    yourName: "",
    partnerName: "",
    weddingDate: null,
    city: "",
    religion: "",
    ceremonies: ["wedding", "reception"],
    budget: 25,
    brideSideGuests: 150,
    groomSideGuests: 150,
    venueType: "",
    foodType: "",
    alcohol: "",
    weddingStyle: null,
    priorities: [],
    specialRequirements: [],
  });

  const totalSteps = 8;
  const progress = (step / totalSteps) * 100;

  const toggleArrayItem = (arr: string[], item: string) =>
    arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item];

  const canProceed = () => {
    switch (step) {
      case 1: return data.side && data.yourName.trim() && data.partnerName.trim();
      case 2: return data.weddingDate && data.city && data.religion;
      case 3: return data.ceremonies.length >= 1;
      case 4: return data.budget >= 2;
      case 5: return (data.brideSideGuests + data.groomSideGuests) >= 50;
      case 6: return data.venueType && data.foodType && data.alcohol;
      case 7: return data.weddingStyle && data.priorities.length >= 1;
      case 8: return true; // optional step
      default: return false;
    }
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setDirection(1);
      setStep(step + 1);
    } else {
      generatePlan();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setDirection(-1);
      setStep(step - 1);
    }
  };

  const generatePlan = async () => {
    if (!data.weddingDate || !data.weddingStyle || !data.side) return;

    setIsGenerating(true);
    try {
      const response = await supabase.functions.invoke("generate-wedding-plan", {
        body: {
          side: data.side,
          yourName: data.yourName,
          partnerName: data.partnerName,
          weddingDate: format(data.weddingDate, "dd MMM yyyy"),
          city: data.city,
          religion: data.religion,
          ceremonies: data.ceremonies,
          budget: data.budget,
          guestCount: data.brideSideGuests + data.groomSideGuests,
          brideSideGuests: data.brideSideGuests,
          groomSideGuests: data.groomSideGuests,
          venueType: data.venueType,
          foodType: data.foodType,
          alcohol: data.alcohol,
          weddingStyle: data.weddingStyle,
          priorities: data.priorities,
          specialRequirements: data.specialRequirements,
        },
      });

      if (response.error) {
        throw new Error(response.error.message || "Failed to generate plan");
      }

      const planId = response.data?.planId;
      if (planId) {
        navigate(`/plan/${planId}`);
      } else {
        throw new Error("No plan ID returned");
      }
    } catch (error) {
      console.error("Error generating plan:", error);
      toast.error("Failed to generate your plan. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 200 : -200, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir < 0 ? 200 : -200, opacity: 0 }),
  };

  const stepLabels = ["Couple", "Details", "Events", "Budget", "Guests", "Preferences", "Style", "Extras"];

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl md:text-2xl font-bold mb-1">Who's planning? 💒</h2>
              <p className="text-sm text-muted-foreground">Tell us about the couple</p>
            </div>
            <div className="flex gap-3 justify-center">
              {[
                { val: "bride" as const, emoji: "👰", label: "Bride's Side" },
                { val: "groom" as const, emoji: "🤵", label: "Groom's Side" },
              ].map((opt) => (
                <button
                  key={opt.val}
                  onClick={() => setData({ ...data, side: opt.val })}
                  className={cn(
                    "flex-1 max-w-[140px] p-5 rounded-2xl border-2 transition-all",
                    data.side === opt.val ? "border-primary bg-primary/10 scale-105 shadow-md" : "border-border hover:border-primary/50"
                  )}
                >
                  <div className="text-3xl mb-1">{opt.emoji}</div>
                  <div className="font-semibold text-sm">{opt.label}</div>
                </button>
              ))}
            </div>
            <div className="grid gap-3 max-w-xs mx-auto">
              <div>
                <Label htmlFor="yourName" className="text-xs">Your Name</Label>
                <Input id="yourName" placeholder="Enter your name" value={data.yourName} onChange={(e) => setData({ ...data, yourName: e.target.value })} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="partnerName" className="text-xs">Partner's Name</Label>
                <Input id="partnerName" placeholder="Enter partner's name" value={data.partnerName} onChange={(e) => setData({ ...data, partnerName: e.target.value })} className="mt-1" />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl md:text-2xl font-bold mb-1">Wedding Details 📍</h2>
              <p className="text-sm text-muted-foreground">Date, city & community</p>
            </div>
            <div className="grid gap-4 max-w-xs mx-auto">
              <div>
                <Label className="text-xs">Wedding Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal mt-1", !data.weddingDate && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {data.weddingDate ? format(data.weddingDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={data.weddingDate || undefined} onSelect={(date) => setData({ ...data, weddingDate: date || null })} disabled={(date) => date < new Date()} initialFocus className="pointer-events-auto" />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label className="text-xs">City</Label>
                <Select value={data.city} onValueChange={(value) => setData({ ...data, city: value })}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Select city" /></SelectTrigger>
                  <SelectContent>{cities.map((city) => (<SelectItem key={city} value={city}>{city}</SelectItem>))}</SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Religion / Community</Label>
                <div className="grid grid-cols-4 gap-2 mt-1">
                  {religions.map((r) => (
                    <button key={r.id} onClick={() => setData({ ...data, religion: r.id })} className={cn("p-2 rounded-xl border text-center transition-all text-xs", data.religion === r.id ? "border-primary bg-primary/10 shadow-sm" : "border-border hover:border-primary/40")}>
                      <div className="text-lg">{r.emoji}</div>
                      <div className="font-medium mt-0.5 leading-tight">{r.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl md:text-2xl font-bold mb-1">Which ceremonies? 🎊</h2>
              <p className="text-sm text-muted-foreground">Select all events you're planning</p>
            </div>
            <div className="grid grid-cols-2 gap-2.5 max-w-sm mx-auto">
              {allCeremonies.map((c) => {
                const selected = data.ceremonies.includes(c.id);
                return (
                  <button key={c.id} onClick={() => setData({ ...data, ceremonies: toggleArrayItem(data.ceremonies, c.id) })} className={cn("p-3 rounded-xl border-2 text-left transition-all flex items-center gap-2", selected ? "border-primary bg-primary/10 shadow-sm" : "border-border hover:border-primary/40")}>
                    <span className="text-xl">{c.emoji}</span>
                    <span className="font-medium text-sm">{c.label}</span>
                    {selected && <span className="ml-auto text-primary">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl md:text-2xl font-bold mb-1">Total Budget? 💰</h2>
              <p className="text-sm text-muted-foreground">We'll optimize every rupee</p>
            </div>
            <div className="max-w-sm mx-auto space-y-6">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-1">
                  {data.budget >= 100 ? `₹${(data.budget / 100).toFixed(1)} Cr` : `₹${data.budget} L`}
                </div>
                <div className="text-sm text-muted-foreground">{getBudgetLabel(data.budget)}</div>
              </div>
              <Slider value={[data.budget]} onValueChange={(v) => setData({ ...data, budget: v[0] })} min={2} max={500} step={data.budget < 50 ? 1 : data.budget < 100 ? 5 : 10} className="py-4" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>₹2 Lakhs</span>
                <span>₹5 Crore</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[10, 25, 50, 100].map((v) => (
                  <button key={v} onClick={() => setData({ ...data, budget: v })} className={cn("py-2 px-3 rounded-lg border text-xs font-medium transition-all", data.budget === v ? "border-primary bg-primary/10" : "border-border hover:border-primary/40")}>
                    {v >= 100 ? `₹${v / 100}Cr` : `₹${v}L`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl md:text-2xl font-bold mb-1">Guest Count 👥</h2>
              <p className="text-sm text-muted-foreground">Split by bride & groom side</p>
            </div>
            <div className="max-w-sm mx-auto space-y-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">{data.brideSideGuests + data.groomSideGuests}</div>
                <div className="text-sm text-muted-foreground">Total Guests</div>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <Label className="text-xs">👰 Bride's Side</Label>
                    <span className="text-sm font-bold text-primary">{data.brideSideGuests}</span>
                  </div>
                  <Slider value={[data.brideSideGuests]} onValueChange={(v) => setData({ ...data, brideSideGuests: v[0] })} min={25} max={2500} step={25} />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <Label className="text-xs">🤵 Groom's Side</Label>
                    <span className="text-sm font-bold text-primary">{data.groomSideGuests}</span>
                  </div>
                  <Slider value={[data.groomSideGuests]} onValueChange={(v) => setData({ ...data, groomSideGuests: v[0] })} min={25} max={2500} step={25} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[{ b: 75, g: 75, l: "150" }, { b: 250, g: 250, l: "500" }, { b: 500, g: 500, l: "1000" }].map((p) => (
                  <button key={p.l} onClick={() => setData({ ...data, brideSideGuests: p.b, groomSideGuests: p.g })} className="py-2 px-3 rounded-lg border border-border hover:border-primary/40 text-xs font-medium transition-all">
                    {p.l} guests
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-5">
            <div className="text-center">
              <h2 className="text-xl md:text-2xl font-bold mb-1">Preferences 🍽️</h2>
              <p className="text-sm text-muted-foreground">Venue, food & drinks</p>
            </div>
            <div className="max-w-sm mx-auto space-y-4">
              <div>
                <Label className="text-xs font-semibold mb-1.5 block">Venue Type</Label>
                <div className="grid grid-cols-4 gap-2">
                  {venueTypes.map((v) => (
                    <button key={v.id} onClick={() => setData({ ...data, venueType: v.id })} className={cn("p-2 rounded-xl border text-center transition-all", data.venueType === v.id ? "border-primary bg-primary/10 shadow-sm" : "border-border hover:border-primary/40")}>
                      <div className="text-lg">{v.emoji}</div>
                      <div className="text-[10px] font-medium leading-tight mt-0.5">{v.label}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-xs font-semibold mb-1.5 block">Food Preference</Label>
                <div className="grid grid-cols-2 gap-2">
                  {foodTypes.map((f) => (
                    <button key={f.id} onClick={() => setData({ ...data, foodType: f.id })} className={cn("p-2.5 rounded-xl border text-left transition-all flex items-center gap-2", data.foodType === f.id ? "border-primary bg-primary/10" : "border-border hover:border-primary/40")}>
                      <span className="text-lg">{f.emoji}</span>
                      <span className="text-xs font-medium">{f.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-xs font-semibold mb-1.5 block">Alcohol</Label>
                <div className="grid grid-cols-3 gap-2">
                  {alcoholOptions.map((a) => (
                    <button key={a.id} onClick={() => setData({ ...data, alcohol: a.id })} className={cn("p-2.5 rounded-xl border text-center transition-all", data.alcohol === a.id ? "border-primary bg-primary/10" : "border-border hover:border-primary/40")}>
                      <div className="text-lg">{a.emoji}</div>
                      <div className="text-[10px] font-medium mt-0.5">{a.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-5">
            <div className="text-center">
              <h2 className="text-xl md:text-2xl font-bold mb-1">Style & Priorities 🎨</h2>
              <p className="text-sm text-muted-foreground">Pick your vibe & what matters most</p>
            </div>
            <div className="max-w-sm mx-auto space-y-4">
              <div>
                <Label className="text-xs font-semibold mb-1.5 block">Wedding Style</Label>
                <div className="grid grid-cols-3 gap-2">
                  {weddingStyles.map((s) => (
                    <button key={s.id} onClick={() => setData({ ...data, weddingStyle: s.id as any })} className={cn("p-3 rounded-xl border-2 text-center transition-all", data.weddingStyle === s.id ? "border-primary bg-primary/10 scale-105" : "border-border hover:border-primary/40")}>
                      <div className="text-2xl mb-1">{s.emoji}</div>
                      <div className="font-semibold text-xs">{s.label}</div>
                      <div className="text-[10px] text-muted-foreground">{s.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-xs font-semibold mb-1.5 block">Top Priorities (select 3+)</Label>
                <div className="grid grid-cols-3 gap-2">
                  {priorityOptions.map((p) => {
                    const selected = data.priorities.includes(p.id);
                    return (
                      <button key={p.id} onClick={() => setData({ ...data, priorities: toggleArrayItem(data.priorities, p.id) })} className={cn("p-2.5 rounded-xl border text-center transition-all", selected ? "border-primary bg-primary/10" : "border-border hover:border-primary/40")}>
                        <div className="text-lg">{p.icon}</div>
                        <div className="text-[10px] font-medium mt-0.5">{p.label}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );

      case 8:
        return (
          <div className="space-y-5">
            <div className="text-center">
              <h2 className="text-xl md:text-2xl font-bold mb-1">Special Requirements 🎆</h2>
              <p className="text-sm text-muted-foreground">Optional — select what you need</p>
            </div>
            <div className="grid grid-cols-2 gap-2.5 max-w-sm mx-auto">
              {specialRequirementsOptions.map((r) => {
                const selected = data.specialRequirements.includes(r.id);
                return (
                  <button key={r.id} onClick={() => setData({ ...data, specialRequirements: toggleArrayItem(data.specialRequirements, r.id) })} className={cn("p-3 rounded-xl border-2 text-left transition-all flex items-center gap-2", selected ? "border-primary bg-primary/10" : "border-border hover:border-primary/40")}>
                    <span className="text-xl">{r.emoji}</span>
                    <span className="text-xs font-medium leading-tight">{r.label}</span>
                    {selected && <span className="ml-auto text-primary text-sm">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (isGenerating) {
    return (
      <PremiumBackground variant="wedding" pattern animated className="min-h-screen flex items-center justify-center">
        <PremiumCard variant="gold" glow hover={false} className="max-w-md mx-4 p-8">
          <div className="text-center space-y-6">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center">
              <Sparkles className="h-10 w-10 text-accent" />
            </motion.div>
            <div>
              <h2 className="text-xl font-bold mb-2 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">Creating your perfect wedding plan...</h2>
              <p className="text-sm text-muted-foreground">Our AI is crafting a detailed plan for {data.yourName} & {data.partnerName}</p>
              <p className="text-xs text-muted-foreground mt-2">
                {data.ceremonies.length} ceremonies • {data.brideSideGuests + data.groomSideGuests} guests • {data.city}
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 bg-accent/10 px-4 py-2 rounded-full">
              <Loader2 className="h-5 w-5 animate-spin text-accent" />
              <span className="text-sm text-accent font-medium">This may take 15-30 seconds</span>
            </div>
            <PoweredByBadge />
          </div>
        </PremiumCard>
      </PremiumBackground>
    );
  }

  return (
    <PremiumBackground variant="wedding" pattern className="min-h-screen flex flex-col">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="h-1 bg-muted">
          <motion.div className="h-full bg-gradient-to-r from-accent to-primary" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} />
        </div>
        <div className="px-4 py-3 flex items-center justify-between">
          <button onClick={() => navigate("/")} className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
            <ArrowLeft className="h-3.5 w-3.5" />
            Home
          </button>
          <div className="flex items-center gap-1.5">
            {stepLabels.map((label, i) => (
              <div key={i} className={cn("transition-all rounded-full", step === i + 1 ? "w-6 h-1.5 bg-accent" : step > i + 1 ? "w-1.5 h-1.5 bg-primary" : "w-1.5 h-1.5 bg-muted-foreground/30")} />
            ))}
          </div>
          <PremiumBadge variant="gold" icon={<Heart className="h-3 w-3" />}>
            {step}/{totalSteps}
          </PremiumBadge>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center pt-20 pb-28 px-3">
        <PremiumCard variant="default" glow={false} hover={false} className={cn("w-full p-5 md:p-8", isMobile ? "max-w-full" : "max-w-xl")}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div key={step} custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25, ease: "easeInOut" }}>
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </PremiumCard>
      </div>

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/90 backdrop-blur-xl border-t border-border/50 safe-area-bottom">
        <div className="px-4 py-3 flex items-center justify-between gap-3">
          <Button variant="outline" onClick={handleBack} disabled={step === 1} size="sm" className="gap-1.5">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <span className="text-xs text-muted-foreground hidden sm:block">{stepLabels[step - 1]}</span>
          <Button onClick={handleNext} disabled={!canProceed()} size="sm" className="gap-1.5 bg-gradient-to-r from-accent to-primary text-primary-foreground min-w-[120px]">
            {step === totalSteps ? (
              <>
                <Sparkles className="h-4 w-4" />
                Generate Plan
              </>
            ) : (
              <>
                Next
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </PremiumBackground>
  );
}
