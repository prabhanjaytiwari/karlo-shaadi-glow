import { useNavigate } from "react-router-dom";
import { Calculator, Calendar, Sparkles, Music, Mic2, Heart, Shield, Flame, Palette, FileImage } from "lucide-react";
import { SEO } from "@/components/SEO";
import { MobilePageHeader } from "@/components/mobile/MobilePageHeader";
import { CircularIconButton } from "@/components/mobile/CircularIconButton";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const tools = [
  { icon: Calculator, label: "Budget Calculator", desc: "Category-wise wedding budget breakdown", path: "/budget-calculator", variant: "maroon" as const },
  { icon: Calendar, label: "Muhurat Finder", desc: "Auspicious dates for 2025 & 2026", path: "/muhurat-finder", variant: "gold" as const },
  { icon: Sparkles, label: "Wedding Planner", desc: "Get your complete wedding plan in 2 min", path: "/plan-wizard", variant: "cream" as const },
  { icon: FileImage, label: "Invite Creator", desc: "AI-generated wedding invitations", path: "/invite-creator", variant: "maroon" as const },
  { icon: Music, label: "Music Generator", desc: "Custom wedding songs with AI", path: "/music-generator", variant: "gold" as const },
  { icon: Mic2, label: "Speech Writer", desc: "Wedding speech & toast writer", path: "/speech-writer", variant: "cream" as const },
  { icon: Heart, label: "Couple Quiz", desc: "Fun compatibility quiz for couples", path: "/couple-quiz", variant: "maroon" as const },
  { icon: Shield, label: "Vendor Check", desc: "Verify any vendor's trust score", path: "/vendor-check", variant: "gold" as const },
  { icon: Flame, label: "Budget Roast", desc: "Get your budget hilariously roasted", path: "/budget-roast", variant: "cream" as const },
  { icon: Palette, label: "Moodboard", desc: "Create your wedding vision board", path: "/moodboards", variant: "maroon" as const },
];

export default function ToolsLanding() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pt-16 pb-24">
      <SEO title="Wedding Planning Tools | Karlo Shaadi" description="Free wedding planning tools: budget calculator, muhurat finder, AI planner, invite creator, and more." />
      <MobilePageHeader title="Tools Hub" showBack={false} />

      <div className="container mx-auto px-4 py-6">
        {!isMobile && (
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
              Tools <span className="text-primary">Hub</span>
            </h1>
            <p className="text-muted-foreground">Free tools to plan your dream shaadi ✨</p>
          </div>
        )}

        {isMobile ? (
          /* Mobile: 3x3 circular icon grid */
          <div className="pt-2">
            <div className="grid grid-cols-3 gap-y-6 gap-x-4">
              {tools.map((tool, i) => (
                <motion.div
                  key={tool.path}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <CircularIconButton
                    icon={tool.icon}
                    label={tool.label}
                    onClick={() => navigate(tool.path)}
                    variant={tool.variant}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          /* Desktop: card grid */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {tools.map((tool, i) => (
              <Link key={tool.path} to={tool.path}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group relative p-5 rounded-2xl border border-border bg-card hover:border-primary/30 hover:shadow-lg transition-all duration-300 h-full"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <tool.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{tool.label}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">{tool.desc}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
