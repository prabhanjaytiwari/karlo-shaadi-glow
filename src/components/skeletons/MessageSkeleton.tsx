import { Skeleton } from "@/components/ui/skeleton";

export const MessageSkeleton = () => {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
          <div className={`max-w-[70%] ${i % 2 === 0 ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
            <Skeleton className="h-4 w-20" />
            <Skeleton className={`h-16 ${i % 2 === 0 ? 'w-48' : 'w-64'}`} />
          </div>
        </div>
      ))}
    </div>
  );
};
