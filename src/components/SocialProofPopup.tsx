import { useState, useEffect } from "react";
import { CheckCircle2 } from "lucide-react";

const recentActivities = [
  { name: "Priya", action: "booked a photographer", city: "Mumbai", time: "2 min ago" },
  { name: "Rahul & Sneha", action: "confirmed venue booking", city: "Delhi", time: "5 min ago" },
  { name: "Anita", action: "booked catering services", city: "Bangalore", time: "8 min ago" },
  { name: "Vikram", action: "completed payment", city: "Jaipur", time: "12 min ago" },
  { name: "Kavita", action: "added vendor to favorites", city: "Pune", time: "15 min ago" },
  { name: "Rohan & Priya", action: "booked makeup artist", city: "Chennai", time: "18 min ago" },
  { name: "Meera", action: "submitted booking request", city: "Hyderabad", time: "22 min ago" },
  { name: "Amit", action: "scheduled consultation", city: "Ahmedabad", time: "25 min ago" },
];

export function SocialProofPopup() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    // Start showing after 10 seconds
    const initialTimeout = setTimeout(() => {
      setIsVisible(true);
    }, 10000);

    return () => clearTimeout(initialTimeout);
  }, []);

  useEffect(() => {
    if (!isVisible || hasInteracted) return;

    // Show for 5 seconds, hide for 15 seconds
    const hideTimeout = setTimeout(() => {
      setIsVisible(false);
      
      const showTimeout = setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % recentActivities.length);
        setIsVisible(true);
      }, 15000);

      return () => clearTimeout(showTimeout);
    }, 5000);

    return () => clearTimeout(hideTimeout);
  }, [isVisible, currentIndex, hasInteracted]);

  if (!isVisible || hasInteracted) return null;

  const activity = recentActivities[currentIndex];

  return (
    <div 
      className="fixed bottom-20 left-4 z-50 max-w-xs animate-fade-up cursor-pointer"
      onClick={() => setHasInteracted(true)}
    >
      <div className="bg-white/95 backdrop-blur-md border border-green-200 rounded-xl shadow-lg p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-full bg-green-100">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">
              <span className="font-semibold">{activity.name}</span> just {activity.action}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {activity.city} • {activity.time}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
