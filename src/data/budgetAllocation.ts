export interface BudgetCategory {
  key: string;
  label: string;
  percentage: number;
  icon: string;
  priority: "high" | "medium" | "low";
  description: string;
}

export const BUDGET_ALLOCATION: BudgetCategory[] = [
  { key: "venue", label: "Venue", percentage: 25, icon: "🏛️", priority: "high", description: "Banquet hall, destination resort, or traditional venue" },
  { key: "catering", label: "Catering", percentage: 20, icon: "🍽️", priority: "high", description: "Food, beverages, and service for all events" },
  { key: "photography", label: "Photography", percentage: 12, icon: "📸", priority: "high", description: "Photos, videos, pre-wedding shoot, drone coverage" },
  { key: "decoration", label: "Decoration", percentage: 10, icon: "🌸", priority: "medium", description: "Flowers, mandap, stage, lighting, and props" },
  { key: "makeup", label: "Makeup & Mehendi", percentage: 8, icon: "💄", priority: "medium", description: "Bridal makeup, mehendi artist for all events" },
  { key: "jewelry", label: "Jewelry", percentage: 7, icon: "💍", priority: "high", description: "Wedding jewelry for the bride" },
  { key: "entertainment", label: "Music & DJ", percentage: 5, icon: "🎵", priority: "medium", description: "DJ, live band, sangeet choreography" },
  { key: "invitations", label: "Invitations", percentage: 3, icon: "📜", priority: "low", description: "Physical cards, digital invites, save-the-dates" },
  { key: "transport", label: "Transport", percentage: 3, icon: "🚗", priority: "low", description: "Wedding car, guest transport, baraat arrangements" },
  { key: "pandit", label: "Pandit & Rituals", percentage: 2, icon: "🪔", priority: "high", description: "Priest, havan samagri, and ritual items" },
  { key: "miscellaneous", label: "Buffer/Misc", percentage: 5, icon: "📦", priority: "low", description: "Emergency fund, tips, last-minute expenses" },
];

export const CITY_MULTIPLIERS: Record<string, { multiplier: number; label: string }> = {
  mumbai: { multiplier: 1.0, label: "Mumbai" },
  delhi: { multiplier: 1.0, label: "Delhi NCR" },
  bangalore: { multiplier: 0.95, label: "Bangalore" },
  chennai: { multiplier: 0.9, label: "Chennai" },
  kolkata: { multiplier: 0.85, label: "Kolkata" },
  hyderabad: { multiplier: 0.9, label: "Hyderabad" },
  pune: { multiplier: 0.9, label: "Pune" },
  ahmedabad: { multiplier: 0.85, label: "Ahmedabad" },
  jaipur: { multiplier: 0.95, label: "Jaipur" },
  udaipur: { multiplier: 1.15, label: "Udaipur (Destination)" },
  goa: { multiplier: 1.2, label: "Goa (Destination)" },
  kerala: { multiplier: 1.1, label: "Kerala (Destination)" },
  other: { multiplier: 0.8, label: "Other Cities" },
};

export const GUEST_ADJUSTMENTS = [
  { min: 0, max: 100, label: "Intimate", venueMultiplier: 0.7, cateringMultiplier: 0.6 },
  { min: 101, max: 200, label: "Small", venueMultiplier: 0.85, cateringMultiplier: 0.8 },
  { min: 201, max: 350, label: "Medium", venueMultiplier: 1.0, cateringMultiplier: 1.0 },
  { min: 351, max: 500, label: "Large", venueMultiplier: 1.15, cateringMultiplier: 1.2 },
  { min: 501, max: 800, label: "Grand", venueMultiplier: 1.3, cateringMultiplier: 1.4 },
  { min: 801, max: 2000, label: "Royal", venueMultiplier: 1.5, cateringMultiplier: 1.6 },
];

export function calculateBudgetBreakdown(
  totalBudget: number,
  city: string = "mumbai",
  guestCount: number = 300
): { category: BudgetCategory; amount: number; adjustedPercentage: number }[] {
  const cityMultiplier = CITY_MULTIPLIERS[city]?.multiplier || 1.0;
  const guestAdjustment = GUEST_ADJUSTMENTS.find(g => guestCount >= g.min && guestCount <= g.max) || GUEST_ADJUSTMENTS[2];

  return BUDGET_ALLOCATION.map(category => {
    let adjustedPercentage = category.percentage;
    
    // Adjust venue and catering based on guest count
    if (category.key === "venue") {
      adjustedPercentage = category.percentage * guestAdjustment.venueMultiplier;
    } else if (category.key === "catering") {
      adjustedPercentage = category.percentage * guestAdjustment.cateringMultiplier;
    }

    // Normalize percentages to ensure they sum to 100
    const totalPercentage = BUDGET_ALLOCATION.reduce((sum, c) => {
      if (c.key === "venue") return sum + c.percentage * guestAdjustment.venueMultiplier;
      if (c.key === "catering") return sum + c.percentage * guestAdjustment.cateringMultiplier;
      return sum + c.percentage;
    }, 0);

    const normalizedPercentage = (adjustedPercentage / totalPercentage) * 100;
    const amount = Math.round((totalBudget * normalizedPercentage) / 100);

    return {
      category,
      amount: Math.round(amount * cityMultiplier),
      adjustedPercentage: Math.round(normalizedPercentage * 10) / 10,
    };
  });
}

export function formatIndianCurrency(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  } else if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}K`;
  }
  return `₹${amount.toLocaleString("en-IN")}`;
}
