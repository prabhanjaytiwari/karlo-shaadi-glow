import { SEO } from "@/components/SEO";
import { MobilePageHeader } from "@/components/mobile/MobilePageHeader";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const tools = [
  { title: "Budget Calculator", description: "Category-wise wedding budget breakdown", path: "/budget-calculator", emoji: "💰" },
  { title: "Muhurat Finder", description: "Find auspicious wedding dates", path: "/muhurat-finder", emoji: "🪔" },
  { title: "AI Wedding Planner", description: "Generate a complete wedding plan", path: "/plan-wizard", emoji: "✨" },
  { title: "Invite Creator", description: "Design digital wedding invitations", path: "/invite-creator", emoji: "💌" },
  { title: "Music Generator", description: "Create personalized wedding songs", path: "/music-generator", emoji: "🎵" },
  { title: "Speech Writer", description: "Wedding speech & toast writer", path: "/speech-writer", emoji: "🎤" },
  { title: "Family Frame", description: "Add a loved one to your wedding photo", path: "/family-frame", emoji: "🖼️" },
  { title: "Couple Quiz", description: "Fun compatibility quiz for couples", path: "/couple-quiz", emoji: "💕" },
  { title: "Vendor Check", description: "Verify vendor trust score", path: "/vendor-check", emoji: "🛡️" },
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
              <h1 className="text-3xl md:text-4xl font-display font-bold mb-3 text-foreground">
                Wedding Planning Tools
              </h1>
              <p className="text-muted-foreground max-w-lg mx-auto">
                Everything you need to plan your perfect wedding — all free
              </p>
            </motion.div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {tools.map((tool, index) => (
              <motion.div
                key={tool.path}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04, duration: 0.35 }}
              >
                <Link
                  to={tool.path}
                  className="group block h-full rounded-2xl bg-card shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
                >
                  <div className="p-4 md:p-5 flex flex-col items-center text-center gap-3">
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-muted/50 flex items-center justify-center">
                      <span className="text-2xl md:text-3xl">{tool.emoji}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm md:text-base leading-tight mb-1 text-foreground">
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
