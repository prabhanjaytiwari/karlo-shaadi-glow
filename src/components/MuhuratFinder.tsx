import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Star, Share2, CalendarPlus, Clock, Sparkles, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { MUHURAT_2025, MONTHS, type MuhuratDate } from "@/data/muhuratDates2025";
import { format, differenceInDays, parseISO } from "date-fns";

const MuhuratFinder = () => {
  const [selectedMonth, setSelectedMonth] = useState<number | "all">("all");
  const [minRating, setMinRating] = useState(3);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const filteredMuhurats = useMemo(() => {
    let muhurats = MUHURAT_2025;

    // Filter by month
    if (selectedMonth !== "all") {
      muhurats = muhurats.filter(m => m.month === selectedMonth);
    }

    // Filter by minimum rating
    muhurats = muhurats.filter(m => m.rating >= minRating);

    // Filter by day of week
    if (selectedDays.length > 0) {
      muhurats = muhurats.filter(m => selectedDays.includes(m.day));
    }

    // Sort by date
    return muhurats.sort((a, b) => a.date.localeCompare(b.date));
  }, [selectedMonth, minRating, selectedDays]);

  const handleWhatsAppShare = (muhurat: MuhuratDate) => {
    const stars = "⭐".repeat(muhurat.rating);
    const message = `📿 Shubh Vivah Muhurat Found! 📿

📅 ${muhurat.day}, ${format(parseISO(muhurat.date), "d MMMM yyyy")}
⭐ Nakshatra: ${muhurat.nakshatra}
📜 Tithi: ${muhurat.tithi}
🕐 Timing: ${muhurat.timing}
${stars} ${muhurat.rating === 5 ? "Most Auspicious!" : muhurat.rating >= 4 ? "Very Auspicious" : "Good Muhurat"}
${muhurat.notes ? `\n💫 ${muhurat.notes}` : ""}

Find your perfect date: ${window.location.origin}/muhurat-finder

Made with 💕 on Karlo Shaadi`;

    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  };

  const addToCalendar = (muhurat: MuhuratDate) => {
    const eventTitle = `Wedding Muhurat - ${muhurat.nakshatra}`;
    const eventDetails = `Tithi: ${muhurat.tithi}%0ATiming: ${muhurat.timing}%0A${muhurat.notes || ""}`;
    const startDate = muhurat.date.replace(/-/g, "");
    
    // Google Calendar URL
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

  const dayOptions = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-primary/5 to-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Calendar className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">2025 Muhurat Calendar</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">
            Shubh Muhurat Finder
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Find the most auspicious wedding dates in 2025 based on Hindu Panchang
          </p>
        </motion.div>

        {/* Month Selection Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <h3 className="text-sm font-medium mb-3">Select Month</h3>
          <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
            <button
              onClick={() => setSelectedMonth("all")}
              className={`p-3 rounded-lg border text-center transition-all ${
                selectedMonth === "all"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card hover:bg-accent/10 border-border"
              }`}
            >
              <span className="text-sm font-medium">All</span>
              <p className="text-xs opacity-70">{MUHURAT_2025.length}</p>
            </button>
            {MONTHS.map(month => (
              <button
                key={month.value}
                onClick={() => setSelectedMonth(month.value)}
                className={`p-3 rounded-lg border text-center transition-all relative ${
                  selectedMonth === month.value
                    ? "bg-primary text-primary-foreground border-primary"
                    : month.highlight
                    ? "bg-accent/10 hover:bg-accent/20 border-accent/30"
                    : month.warning
                    ? "bg-amber-50 hover:bg-amber-100 border-amber-200"
                    : "bg-card hover:bg-accent/10 border-border"
                }`}
              >
                {month.highlight && (
                  <Star className="h-3 w-3 absolute top-1 right-1 text-accent fill-accent" />
                )}
                {month.warning && (
                  <AlertTriangle className="h-3 w-3 absolute top-1 right-1 text-amber-500" />
                )}
                <span className="text-sm font-medium">{month.label.slice(0, 3)}</span>
                <p className="text-xs opacity-70">{month.muhuratCount}</p>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4 items-center">
                {/* Minimum Rating */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Min Rating:</span>
                  <Select value={minRating.toString()} onValueChange={(v) => setMinRating(parseInt(v))}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3+ Stars</SelectItem>
                      <SelectItem value="4">4+ Stars</SelectItem>
                      <SelectItem value="5">5 Stars Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Day of Week Filter */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium">Days:</span>
                  {["Friday", "Saturday", "Sunday"].map(day => (
                    <label key={day} className="flex items-center gap-1.5 cursor-pointer">
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
            </CardContent>
          </Card>
        </motion.div>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-muted-foreground">
            Found <span className="font-bold text-foreground">{filteredMuhurats.length}</span> auspicious dates
          </p>
          {selectedDays.length > 0 && (
            <Button variant="ghost" size="sm" onClick={() => setSelectedDays([])}>
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

              return (
                <motion.div
                  key={muhurat.date}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <Card className={`overflow-hidden ${isPast ? "opacity-60" : ""} ${muhurat.rating === 5 ? "border-2 border-primary/50" : ""}`}>
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        {/* Date Column */}
                        <div className={`p-4 md:w-40 flex flex-col items-center justify-center text-center ${
                          muhurat.rating === 5 ? "bg-primary/10" : "bg-accent/5"
                        }`}>
                          <span className="text-3xl font-bold">
                            {format(parseISO(muhurat.date), "d")}
                          </span>
                          <span className="text-sm font-medium">
                            {format(parseISO(muhurat.date), "MMMM")}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {muhurat.day}
                          </span>
                          {daysUntil && (
                            <Badge variant="outline" className="mt-2 text-xs">
                              {daysUntil}
                            </Badge>
                          )}
                        </div>

                        {/* Details Column */}
                        <div className="flex-1 p-4">
                          <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold">{muhurat.nakshatra}</h3>
                                <div className="flex">
                                  {Array.from({ length: muhurat.rating }).map((_, i) => (
                                    <Star key={i} className="h-4 w-4 text-amber-400 fill-amber-400" />
                                  ))}
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground">{muhurat.tithi}</p>
                            </div>
                            <div className="flex items-center gap-1 text-sm">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{muhurat.timing}</span>
                            </div>
                          </div>

                          {muhurat.notes && (
                            <Badge className="mb-3 bg-accent/20 text-accent-foreground hover:bg-accent/30">
                              ✨ {muhurat.notes}
                            </Badge>
                          )}

                          {/* Actions */}
                          <div className="flex flex-wrap gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleWhatsAppShare(muhurat)}
                              className="gap-1"
                            >
                              <Share2 className="h-3 w-3" />
                              Share
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => addToCalendar(muhurat)}
                              className="gap-1"
                            >
                              <CalendarPlus className="h-3 w-3" />
                              Add to Calendar
                            </Button>
                            <Link to={`/search?date=${muhurat.date}`}>
                              <Button size="sm" variant="ghost" className="gap-1">
                                Find Vendors
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {filteredMuhurats.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No muhurats found with current filters</p>
            <Button variant="outline" onClick={() => {
              setMinRating(3);
              setSelectedDays([]);
            }}>
              Reset Filters
            </Button>
          </div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <p className="text-muted-foreground mb-4">Found your perfect date?</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/plan-wizard">
              <Button size="lg" className="gap-2 w-full sm:w-auto">
                <Sparkles className="h-5 w-5" />
                Get AI Wedding Plan
              </Button>
            </Link>
            <Link to="/budget-calculator">
              <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
                Calculate Budget
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MuhuratFinder;
