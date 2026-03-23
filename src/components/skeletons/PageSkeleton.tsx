import { Skeleton } from "@/components/ui/skeleton";

/** Full-page skeleton shown during route-level lazy loading */
export const PageSkeleton = () => (
  <div className="min-h-screen bg-background animate-fade-in">
    {/* Hero skeleton */}
    <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
      <Skeleton className="absolute inset-0 rounded-none" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6">
        <Skeleton className="h-8 w-64 md:w-96" />
        <Skeleton className="h-4 w-48 md:w-72" />
        <Skeleton className="h-10 w-36 rounded-full mt-2" />
      </div>
    </div>
    {/* Content grid skeleton */}
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="flex gap-3">
        <Skeleton className="h-8 w-24 rounded-full" />
        <Skeleton className="h-8 w-20 rounded-full" />
        <Skeleton className="h-8 w-28 rounded-full" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-[4/3] w-full rounded-xl" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

/** Compact skeleton for dashboard-style pages */
export const DashboardSkeleton = () => (
  <div className="min-h-screen bg-background p-4 md:p-8 space-y-6 animate-fade-in">
    <div className="flex items-center justify-between">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-9 w-28 rounded-lg" />
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-border/50 p-4 space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-7 w-16" />
        </div>
      ))}
    </div>
    <Skeleton className="h-64 w-full rounded-xl" />
  </div>
);
