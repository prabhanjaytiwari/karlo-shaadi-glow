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
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, ArrowRight, ArrowLeft, Sparkles, Heart, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface WizardData {
  side: "bride" | "groom" | null;
  yourName: string;
  partnerName: string;
  weddingDate: Date | null;
  city: string;
  budget: number;
  guestCount: number;
  weddingStyle: "traditional" | "modern" | "destination" | "intimate" | "royal" | null;
}

const cities = [
  "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", 
  "Pune", "Jaipur", "Udaipur", "Goa", "Ahmedabad", "Lucknow",
  "Chandigarh", "Kochi", "Jodhpur", "Agra", "Varanasi", "Shimla"
];

const weddingStyles = [
  { id: "traditional", label: "Traditional", emoji: "🪔", desc: "Classic rituals & customs" },
  { id: "modern", label: "Modern", emoji: "✨", desc: "Contemporary & chic" },
  { id: "destination", label: "Destination", emoji: "🏝️", desc: "Away from home" },
  { id: "intimate", label: "Intimate", emoji: "💕", desc: "Close friends & family" },
  { id: "royal", label: "Royal", emoji: "👑", desc: "Grand & luxurious" },
];

export function WeddingPlanWizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [data, setData] = useState<WizardData>({
    side: null,
    yourName: "",
    partnerName: "",
    weddingDate: null,
    city: "",
    budget: 25,
    guestCount: 300,
    weddingStyle: null,
  });

  const totalSteps = 5;
  const progress = (step / totalSteps) * 100;

  const canProceed = () => {
    switch (step) {
      case 1:
        return data.side && data.yourName.trim() && data.partnerName.trim();
      case 2:
        return data.weddingDate && data.city;
      case 3:
        return data.budget >= 5;
      case 4:
        return data.guestCount >= 50;
      case 5:
        return data.weddingStyle;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      generatePlan();
    }
  };

  const handleBack = () => {
    if (step > 1) {
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
          budget: data.budget,
          guestCount: data.guestCount,
          weddingStyle: data.weddingStyle,
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
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Who's getting married? 💒</h2>
              <p className="text-muted-foreground">Let's start with the lovely couple</p>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setData({ ...data, side: "bride" })}
                className={cn(
                  "flex-1 max-w-[160px] p-6 rounded-2xl border-2 transition-all duration-300",
                  data.side === "bride"
                    ? "border-primary bg-primary/10 scale-105"
                    : "border-border hover:border-primary/50"
                )}
              >
                <div className="text-4xl mb-2">👰</div>
                <div className="font-semibold">I'm the Bride</div>
              </button>
              <button
                onClick={() => setData({ ...data, side: "groom" })}
                className={cn(
                  "flex-1 max-w-[160px] p-6 rounded-2xl border-2 transition-all duration-300",
                  data.side === "groom"
                    ? "border-primary bg-primary/10 scale-105"
                    : "border-border hover:border-primary/50"
                )}
              >
                <div className="text-4xl mb-2">🤵</div>
                <div className="font-semibold">I'm the Groom</div>
              </button>
            </div>

            <div className="grid gap-4 max-w-sm mx-auto">
              <div>
                <Label htmlFor="yourName">Your Name</Label>
                <Input
                  id="yourName"
                  placeholder="Enter your name"
                  value={data.yourName}
                  onChange={(e) => setData({ ...data, yourName: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="partnerName">Partner's Name</Label>
                <Input
                  id="partnerName"
                  placeholder="Enter partner's name"
                  value={data.partnerName}
                  onChange={(e) => setData({ ...data, partnerName: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">When & Where? 📍</h2>
              <p className="text-muted-foreground">The perfect date and dream destination</p>
            </div>

            <div className="grid gap-6 max-w-sm mx-auto">
              <div>
                <Label>Wedding Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal mt-1",
                        !data.weddingDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {data.weddingDate ? format(data.weddingDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={data.weddingDate || undefined}
                      onSelect={(date) => setData({ ...data, weddingDate: date || null })}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label>City</Label>
                <Select
                  value={data.city}
                  onValueChange={(value) => setData({ ...data, city: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">What's your budget? 💰</h2>
              <p className="text-muted-foreground">Don't worry, we'll make it magical!</p>
            </div>

            <div className="max-w-md mx-auto space-y-8">
              <div className="text-center">
                <div className="text-5xl font-bold text-primary mb-2">
                  ₹{data.budget} Lakhs
                </div>
                <div className="text-sm text-muted-foreground">
                  {data.budget < 15
                    ? "Intimate & Beautiful 💕"
                    : data.budget < 30
                    ? "Grand Celebration 🎉"
                    : data.budget < 75
                    ? "Luxury Wedding 💎"
                    : "Royal Extravaganza 👑"}
                </div>
              </div>

              <Slider
                value={[data.budget]}
                onValueChange={(value) => setData({ ...data, budget: value[0] })}
                min={5}
                max={200}
                step={5}
                className="py-4"
              />

              <div className="flex justify-between text-sm text-muted-foreground">
                <span>₹5 Lakhs</span>
                <span>₹2 Crore+</span>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">How many guests? 👥</h2>
              <p className="text-muted-foreground">The more, the merrier!</p>
            </div>

            <div className="max-w-md mx-auto space-y-8">
              <div className="text-center">
                <div className="text-5xl font-bold text-primary mb-2">
                  {data.guestCount}
                </div>
                <div className="text-sm text-muted-foreground">
                  {data.guestCount < 100
                    ? "Intimate Gathering 💕"
                    : data.guestCount < 300
                    ? "Medium Celebration 🎊"
                    : data.guestCount < 500
                    ? "Grand Wedding 🎉"
                    : "Mega Celebration! 🎆"}
                </div>
              </div>

              <Slider
                value={[data.guestCount]}
                onValueChange={(value) => setData({ ...data, guestCount: value[0] })}
                min={50}
                max={2000}
                step={50}
                className="py-4"
              />

              <div className="flex justify-between text-sm text-muted-foreground">
                <span>50 guests</span>
                <span>2000+ guests</span>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Wedding Style? 🎨</h2>
              <p className="text-muted-foreground">What's your dream vibe?</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-lg mx-auto">
              {weddingStyles.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setData({ ...data, weddingStyle: style.id as any })}
                  className={cn(
                    "p-4 rounded-2xl border-2 transition-all duration-300 text-center",
                    data.weddingStyle === style.id
                      ? "border-primary bg-primary/10 scale-105"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <div className="text-3xl mb-2">{style.emoji}</div>
                  <div className="font-semibold text-sm">{style.label}</div>
                  <div className="text-xs text-muted-foreground mt-1">{style.desc}</div>
                </button>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (isGenerating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="h-16 w-16 text-primary mx-auto" />
          </motion.div>
          <div>
            <h2 className="text-2xl font-bold mb-2">Creating your perfect wedding plan...</h2>
            <p className="text-muted-foreground">Our AI is crafting something special for {data.yourName} & {data.partnerName}</p>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm text-muted-foreground">This may take a moment</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm">
        <div className="h-1 bg-muted">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <div className="container py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to Home
          </button>
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            <span className="font-semibold">Step {step} of {totalSteps}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center pt-24 pb-32 px-4">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait" custom={step}>
            <motion.div
              key={step}
              custom={step}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t">
        <div className="container py-4 flex items-center justify-between gap-4">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === 1}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="gap-2 min-w-[140px]"
          >
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
    </div>
  );
}
