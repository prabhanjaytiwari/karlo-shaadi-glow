import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Share2, Calculator, Users, MapPin, Sparkles, ExternalLink, IndianRupee, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { PremiumCard, PremiumCardHeader, PremiumCardContent, PremiumBadge } from "@/components/ui/premium-card";
import { PremiumBackground, PoweredByBadge } from "@/components/ui/premium-background";
import {
  calculateBudgetBreakdown,
  formatIndianCurrency,
  CITY_MULTIPLIERS,
  GUEST_ADJUSTMENTS,
} from "@/data/budgetAllocation";

const BudgetCalculator = () => {
  const [budget, setBudget] = useState(2500000); // 25 Lakhs default
  const [city, setCity] = useState("mumbai");
  const [guestCount, setGuestCount] = useState(300);

  const breakdown = useMemo(() => {
    return calculateBudgetBreakdown(budget, city, guestCount);
  }, [budget, city, guestCount]);

  const budgetTier = useMemo(() => {
    if (budget < 1000000) return { label: "Intimate", color: "bg-emerald-500", emoji: "💕" };
    if (budget < 2500000) return { label: "Classic", color: "bg-blue-500", emoji: "🎊" };
    if (budget < 5000000) return { label: "Grand", color: "bg-purple-500", emoji: "✨" };
    if (budget < 10000000) return { label: "Luxury", color: "bg-amber-500", emoji: "💎" };
    return { label: "Royal", color: "bg-rose-500", emoji: "👑" };
  }, [budget]);

  const guestTier = useMemo(() => {
    return GUEST_ADJUSTMENTS.find(g => guestCount >= g.min && guestCount <= g.max)?.label || "Medium";
  }, [guestCount]);

  const handleWhatsAppShare = () => {
    const cityLabel = CITY_MULTIPLIERS[city]?.label || "India";
    const topCategories = breakdown
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5)
      .map(b => `${b.category.icon} ${b.category.label}: ${formatIndianCurrency(b.amount)}`)
      .join("\n");

    const message = `💰 My Wedding Budget Breakdown 💰

📍 ${cityLabel} | 👥 ${guestCount} Guests
💵 Total: ${formatIndianCurrency(budget)}

${topCategories}

📲 Calculate yours FREE at:
${window.location.origin}/budget-calculator

Made with 💕 on Karlo Shaadi`;

    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  };

  // Premium pie chart using CSS conic gradient
  const pieChartGradient = useMemo(() => {
    const colors = [
      "hsl(340, 75%, 50%)", // Primary
      "hsl(38, 90%, 55%)",  // Accent/Gold
      "hsl(280, 60%, 55%)", // Purple
      "hsl(175, 60%, 45%)", // Teal
      "hsl(220, 70%, 50%)", // Blue
      "hsl(25, 80%, 55%)",  // Orange
      "hsl(150, 60%, 45%)", // Green
      "hsl(350, 70%, 55%)", // Rose
      "hsl(45, 85%, 55%)",  // Yellow
      "hsl(200, 65%, 50%)", // Sky
      "hsl(0, 0%, 55%)",    // Gray
    ];
    let currentAngle = 0;
    const segments = breakdown.map((item, index) => {
      const startAngle = currentAngle;
      currentAngle += (item.adjustedPercentage / 100) * 360;
      return `${colors[index % colors.length]} ${startAngle}deg ${currentAngle}deg`;
    });
    return `conic-gradient(${segments.join(", ")})`;
  }, [breakdown]);

  return (
    <PremiumBackground variant="wedding" pattern>
      <div className="py-8 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Premium Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="premium-tool-header rounded-3xl mb-8 px-6"
          >
            <div className="flex flex-col items-center">
              <PremiumBadge variant="gold" icon={<Calculator className="h-3.5 w-3.5" />}>
                Instant Results • No Signup
              </PremiumBadge>
              <h1 className="text-3xl md:text-5xl font-display font-bold mt-4 mb-3 bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text">
                Wedding Budget Calculator
              </h1>
              <p className="text-muted-foreground max-w-xl mx-auto text-center">
                Get a detailed category-wise breakdown tailored to your city and guest count
              </p>
            </div>
          </motion.div>

          {/* Input Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <PremiumCard variant="gold" glow className="mb-8">
              <PremiumCardContent className="p-6 md:p-8 space-y-8">
                {/* Budget Slider */}
                <div>
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 mb-4">
                    <label className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                      <IndianRupee className="h-4 w-4 text-accent" />
                      Total Wedding Budget
                    </label>
                    <div className="flex items-center gap-3">
                      <span className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        {formatIndianCurrency(budget)}
                      </span>
                      <Badge className={`${budgetTier.color} text-white`}>
                        {budgetTier.emoji} {budgetTier.label}
                      </Badge>
                    </div>
                  </div>
                  <Slider
                    value={[budget]}
                    onValueChange={(v) => setBudget(v[0])}
                    min={500000}
                    max={20000000}
                    step={100000}
                    className="w-full py-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>₹5 Lakhs</span>
                    <span>₹2 Crore</span>
                  </div>
                </div>

                {/* City & Guests Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* City Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4 text-accent" /> Wedding City
                    </label>
                    <Select value={city} onValueChange={setCity}>
                      <SelectTrigger className="h-12 bg-background/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(CITY_MULTIPLIERS).map(([key, { label }]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Guest Count */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                        <Users className="h-4 w-4 text-accent" /> Guest Count
                      </label>
                      <Badge variant="outline" className="border-accent/30 text-accent">
                        {guestTier} Wedding
                      </Badge>
                    </div>
                    <Slider
                      value={[guestCount]}
                      onValueChange={(v) => setGuestCount(v[0])}
                      min={50}
                      max={1500}
                      step={25}
                      className="w-full py-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>50 guests</span>
                      <span className="font-semibold text-foreground text-sm">{guestCount} guests</span>
                      <span>1500+</span>
                    </div>
                  </div>
                </div>
              </PremiumCardContent>
            </PremiumCard>
          </motion.div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid md:grid-cols-3 gap-6"
          >
            {/* Pie Chart */}
            <PremiumCard variant="gradient" className="md:col-span-1">
              <PremiumCardContent className="p-6 flex flex-col items-center">
                <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-accent" />
                  Budget Split
                </h3>
                <div className="premium-chart-container p-4">
                  <div
                    className="w-44 h-44 rounded-full shadow-xl relative"
                    style={{ 
                      background: pieChartGradient,
                      boxShadow: "0 8px 32px -8px hsl(var(--accent) / 0.3), inset 0 0 0 4px hsl(var(--background))"
                    }}
                  >
                    <div className="absolute inset-4 rounded-full bg-card flex items-center justify-center flex-col shadow-inner">
                      <span className="text-2xl font-bold text-primary">{formatIndianCurrency(budget)}</span>
                      <span className="text-xs text-muted-foreground">Total Budget</span>
                    </div>
                  </div>
                </div>
                <PoweredByBadge className="mt-6" />
              </PremiumCardContent>
            </PremiumCard>

            {/* Category Breakdown */}
            <PremiumCard variant="default" className="md:col-span-2">
              <PremiumCardHeader icon={<IndianRupee className="h-5 w-5 text-accent" />}>
                <h3 className="text-lg font-semibold">Category Breakdown</h3>
              </PremiumCardHeader>
              <PremiumCardContent>
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
                  {breakdown.map((item, index) => (
                    <motion.div
                      key={item.category.key}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.04 }}
                      className="group category-card p-3 rounded-xl border border-border/50 hover:border-accent/30 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl group-hover:scale-110 transition-transform">
                          {item.category.icon}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center mb-1.5">
                            <span className="font-medium text-sm truncate">{item.category.label}</span>
                            <span className="font-bold text-primary">{formatIndianCurrency(item.amount)}</span>
                          </div>
                          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${item.adjustedPercentage}%` }}
                              transition={{ delay: 0.5 + index * 0.04, duration: 0.5 }}
                              className={`h-full rounded-full ${
                                item.category.priority === "high"
                                  ? "bg-gradient-to-r from-primary to-primary/70"
                                  : item.category.priority === "medium"
                                  ? "bg-gradient-to-r from-accent to-accent/70"
                                  : "bg-muted-foreground/50"
                              }`}
                            />
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className={`text-xs shrink-0 ${
                            item.category.priority === "high"
                              ? "border-primary/40 text-primary bg-primary/5"
                              : item.category.priority === "medium"
                              ? "border-accent/40 text-accent bg-accent/5"
                              : "border-muted-foreground/40"
                          }`}
                        >
                          {item.adjustedPercentage}%
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </PremiumCardContent>
            </PremiumCard>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              size="lg"
              onClick={handleWhatsAppShare}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 gap-2 shadow-lg hover:shadow-xl transition-all"
            >
              <Share2 className="h-5 w-5" />
              Share on WhatsApp
            </Button>
            <Link to="/plan-wizard">
              <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto border-primary/30 hover:bg-primary/5">
                <Sparkles className="h-5 w-5 text-primary" />
                Get AI Wedding Plan
              </Button>
            </Link>
            <Link to="/search">
              <Button size="lg" variant="ghost" className="gap-2 w-full sm:w-auto">
                <ExternalLink className="h-5 w-5" />
                Find Vendors
              </Button>
            </Link>
          </motion.div>

          {/* Tips */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8"
          >
            <PremiumCard variant="maroon" className="overflow-hidden">
              <div className="p-6 md:p-8">
                <h4 className="font-semibold mb-4 flex items-center gap-2 text-lg">
                  <span className="text-2xl">💡</span>
                  Budget Tips for {CITY_MULTIPLIERS[city]?.label || "your city"}
                </h4>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-0.5">•</span>
                    <span><strong>Venue & Catering</strong> typically take 40-45% of your budget — book early for the best rates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-0.5">•</span>
                    <span><strong>Photography</strong> is an investment in memories that last forever — choose wisely</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-0.5">•</span>
                    <span>Keep a <strong>5-10% buffer</strong> for unexpected expenses and last-minute additions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-0.5">•</span>
                    <span><strong>Weekday muhurats</strong> often come with 15-20% venue discounts</span>
                  </li>
                </ul>
              </div>
            </PremiumCard>
          </motion.div>
        </div>
      </div>
    </PremiumBackground>
  );
};

export default BudgetCalculator;
