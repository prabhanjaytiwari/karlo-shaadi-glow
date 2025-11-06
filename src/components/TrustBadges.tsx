import { Shield, Lock, Headphones, Award } from "lucide-react";

export const TrustBadges = () => {
  const badges = [
    {
      icon: Lock,
      text: "Secure Payment",
      color: "text-green-600 dark:text-green-400"
    },
    {
      icon: Shield,
      text: "Money Back Guarantee",
      color: "text-blue-600 dark:text-blue-400"
    },
    {
      icon: Headphones,
      text: "24/7 Support",
      color: "text-purple-600 dark:text-purple-400"
    },
    {
      icon: Award,
      text: "Verified Vendors",
      color: "text-accent"
    }
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 py-4 px-2">
      {badges.map((badge, idx) => (
        <div 
          key={idx}
          className="flex items-center gap-2 text-sm font-medium"
        >
          <badge.icon className={`h-4 w-4 ${badge.color}`} />
          <span className="text-muted-foreground">{badge.text}</span>
          {idx < badges.length - 1 && (
            <span className="text-muted-foreground/30 ml-2">•</span>
          )}
        </div>
      ))}
    </div>
  );
};
