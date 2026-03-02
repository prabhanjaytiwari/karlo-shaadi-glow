import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Star, Share2, CalendarPlus, Clock, Sparkles, AlertTriangle, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { ALL_MUHURATS, MONTHS_2025, MONTHS_2026, type MuhuratDate } from "@/data/muhuratDates2025";
import { format, differenceInDays, parseISO } from "date-fns";
import { PremiumCard, PremiumCardContent, PremiumBadge } from "@/components/ui/premium-card";
import { PremiumBackground, PoweredByBadge } from "@/components/ui/premium-background";

const MuhuratFinder = () => {
  const [selectedYear, setSelectedYear] = useState<2025 | 2026>(2025);
  const [selectedMonth, setSelectedMonth] = useState<number | "all">("all");
  const [minRating, setMinRating] = useState(3);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const currentMonths = selectedYear === 2025 ? MONTHS_2025 : MONTHS_2026;

  const filteredMuhurats = useMemo(() => {
    let muhurats = ALL_MUHURATS.filter(m => m.year === selectedYear);

    if (selectedMonth !== "all") {
      muhurats = muhurats.filter(m => m.month === selectedMonth);
    }

    muhurats = muhurats.filter(m => m.rating >= minRating);

    if (selectedDays.length > 0) {
      muhurats = muhurats.filter(m => selectedDays.includes(m.day));
    }

    return muhurats.sort((a, b) => a.date.localeCompare(b.date));
  }, [selectedYear, selectedMonth, minRating, selectedDays]);

  const handleWhatsAppShare = (muhurat: MuhuratDate) => {
    const stars = "⭐".repeat(muhurat.rating);
    const message = `📿 Shubh Vivah Muhurat Found! 📿

📅 ${muhurat.day}, ${format(parseISO(muhurat.date), "d MMMM yyyy")}
⭐ Nakshatra: ${muhurat.nakshatra}
📜 Tithi: ${muhurat.tithi}
🕐 Timing: ${muhurat.timing}
${stars} ${muhurat.rating === 5 ? "Most Auspicious!" : muhurat.rating >= 4 ? "Very Auspicious" : "Good Muhurat"}
${muhurat.notes ? `\n💫 ${muhurat.notes}` : ""}

📲 Find your perfect date:
${window.location.origin}/muhurat-finder

Made with 💕 on Karlo Shaadi`;

    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  };

  const addToCalendar = (muhurat: MuhuratDate) => {
    const eventTitle = `💒 Wedding Muhurat - ${muhurat.nakshatra}`;
    const eventDetails = `Tithi: ${muhurat.tithi}%0ATiming: ${muhurat.timing}%0A${muhurat.notes || ""}%0A%0AFound on Karlo Shaadi`;
    const startDate = muhurat.date.replace(/-/g, "");
    
    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&dates=${startDate}/${startDate}&details=${eventDetails}`;
    
    window.open(googleUrl, "_blank");
  };

  const getDaysUntil = (dateStr: string) => {
    const days = differenceInDays(parseISO(dateStr), new Date());
    if (days < 0) return null;
    if (days === 0) return "Today!";
    if (days === 1) return "Tomorrow";
    return `${days} days away`;
  };

  const renderStars = (rating: number) => (
    <div className="star-rating">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < rating ? "star-filled fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`}
        />
      ))}
    </div>
  );

  return (
    <PremiumBackground variant="festive" pattern>
      <div className="py-8 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Premium Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="premium-tool-header rounded-3xl mb-8 px-6"
          >
            <div className="flex flex-col items-center">
              <PremiumBadge variant="gold" icon={<Calendar className="h-3.5 w-3.5" />}>
                2025–2026 Muhurat Calendar
              </PremiumBadge>
              <h1 className="text-3xl md:text-5xl font-display font-bold mt-4 mb-3">
                <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  Shubh Muhurat
                </span>{" "}
                Finder
              </h1>
              <p className="text-muted-foreground max-w-xl mx-auto text-center">
                Find the most auspicious wedding dates in 2025 & 2026 based on Hindu Panchang
              </p>
              {/* Year Toggle */}
              <div className="flex gap-2 mt-4">
                {([2025, 2026] as const).map(yr => (
                  <button
                    key={yr}
                    onClick={() => { setSelectedYear(yr); setSelectedMonth("all"); }}
                    className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                      selectedYear === yr
                        ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg"
                        : "bg-card/50 border border-border/50 hover:border-accent/30"
                    }`}
                  >
                    {yr}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Month Selection Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <PremiumCard variant="gradient">
              <PremiumCardContent className="p-6">
                <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-accent" />
                  Select Month
                </h3>
                <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
                  <button
                    onClick={() => setSelectedMonth("all")}
                    className={`p-3 rounded-xl border-2 text-center transition-all ${
                      selectedMonth === "all"
                        ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border-primary shadow-lg"
                        : "bg-card/50 hover:bg-accent/10 border-border/50 hover:border-accent/30"
                    }`}
                  >
                    <span className="text-sm font-semibold">All</span>
                    <p className="text-xs opacity-70">{ALL_MUHURATS.filter(m => m.year === selectedYear).length}</p>
                  </button>
                  {currentMonths.map(month => (
                    <button
                      key={month.value}
                      onClick={() => setSelectedMonth(month.value)}
                      className={`p-3 rounded-xl border-2 text-center transition-all relative ${
                        selectedMonth === month.value
                          ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border-primary shadow-lg"
                          : month.highlight
                          ? "bg-accent/10 hover:bg-accent/20 border-accent/30"
                          : month.warning
                          ? "bg-amber-50 hover:bg-amber-100 border-amber-200"
                          : "bg-card/50 hover:bg-accent/10 border-border/50 hover:border-accent/30"
                      }`}
                    >
                      {month.highlight && (
                        <Star className="h-3 w-3 absolute top-1 right-1 text-accent fill-accent" />
                      )}
                      {month.warning && (
                        <AlertTriangle className="h-3 w-3 absolute top-1 right-1 text-amber-500" />
                      )}
                      <span className="text-sm font-semibold">{month.label.slice(0, 3)}</span>
                      <p className="text-xs opacity-70">{month.muhuratCount}</p>
                    </button>
                  ))}
                </div>
              </PremiumCardContent>
            </PremiumCard>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <PremiumCard className="mb-6">
              <PremiumCardContent className="p-4">
                <div className="flex flex-wrap gap-6 items-center">
                  {/* Minimum Rating */}
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-muted-foreground">Min Rating:</span>
                    <Select value={minRating.toString()} onValueChange={(v) => setMinRating(parseInt(v))}>
                      <SelectTrigger className="w-36 bg-background/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">⭐⭐⭐ 3+ Stars</SelectItem>
                        <SelectItem value="4">⭐⭐⭐⭐ 4+ Stars</SelectItem>
                        <SelectItem value="5">⭐⭐⭐⭐⭐ 5 Stars Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Day of Week Filter */}
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-sm font-medium text-muted-foreground">Days:</span>
                    {["Friday", "Saturday", "Sunday"].map(day => (
                      <label key={day} className="flex items-center gap-2 cursor-pointer px-3 py-1.5 rounded-lg border border-border/50 hover:border-accent/30 hover:bg-accent/5 transition-all">
                        <Checkbox
                          checked={selectedDays.includes(day)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedDays([...selectedDays, day]);
                            } else {
                              setSelectedDays(selectedDays.filter(d => d !== day));
                            }
                          }}
                        />
                        <span className="text-sm">{day}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </PremiumCardContent>
            </PremiumCard>
          </motion.div>

          {/* Results Count */}
          <div className="flex justify-between items-center mb-4 px-2">
            <p className="text-sm text-muted-foreground">
              Found <span className="font-bold text-primary text-lg">{filteredMuhurats.length}</span> auspicious dates
            </p>
            {selectedDays.length > 0 && (
              <Button variant="ghost" size="sm" onClick={() => setSelectedDays([])} className="text-accent hover:text-accent">
                Clear filters
              </Button>
            )}
          </div>

          {/* Muhurat Cards */}
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredMuhurats.map((muhurat, index) => {
                const daysUntil = getDaysUntil(muhurat.date);
                const isPast = daysUntil === null;
                const isFiveStar = muhurat.rating === 5;

                return (
                  <motion.div
                    key={muhurat.date}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <div className={`muhurat-card ${isFiveStar ? "five-star" : ""} ${isPast ? "opacity-80" : ""}`}>
                      {isPast && (
                        <div className="absolute top-3 right-3 z-10">
                          <Badge variant="outline" className="text-[10px] bg-muted/80 text-muted-foreground border-muted-foreground/20">Past</Badge>
                        </div>
                      )}
                      <div className="flex flex-col md:flex-row">
                        {/* Date Column */}
                        <div className="date-column">
                          <span className="text-4xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                            {format(parseISO(muhurat.date), "d")}
                          </span>
                          <span className="text-sm font-semibold text-foreground/80">
                            {format(parseISO(muhurat.date), "MMMM")}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {muhurat.day}
                          </span>
                          {daysUntil && (
                            <Badge variant="outline" className="mt-2 text-xs bg-background/50 border-accent/30 text-accent">
                              {daysUntil}
                            </Badge>
                          )}
                        </div>

                        {/* Details Column */}
                        <div className="flex-1 p-4 md:p-5">
                          <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                            <div>
                              <div className="flex items-center gap-3 mb-1">
                                <h3 className="font-semibold text-lg">{muhurat.nakshatra}</h3>
                                {renderStars(muhurat.rating)}
                              </div>
                              <p className="text-sm text-muted-foreground">{muhurat.tithi}</p>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent/10 border border-accent/20">
                              <Clock className="h-4 w-4 text-accent" />
                              <span className="font-medium text-sm">{muhurat.timing}</span>
                            </div>
                          </div>

                          {muhurat.notes && (
                            <Badge className="mb-3 bg-gradient-to-r from-accent/20 to-primary/20 text-foreground border border-accent/20 hover:bg-accent/30">
                              ✨ {muhurat.notes}
                            </Badge>
                          )}

                          {/* Actions */}
                          <div className="flex flex-wrap gap-2 pt-2">
                            <Button
                              size="sm"
                              onClick={() => handleWhatsAppShare(muhurat)}
                              className="gap-1.5 bg-green-600 hover:bg-green-700"
                            >
                              <Share2 className="h-3.5 w-3.5" />
                              Share
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => addToCalendar(muhurat)}
                              className="gap-1.5 border-accent/30 hover:bg-accent/10"
                            >
                              <CalendarPlus className="h-3.5 w-3.5" />
                              Add to Calendar
                            </Button>
                            <Link to={`/search?date=${muhurat.date}`}>
                              <Button size="sm" variant="ghost" className="gap-1.5">
                                <ExternalLink className="h-3.5 w-3.5" />
                                Find Vendors
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {filteredMuhurats.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-muted-foreground mb-4 text-lg">No muhurats found with current filters</p>
              <Button variant="outline" onClick={() => {
                setMinRating(3);
                setSelectedDays([]);
              }} className="border-accent/30 hover:bg-accent/10">
                Reset Filters
              </Button>
            </div>
          )}

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12"
          >
            <PremiumCard variant="gold" glow>
              <PremiumCardContent className="p-8 text-center">
                <h3 className="text-xl font-semibold mb-2">Found your perfect date?</h3>
                <p className="text-muted-foreground mb-6">Let us help you plan your dream wedding</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/plan-wizard">
                    <Button size="lg" className="gap-2 w-full sm:w-auto bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg">
                      <Sparkles className="h-5 w-5" />
                      Get AI Wedding Plan
                    </Button>
                  </Link>
                  <Link to="/budget-calculator">
                    <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto border-accent/30 hover:bg-accent/10">
                      Calculate Budget
                    </Button>
                  </Link>
                </div>
                <PoweredByBadge className="mt-6" />
              </PremiumCardContent>
            </PremiumCard>
          </motion.div>
        </div>
      </div>
    </PremiumBackground>
  );
};

export default MuhuratFinder;
