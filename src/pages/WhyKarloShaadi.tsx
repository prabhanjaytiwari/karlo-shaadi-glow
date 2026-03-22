import { SEO } from "@/components/SEO";
import { MobilePageHeader } from "@/components/mobile/MobilePageHeader";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Heart, Camera, Users, Star, Shield, Sparkles,
  ArrowRight, CheckCircle2, Crown, Gem, HandHeart,
  Music, Utensils, MapPin
} from "lucide-react";

import heroImg from "@/assets/wedding-ceremony.jpg";
import coupleImg from "@/assets/wedding-couple-romantic.jpg";
import friendsImg from "@/assets/wedding-friends.jpg";
import bridesmaidsImg from "@/assets/wedding-bridesmaids.jpg";
import haldiImg from "@/assets/wedding-haldi.jpg";
import decorationImg from "@/assets/wedding-decoration.jpg";
import cateringImg from "@/assets/wedding-catering.jpg";
import vendorSectionImg from "@/assets/section-vendors.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }
  })
};

const familyRoles = [
  {
    title: "The Couple",
    subtitle: "Your dream, your way",
    description: "Build your wedding exactly how you imagined it. AI-powered planning, budget tools, and a personal wedding website — all in your hands.",
    image: coupleImg,
    icon: Heart,
    features: ["AI Wedding Planner", "Wedding Website Builder", "Guest List Manager"],
    gradient: "",
  },
  {
    title: "The Best Friends",
    subtitle: "Partners in crime, partners in planning",
    description: "Help your bestie find the perfect photographer, choreograph the sangeet, or just roast their budget. We have tools for that.",
    image: friendsImg,
    icon: Users,
    features: ["Couple Quiz", "Budget Roast", "Speech Writer"],
    gradient: "",
  },
  {
    title: "The Siblings",
    subtitle: "The real event managers",
    description: "From mehendi coordination to surprising the couple with a custom song — siblings run the show. We give you the backstage pass.",
    image: bridesmaidsImg,
    icon: Sparkles,
    features: ["Music Generator", "Invite Creator", "Shaadi Wrapped"],
    gradient: "",
  },
  {
    title: "The Parents & Family",
    subtitle: "Trust, tradition, and peace of mind",
    description: "Every vendor is verified. Every payment is milestone-protected. Track everything from muhurat dates to budget allocation — no surprises.",
    image: haldiImg,
    icon: Shield,
    features: ["Verified Vendors", "Muhurat Finder", "Budget Calculator"],
    gradient: "",
  },
];

const vendorBenefits = [
  { icon: Crown, title: "Zero Commission", desc: "Keep 100% of what you earn. No hidden cuts." },
  { icon: Star, title: "Verified Badge", desc: "Stand out with our trust verification system." },
  { icon: MapPin, title: "City-Level SEO", desc: "Get discovered by couples searching in your city." },
  { icon: Gem, title: "Portfolio Showcase", desc: "Beautiful profile with photos, videos & reviews." },
  { icon: HandHeart, title: "Shaadi Seva Fund", desc: "Every booking contributes to underprivileged weddings." },
  { icon: Camera, title: "AI-Powered Matching", desc: "Our AI recommends you to the right couples." },
];

const stats = [
  { value: "20+", label: "Cities" },
  { value: "16", label: "Service Categories" },
  { value: "0%", label: "Commission" },
  { value: "100%", label: "Verified Vendors" },
];

export default function WhyKarloShaadi() {
  return (
    <div className="min-h-screen bg-background">
      <MobilePageHeader title="Why Karlo Shaadi" />
      <SEO
        title="Why Karlo Shaadi — For Couples, Families & Vendors"
        description="Karlo Shaadi is built for everyone involved in a wedding — the couple, siblings, best friends, parents, and vendors. Discover why thousands trust us."
        keywords="why karlo shaadi, wedding planning platform, family wedding planning, verified wedding vendors india"
      />

      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg} alt="Indian wedding ceremony" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-white/80 text-sm tracking-[0.3em] uppercase mb-4 font-medium">
              More than a platform
            </p>
            <h1 className="font-display font-semibold text-3xl md:text-5xl text-white mb-6 leading-[1.1]">
              Every Family Member
              <br />
              <span className="text-accent">Has a Role</span>
            </h1>
            <p className="text-white/80 text-sm sm:text-base max-w-2xl mx-auto mb-8">
              Karlo Shaadi isn't just for the couple. It's built for everyone who makes a wedding happen — 
              the parents who worry, the siblings who plan, and the friends who celebrate.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/plan-wizard">
                <Button size="lg" className="rounded-full px-8 text-base">
                  Start Planning <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/for-vendors">
                <Button size="lg" variant="outline" className="rounded-full px-8 text-base border-white/30 text-white hover:bg-white/10">
                  Join as Vendor
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-8 border-b border-border/30 bg-card shadow-[var(--shadow-sm)]">
        <div className="container mx-auto px-4">
          <div className="flex justify-center gap-8 md:gap-16">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                className="text-center"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <p className="font-display font-bold text-2xl md:text-3xl text-primary">{stat.value}</p>
                <p className="text-xs md:text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Family Roles Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-accent text-sm tracking-[0.2em] uppercase font-medium mb-3">Built for everyone</p>
            <h2 className="font-display font-semibold text-2xl md:text-3xl mb-4">
              A Wedding is a <span className="text-primary">Family Affair</span>
            </h2>
            <div className="w-16 h-0.5 bg-primary/30 mx-auto rounded-full mb-4" />
            <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
              Every person brings something irreplaceable. We built tools for each of them.
            </p>
          </motion.div>

          <div className="space-y-20 md:space-y-28">
            {familyRoles.map((role, i) => (
              <motion.div
                key={role.title}
                className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 md:gap-16 items-center`}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
              >
                {/* Image */}
                <div className="md:w-1/2">
                  <div className={`relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br ${role.gradient}`}>
                    <img
                      src={role.image}
                      alt={role.title}
                      className="w-full aspect-[4/3] object-cover mix-blend-normal"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    <div className="absolute bottom-4 left-4 flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <role.icon className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-white font-semibold text-lg drop-shadow-lg">{role.title}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="md:w-1/2">
                  <p className="text-accent text-sm font-medium tracking-wider uppercase mb-2">{role.subtitle}</p>
                  <h3 className="font-display font-semibold text-2xl md:text-3xl mb-4">{role.title}</h3>
                  <p className="text-muted-foreground text-base md:text-lg mb-6 leading-relaxed">
                    {role.description}
                  </p>
                  <div className="space-y-3">
                    {role.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0" />
                        <span className="text-foreground font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Vendor Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12 md:gap-16 items-center mb-16">
            <motion.div
              className="md:w-1/2"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={vendorSectionImg}
                  alt="Wedding vendors at work"
                  className="w-full aspect-[4/3] object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />
              </div>
            </motion.div>

            <motion.div
              className="md:w-1/2"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <p className="text-primary text-sm tracking-[0.2em] uppercase font-medium mb-3">For vendors</p>
              <h2 className="font-display font-semibold text-2xl md:text-3xl mb-4">
                Grow Your Wedding Business <span className="text-primary">Your Way</span>
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base mb-8 leading-relaxed">
                No commissions. No middlemen. Just direct connections with couples who are ready to book. 
                Join India's most vendor-friendly wedding marketplace.
              </p>
              <Link to="/for-vendors">
                <Button size="lg" className="rounded-full px-8">
                  Register Your Business <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {vendorBenefits.map((benefit, i) => (
              <motion.div
                key={benefit.title}
                className="p-6 rounded-2xl bg-card border border-border/50 hover:border-accent/30 hover:shadow-lg transition-all duration-300"
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                  <benefit.icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Heart className="h-10 w-10 text-primary mx-auto mb-6" />
            <h2 className="font-display font-semibold text-2xl md:text-3xl mb-6 leading-tight">
              Your Wedding Deserves
              <br />
              <span className="text-primary">The Whole Family</span>
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base mb-10 max-w-xl mx-auto">
              Start planning together. Share tools, split responsibilities, and make memories before the big day even begins.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/plan-wizard">
                <Button size="lg" className="rounded-full px-8">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Plan Your Wedding
                </Button>
              </Link>
              <Link to="/categories">
                <Button size="lg" variant="outline" className="rounded-full px-8">
                  Browse Vendors
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      
    </div>
  );
}