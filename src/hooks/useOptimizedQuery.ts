import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type VendorCategory = Database["public"]["Enums"]["vendor_category"];

// Stale time configurations for different data types
export const STALE_TIMES = {
  // Static data that rarely changes
  STATIC: 1000 * 60 * 60, // 1 hour
  // User-specific data
  USER: 1000 * 60 * 5, // 5 minutes
  // Frequently changing data
  REALTIME: 1000 * 30, // 30 seconds
  // Dashboard/analytics data
  DASHBOARD: 1000 * 60 * 2, // 2 minutes
} as const;

// Cache time configurations
export const CACHE_TIMES = {
  SHORT: 1000 * 60 * 5, // 5 minutes
  MEDIUM: 1000 * 60 * 30, // 30 minutes
  LONG: 1000 * 60 * 60, // 1 hour
} as const;

/**
 * Hook to fetch categories with optimized caching
 */
export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("is_active", true)
        .order("display_order");
      
      if (error) throw error;
      return data;
    },
    staleTime: STALE_TIMES.STATIC,
    gcTime: CACHE_TIMES.LONG,
  });
};

/**
 * Hook to fetch cities with optimized caching
 */
export const useCities = () => {
  return useQuery({
    queryKey: ["cities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cities")
        .select("*")
        .eq("is_active", true)
        .order("name");
      
      if (error) throw error;
      return data;
    },
    staleTime: STALE_TIMES.STATIC,
    gcTime: CACHE_TIMES.LONG,
  });
};

/**
 * Hook to fetch vendors with optimized pagination and caching
 */
export const useVendors = (options?: {
  category?: VendorCategory;
  cityId?: string;
  verified?: boolean;
  featured?: boolean;
  limit?: number;
  page?: number;
}) => {
  const { category, cityId, verified, featured, limit = 20, page = 1 } = options || {};
  
  return useQuery({
    queryKey: ["vendors", { category, cityId, verified, featured, limit, page }],
    queryFn: async () => {
      let query = supabase
        .from("vendors")
        .select(`
          *,
          city:cities(name),
          services:vendor_services(*)
        `, { count: "exact" })
        .eq("is_active", true)
        .range((page - 1) * limit, page * limit - 1);
      
      if (category) query = query.eq("category", category);
      if (cityId) query = query.eq("city_id", cityId);
      if (verified !== undefined) query = query.eq("verified", verified);
      if (featured) query = query.eq("homepage_featured", true);
      
      const { data, error, count } = await query;
      
      if (error) throw error;
      return { vendors: data, total: count };
    },
    staleTime: STALE_TIMES.DASHBOARD,
    gcTime: CACHE_TIMES.MEDIUM,
    placeholderData: (previousData) => previousData,
  });
};

/**
 * Hook to fetch a single vendor with their full profile
 */
export const useVendorProfile = (vendorId: string | undefined) => {
  return useQuery({
    queryKey: ["vendor", vendorId],
    queryFn: async () => {
      if (!vendorId) throw new Error("Vendor ID required");
      
      const { data, error } = await supabase
        .from("vendors")
        .select(`
          *,
          city:cities(name, state),
          services:vendor_services(*),
          portfolio:vendor_portfolio(*),
          reviews:reviews(
            *,
            profile:profiles(full_name, avatar_url)
          )
        `)
        .eq("id", vendorId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!vendorId,
    staleTime: STALE_TIMES.USER,
    gcTime: CACHE_TIMES.MEDIUM,
  });
};

/**
 * Hook to fetch user bookings
 */
export const useUserBookings = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["bookings", userId],
    queryFn: async () => {
      if (!userId) throw new Error("User ID required");
      
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          vendor:vendors(
            id,
            business_name,
            category,
            logo_url,
            city:cities(name)
          ),
          service:vendor_services(service_name, base_price),
          payments(*)
        `)
        .eq("couple_id", userId)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
    staleTime: STALE_TIMES.USER,
    gcTime: CACHE_TIMES.SHORT,
  });
};

/**
 * Hook to fetch user favorites
 */
export const useUserFavorites = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["favorites", userId],
    queryFn: async () => {
      if (!userId) throw new Error("User ID required");
      
      const { data, error } = await supabase
        .from("favorites")
        .select(`
          *,
          vendor:vendors(
            id,
            business_name,
            category,
            logo_url,
            average_rating,
            total_reviews,
            verified,
            city:cities(name)
          )
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
    staleTime: STALE_TIMES.USER,
    gcTime: CACHE_TIMES.SHORT,
  });
};

/**
 * Hook to fetch user profile
 */
export const useUserProfile = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      if (!userId) throw new Error("User ID required");
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
    staleTime: STALE_TIMES.USER,
    gcTime: CACHE_TIMES.MEDIUM,
  });
};

/**
 * Hook to fetch wedding stories
 */
export const useWeddingStories = (options?: {
  featured?: boolean;
  limit?: number;
}) => {
  const { featured, limit = 10 } = options || {};
  
  return useQuery({
    queryKey: ["wedding-stories", { featured, limit }],
    queryFn: async () => {
      let query = supabase
        .from("wedding_stories")
        .select(`
          *,
          city:cities(name),
          photos:story_photos(*)
        `)
        .eq("status", "approved")
        .order("created_at", { ascending: false })
        .limit(limit);
      
      if (featured) query = query.eq("featured", true);
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    },
    staleTime: STALE_TIMES.STATIC,
    gcTime: CACHE_TIMES.LONG,
  });
};

/**
 * Hook to prefetch data for better UX
 */
export const usePrefetch = () => {
  const queryClient = useQueryClient();
  
  const prefetchVendor = (vendorId: string) => {
    queryClient.prefetchQuery({
      queryKey: ["vendor", vendorId],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("vendors")
          .select(`
            *,
            city:cities(name, state),
            services:vendor_services(*),
            portfolio:vendor_portfolio(*)
          `)
          .eq("id", vendorId)
          .single();
        
        if (error) throw error;
        return data;
      },
      staleTime: STALE_TIMES.USER,
    });
  };
  
  const prefetchCategories = () => {
    queryClient.prefetchQuery({
      queryKey: ["categories"],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("categories")
          .select("*")
          .eq("is_active", true)
          .order("display_order");
        
        if (error) throw error;
        return data;
      },
      staleTime: STALE_TIMES.STATIC,
    });
  };
  
  return { prefetchVendor, prefetchCategories };
};

/**
 * Hook to invalidate related queries after mutations
 */
export const useQueryInvalidation = () => {
  const queryClient = useQueryClient();
  
  const invalidateVendorData = (vendorId?: string) => {
    queryClient.invalidateQueries({ queryKey: ["vendors"] });
    if (vendorId) {
      queryClient.invalidateQueries({ queryKey: ["vendor", vendorId] });
    }
  };
  
  const invalidateUserData = (userId: string) => {
    queryClient.invalidateQueries({ queryKey: ["profile", userId] });
    queryClient.invalidateQueries({ queryKey: ["bookings", userId] });
    queryClient.invalidateQueries({ queryKey: ["favorites", userId] });
  };
  
  const invalidateAll = () => {
    queryClient.invalidateQueries();
  };
  
  return { invalidateVendorData, invalidateUserData, invalidateAll };
};
