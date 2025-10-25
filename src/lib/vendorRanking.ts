// Vendor ranking algorithm for search results
// Priority: Sponsored (top 1-3) → Featured (top 4-8) → Free (by rating)

export interface Vendor {
  id: string;
  subscription_tier: 'free' | 'featured' | 'sponsored';
  average_rating: number;
  total_reviews: number;
  featured_until?: string | null;
  homepage_featured: boolean;
  [key: string]: any;
}

export function rankVendors(vendors: Vendor[]): Vendor[] {
  const now = new Date();

  // Filter out expired subscriptions
  const activeVendors = vendors.map(vendor => {
    if (vendor.subscription_tier !== 'free' && vendor.featured_until) {
      const expiresAt = new Date(vendor.featured_until);
      if (expiresAt < now) {
        // Subscription expired, treat as free
        return { ...vendor, subscription_tier: 'free' as const };
      }
    }
    return vendor;
  });

  // Separate by tier
  const sponsored = activeVendors.filter(v => v.subscription_tier === 'sponsored');
  const featured = activeVendors.filter(v => v.subscription_tier === 'featured');
  const free = activeVendors.filter(v => v.subscription_tier === 'free');

  // Sort within each tier
  const sortByRating = (a: Vendor, b: Vendor) => {
    // Primary: average rating
    if (b.average_rating !== a.average_rating) {
      return b.average_rating - a.average_rating;
    }
    // Secondary: total reviews
    return b.total_reviews - a.total_reviews;
  };

  const sortedSponsored = sponsored.sort(sortByRating);
  const sortedFeatured = featured.sort(sortByRating);
  const sortedFree = free.sort(sortByRating);

  // Take top 3 sponsored, top 5 featured (positions 4-8)
  const topSponsored = sortedSponsored.slice(0, 3);
  const topFeatured = sortedFeatured.slice(0, 5);

  // Combine: Sponsored → Featured → Free
  return [...topSponsored, ...topFeatured, ...sortedFree];
}

export function getHomepageFeatured(vendors: Vendor[]): Vendor[] {
  const now = new Date();

  // Filter for active sponsored vendors marked for homepage
  const homepageFeatured = vendors.filter(vendor => {
    if (vendor.subscription_tier !== 'sponsored' || !vendor.homepage_featured) {
      return false;
    }

    // Check if subscription is still active
    if (vendor.featured_until) {
      const expiresAt = new Date(vendor.featured_until);
      return expiresAt > now;
    }

    return false;
  });

  // Sort by rating
  return homepageFeatured.sort((a, b) => {
    if (b.average_rating !== a.average_rating) {
      return b.average_rating - a.average_rating;
    }
    return b.total_reviews - a.total_reviews;
  });
}

export function getVendorBadge(vendor: Vendor): {
  text: string;
  variant: 'default' | 'secondary' | 'accent' | 'premium';
  show: boolean;
} | null {
  const now = new Date();

  // Check if subscription is active
  if (vendor.subscription_tier !== 'free' && vendor.featured_until) {
    const expiresAt = new Date(vendor.featured_until);
    if (expiresAt < now) {
      return null; // Expired
    }
  }

  switch (vendor.subscription_tier) {
    case 'sponsored':
      return {
        text: 'Verified Premium',
        variant: 'premium',
        show: true,
      };
    case 'featured':
      return {
        text: 'Featured',
        variant: 'accent',
        show: true,
      };
    default:
      return null;
  }
}
