import { useState } from "react";
import { motion } from "framer-motion";
import { Flame, Share2, ArrowRight, Sparkles } from "lucide-react";
import { MobilePageHeader } from "@/components/mobile/MobilePageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SEO } from "@/components/SEO";

import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const cities = ["Delhi", "Mumbai", "Bangalore", "Jaipur", "Udaipur", "Lucknow", "Hyderabad", "Chennai", "Kolkata", "Pune", "Goa", "Chandigarh"];

export default function BudgetRoast() {
  const [city, setCity] = useState("");
  const [guests, setGuests] = useState("");
  const [budget, setBudget] = useState("");
  const [roast, setRoast] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  const handleRoast = async () => {
    if (!city || !guests || !budget) {
      toast.error("Fill in all fields to get roasted!");
      return;
    }
    setIsLoading(true);
    setRoast("");
    setDisplayedText("");
    setIsComplete(false);

    try {
      const response = await supabase.functions.invoke("budget-roast", {
        body: { city, guests: parseInt(guests), budget: parseInt(budget) },
      });

      if (response.error) throw new Error(response.error.message);

      const fullText = response.data?.roast || "Hmm, even our AI is speechless about this budget. That says something.";
      setRoast(fullText);

      // Typewriter effect
      let i = 0;
      const interval = setInterval(() => {
        if (i < fullText.length) {
          setDisplayedText(fullText.substring(0, i + 1));
          i++;
        } else {
          clearInterval(interval);
          setIsComplete(true);
        }
      }, 20);
    } catch (e) {
      console.error(e);
      toast.error("Roast machine is overheating. Try again!");
    } finally {
      setIsLoading(false);
    }
  };

  const shareToWhatsApp = () => {
    const text = `I just got ROASTED by an AI wedding planner 😂🔥\n\n"${roast.substring(0, 200)}..."\n\nGet your budget reality check: ${window.location.origin}/budget-roast`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <MobilePageHeader title="Budget Roast" />
      <SEO title="Budget Roast — AI Wedding Budget Reality Check | Karlo Shaadi" description="Get a brutally honest, hilarious AI reality check on your wedding budget. The truth hurts, but it's free!" />

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 border border-destructive/20 mb-6">
            <Flame className="h-4 w-4 text-destructive" />
            <span className="text-destructive text-sm font-semibold">Budget Roast</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-3">
            Can You Actually<br />
            <span className="bg-gradient-to-r from-destructive to-accent bg-clip-text text-transparent">Afford This Wedding?</span>
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Our AI doesn't sugarcoat. Enter your details and get a brutally honest — but helpful — reality check.
          </p>
        </div>

        {/* Form */}
        {!roast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 max-w-md mx-auto"
          >
            <div>
              <label className="text-sm font-medium mb-1.5 block">City</label>
              <Select value={city} onValueChange={setCity}>
                <SelectTrigger className="h-12"><SelectValue placeholder="Select your city" /></SelectTrigger>
                <SelectContent>
                  {cities.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">Number of Guests</label>
              <Input
                type="number"
                placeholder="e.g. 300"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="h-12"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">Total Budget (₹ in Lakhs)</label>
              <Input
                type="number"
                placeholder="e.g. 10"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="h-12"
              />
            </div>

            <Button
              onClick={handleRoast}
              disabled={isLoading}
              size="lg"
              className="w-full rounded-full h-12 bg-gradient-to-r from-destructive to-orange-500 hover:from-destructive/90 hover:to-orange-500/90 mt-4"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">🔥</span> Generating your roast...
                </span>
              ) : (
                <>
                  <Flame className="mr-2 h-5 w-5" /> Roast My Budget
                </>
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">Free • No signup • Brutally honest</p>
          </motion.div>
        )}

        {/* Roast Result */}
        {roast && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* The Roast */}
            <div className="relative p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-orange-50 to-red-50 border-2 border-destructive/20">
              <Flame className="absolute top-4 right-4 h-8 w-8 text-destructive/20" />
              <div className="text-sm text-destructive font-semibold mb-3 flex items-center gap-2">
                <span className="text-lg">🔥</span> Your Budget Reality Check
              </div>
              <div className="mb-2 text-xs text-muted-foreground">
                {city} • {guests} guests • ₹{budget}L budget
              </div>
              <p className="text-foreground text-base sm:text-lg leading-relaxed whitespace-pre-line">
                {displayedText}
                {!isComplete && <span className="animate-pulse text-primary">|</span>}
              </p>
            </div>

            {/* Share + Actions */}
            {isComplete && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button onClick={shareToWhatsApp} size="lg" className="rounded-full bg-green-600 hover:bg-green-700">
                    <Share2 className="mr-2 h-4 w-4" /> Share the Roast 😂
                  </Button>
                  <Button onClick={() => { setRoast(""); setDisplayedText(""); setIsComplete(false); }} size="lg" variant="outline" className="rounded-full">
                    Try Different Budget
                  </Button>
                </div>

                {/* CTA to actual planning */}
                <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 text-center">
                  <p className="font-semibold text-lg mb-2">Now let's actually plan this properly</p>
                  <p className="text-muted-foreground text-sm mb-4">Get a realistic AI-generated wedding plan with real vendor recommendations</p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link to="/plan-wizard">
                      <Button className="rounded-full">
                        <Sparkles className="mr-2 h-4 w-4" /> Get Your Wedding Plan
                      </Button>
                    </Link>
                    <Link to="/budget-calculator">
                      <Button variant="outline" className="rounded-full">
                        Smart Budget Calculator <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>

      
    </div>
  );
}
