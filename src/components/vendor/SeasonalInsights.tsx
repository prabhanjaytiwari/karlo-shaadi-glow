import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MUHURAT_2025, MUHURAT_2026 } from "@/data/muhuratDates2025";
import { CalendarHeart, TrendingUp, Star } from "lucide-react";

export function SeasonalInsights() {
  const now = new Date();

  const upcomingDates = useMemo(() => {
    const all = [...MUHURAT_2025, ...MUHURAT_2026];
    return all
      .filter((d) => new Date(d.date) >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 12);
  }, []);

  const monthDensity = useMemo(() => {
    const all = [...MUHURAT_2025, ...MUHURAT_2026].filter(d => new Date(d.date) >= now);
    const counts: Record<string, number> = {};
    all.forEach((d) => {
      const key = `${new Date(d.date).toLocaleString("default", { month: "short" })} ${d.year}`;
      counts[key] = (counts[key] || 0) + 1;
    });
    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 6);
  }, []);

  return (
    <div className="space-y-6">
      {/* High Demand Months */}
      <Card className="border-2 border-accent/20">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-accent" />
            High-Demand Periods
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Months with the most muhurat dates — consider raising prices or running promotions.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {monthDensity.map(([month, count], i) => (
              <div key={month} className="p-3 rounded-lg border bg-card text-center">
                <p className="font-semibold">{month}</p>
                <p className="text-2xl font-bold text-accent">{count}</p>
                <p className="text-xs text-muted-foreground">muhurat dates</p>
                {i === 0 && <Badge className="mt-1 bg-accent text-accent-foreground text-xs">Peak</Badge>}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Muhurat Dates */}
      <Card className="border-2 border-accent/20">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CalendarHeart className="h-5 w-5 text-accent" />
            Upcoming Muhurat Dates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {upcomingDates.map((d) => (
              <div key={d.date} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                <div>
                  <p className="font-medium">
                    {new Date(d.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    <span className="text-muted-foreground ml-2 text-sm">({d.day})</span>
                  </p>
                  <p className="text-xs text-muted-foreground">{d.nakshatra} • {d.tithi}</p>
                  {d.notes && <p className="text-xs text-accent font-medium">{d.notes}</p>}
                </div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: d.rating }).map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-accent text-accent" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
