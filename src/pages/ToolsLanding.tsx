import { SEO } from "@/components/SEO";
import { MobilePageHeader } from "@/components/mobile/MobilePageHeader";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calculator, Calendar, Mail, Music, Mic, Brain, Heart, Shield, Sparkles, Wand2 } from "lucide-react";

const tools = [
  {
    title: "Budget Calculator",
    description: "Get instant category-wise wedding budget breakdown",
    icon: Calculator,
    path: "/budget-calculator",
    color: "from-amber-500 to-orange-600",
    emoji: "💰",
  },
  {
    title: "Muhurat Finder",
    description: "Find auspicious wedding dates for 2025",
    icon: Calendar,
    path: "/muhurat-finder",
    color: "from-rose-500 to-pink-600",
    emoji: "🪔",
  },
  {
    title: "AI Wedding Planner",
    description: "Generate a complete wedding plan with AI",
    icon: Wand2,
    path: "/plan-wizard",
    color: "from-violet-500 to-purple-600",
    emoji: "✨",
  },
  {
    title: "Invite Creator",
    description: "Design beautiful digital wedding invitations",
    icon: Mail,
    path: "/invite-creator",
    color: "from-emerald-500 to-teal-600",
    emoji: "💌",
  },
  {
    title: "Music Generator",
    description: "Create personalized wedding songs with AI",
    icon: Music,
    path: "/music-generator",
    color: "from-blue-500 to-indigo-600",
    emoji: "🎵",
  },
  {
    title: "Speech Writer",
    description: "AI-powered wedding speech & toast writer",
    icon: Mic,
    path: "/speech-writer",
    color: "from-cyan-500 to-blue-600",
    emoji: "🎤",
  },
  {
    title: "Budget Roast",
    description: "Get your wedding budget hilariously roasted",
    icon: Brain,
    path: "/budget-roast",
    color: "from-red-500 to-rose-600",
    emoji: "🔥",
  },
  {
    title: "Couple Quiz",
    description: "Fun compatibility quiz for couples",
    icon: Heart,
    path: "/couple-quiz",
    color: "from-pink-500 to-rose-600",
    emoji: "💕",
  },
  {
    title: "Vendor Check",
    description: "Verify vendor trust score before booking",
    icon: Shield,
    path: "/vendor-check",
    color: "from-green-500 to-emerald-600",
    emoji: "🛡️",
  },
];

const ToolsLanding = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title="Free Wedding Planning Tools | Karlo Shaadi"
        description="Budget calculator, muhurat finder, AI planner, invite creator, music generator & more — all free wedding planning tools in one place."
        keywords="wedding tools, budget calculator, muhurat finder, wedding planner, invite creator"
      />
      <MobilePageHeader title="Wedding Tools" />
      <main className={isMobile ? "flex-1 px-4 pt-4 pb-28" : "flex-1 pt-20 pb-16 px-4"}>
        <div className="max-w-4xl mx-auto">
          {!isMobile && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-10"
            >
              <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">
                Wedding Planning Tools
              </h1>
              <p className="text-muted-foreground max-w-lg mx-auto">
                Everything you need to plan your perfect wedding — all free, no signup required
              </p>
            </motion.div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
            {tools.map((tool, index) => (
              <motion.div
                key={tool.path}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={tool.path}
                  className="group block h-full rounded-2xl border border-border/60 bg-card hover:border-primary/30 hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  <div className="p-4 md:p-5 flex flex-col items-center text-center gap-3">
                    <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                      <span className="text-2xl md:text-3xl">{tool.emoji}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm md:text-base leading-tight mb-1">
                        {tool.title}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-snug line-clamp-2">
                        {tool.description}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ToolsLanding;
