import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Share2, Calculator, Users, MapPin, Download, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
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
    if (budget < 1000000) return { label: "Intimate", color: "bg-emerald-500" };
    if (budget < 2500000) return { label: "Classic", color: "bg-blue-500" };
    if (budget < 5000000) return { label: "Grand", color: "bg-purple-500" };
    if (budget < 10000000) return { label: "Luxury", color: "bg-amber-500" };
    return { label: "Royal", color: "bg-rose-500" };
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

Calculate yours: ${window.location.origin}/budget-calculator

Made with 💕 on Karlo Shaadi`;

    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  };

  // Simple pie chart using CSS conic gradient
  const pieChartGradient = useMemo(() => {
    const colors = [
      "#ef4444", "#f97316", "#eab308", "#22c55e", "#14b8a6",
      "#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899", "#f43f5e", "#6b7280"
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
    <div className="min-h-screen bg-gradient-to-b from-background via-accent/5 to-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Calculator className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Instant Results</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">
            Wedding Budget Calculator
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Get an instant category-wise budget breakdown. No signup required!
          </p>
        </motion.div>

        {/* Input Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="mb-8 border-2 border-primary/20">
            <CardContent className="p-6 space-y-6">
              {/* Budget Slider */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-medium flex items-center gap-2">
                    💵 Total Budget
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-primary">
                      {formatIndianCurrency(budget)}
                    </span>
                    <Badge className={budgetTier.color}>{budgetTier.label}</Badge>
                  </div>
                </div>
                <Slider
                  value={[budget]}
                  onValueChange={(v) => setBudget(v[0])}
                  min={500000}
                  max={20000000}
                  step={100000}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>₹5 Lakhs</span>
                  <span>₹2 Crore</span>
                </div>
              </div>

              {/* City & Guests Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* City Selection */}
                <div>
                  <label className="text-sm font-medium flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4" /> Wedding City
                  </label>
                  <Select value={city} onValueChange={setCity}>
                    <SelectTrigger>
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
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Users className="h-4 w-4" /> Guest Count
                    </label>
                    <Badge variant="outline">{guestTier} Wedding</Badge>
                  </div>
                  <Slider
                    value={[guestCount]}
                    onValueChange={(v) => setGuestCount(v[0])}
                    min={50}
                    max={1500}
                    step={25}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>50</span>
                    <span className="font-medium text-foreground">{guestCount} guests</span>
                    <span>1500+</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-3 gap-6"
        >
          {/* Pie Chart */}
          <Card className="md:col-span-1">
            <CardContent className="p-6 flex flex-col items-center">
              <h3 className="text-lg font-semibold mb-4">Budget Split</h3>
              <div
                className="w-48 h-48 rounded-full mb-4 shadow-lg"
                style={{ background: pieChartGradient }}
              />
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">{formatIndianCurrency(budget)}</p>
                <p className="text-sm text-muted-foreground">Total Budget</p>
              </div>
            </CardContent>
          </Card>

          {/* Category Breakdown */}
          <Card className="md:col-span-2">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Category Breakdown</h3>
              <div className="space-y-3">
                {breakdown.map((item, index) => (
                  <motion.div
                    key={item.category.key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/10 transition-colors"
                  >
                    <span className="text-2xl">{item.category.icon}</span>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-sm">{item.category.label}</span>
                        <span className="font-bold">{formatIndianCurrency(item.amount)}</span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${item.adjustedPercentage}%` }}
                          transition={{ delay: 0.5 + index * 0.05, duration: 0.5 }}
                          className={`h-full rounded-full ${
                            item.category.priority === "high"
                              ? "bg-primary"
                              : item.category.priority === "medium"
                              ? "bg-accent"
                              : "bg-muted-foreground"
                          }`}
                        />
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        item.category.priority === "high"
                          ? "border-primary text-primary"
                          : item.category.priority === "medium"
                          ? "border-accent text-accent"
                          : ""
                      }`}
                    >
                      {item.adjustedPercentage}%
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
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
            className="bg-green-600 hover:bg-green-700 gap-2"
          >
            <Share2 className="h-5 w-5" />
            Share on WhatsApp
          </Button>
          <Link to="/plan-wizard">
            <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
              <Sparkles className="h-5 w-5" />
              Get AI Wedding Plan
            </Button>
          </Link>
        </motion.div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 p-4 bg-primary/5 rounded-lg border border-primary/20"
        >
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            💡 Budget Tips for {CITY_MULTIPLIERS[city]?.label || "your city"}
          </h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Venue & Catering typically take 45% of your budget - book early for best rates</li>
            <li>• Photography is an investment - memories last forever, choose wisely</li>
            <li>• Keep a 5% buffer for unexpected expenses</li>
            <li>• Weekday muhurats often come with 15-20% venue discounts</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default BudgetCalculator;
