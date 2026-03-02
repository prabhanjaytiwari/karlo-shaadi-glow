import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calculator, Calendar, Sparkles, Music, Mic2, Heart, Shield, Flame, Palette, FileImage } from "lucide-react";
import { SEO } from "@/components/SEO";
import { MobilePageHeader } from "@/components/mobile/MobilePageHeader";

const tools = [
  { icon: Calculator, label: "Budget Calculator", desc: "Category-wise wedding budget breakdown", path: "/budget-calculator", color: "from-emerald-500 to-teal-600", emoji: "💰" },
  { icon: Calendar, label: "Muhurat Finder", desc: "Auspicious dates for 2025 & 2026", path: "/muhurat-finder", color: "from-amber-500 to-orange-600", emoji: "📿" },
  { icon: Sparkles, label: "AI Wedding Planner", desc: "Get your complete wedding plan in 2 min", path: "/plan-wizard", color: "from-primary to-accent", emoji: "✨" },
  { icon: FileImage, label: "Invite Creator", desc: "AI-generated wedding invitations", path: "/invite-creator", color: "from-pink-500 to-rose-600", emoji: "💌" },
  { icon: Music, label: "Music Generator", desc: "Custom wedding songs with AI", path: "/music-generator", color: "from-violet-500 to-purple-600", emoji: "🎵" },
  { icon: Mic2, label: "Speech Writer", desc: "AI wedding speech & toast writer", path: "/speech-writer", color: "from-blue-500 to-indigo-600", emoji: "🎤" },
  { icon: Heart, label: "Couple Quiz", desc: "Fun compatibility quiz for couples", path: "/couple-quiz", color: "from-red-500 to-pink-600", emoji: "💕" },
  { icon: Shield, label: "Vendor Check", desc: "Verify any vendor's trust score", path: "/vendor-check", color: "from-cyan-500 to-blue-600", emoji: "🔍" },
  { icon: Flame, label: "Budget Roast", desc: "Get your budget hilariously roasted", path: "/budget-roast", color: "from-orange-500 to-red-600", emoji: "🔥" },
  { icon: Palette, label: "Moodboard Builder", desc: "Create your wedding vision board", path: "/moodboards", color: "from-fuchsia-500 to-pink-600", emoji: "🎨" },
];

export default function ToolsLanding() {
  return (
    <div className="min-h-screen bg-background pt-16 pb-24">
      <SEO title="Wedding Planning Tools | Karlo Shaadi" description="Free wedding planning tools: budget calculator, muhurat finder, AI planner, invite creator, and more." />
      <MobilePageHeader title="Wedding Tools" showBack={false} />
      
      <div className="container mx-auto px-4 py-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
            Wedding <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Tools</span>
          </h1>
          <p className="text-muted-foreground">Free tools to plan your dream shaadi ✨</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {tools.map((tool, i) => (
            <Link key={tool.path} to={tool.path}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group relative p-5 rounded-2xl border border-border/50 bg-card hover:border-accent/40 hover:shadow-lg transition-all duration-300 h-full"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <span className="text-2xl">{tool.emoji}</span>
                </div>
                <h3 className="font-semibold text-sm mb-1">{tool.label}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">{tool.desc}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}