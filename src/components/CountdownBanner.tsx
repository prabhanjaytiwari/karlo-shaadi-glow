// CountdownBanner removed — no longer used for launch discount.
// Kept as a stub so existing imports don't break during cleanup.

export function CountdownBanner() {
  return null;
}

export function isOfferActive(): boolean {
  return false;
}

export function getDiscountedPrice(original: number): number {
  return original;
}

export function getPerDayPrice(monthlyPrice: number): number {
  return Math.round(monthlyPrice / 30);
}
