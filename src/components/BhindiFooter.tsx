import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Instagram, Linkedin, Facebook, ArrowRight, Youtube, Twitter, Phone, Mail, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { cdn } from "@/lib/cdnAssets";

const footerLinks = {
  company: [
    { label: "About Us", to: "/about" },
    { label: "Why Karlo Shaadi", to: "/why-karlo-shaadi" },
    { label: "Real Weddings", to: "/stories" },
    { label: "Blog", to: "/blog" },
    { label: "Leaderboard", to: "/leaderboard" },
    { label: "Investors", to: "/investors" },
    { label: "Careers", to: "/join-as-manager" },
    { label: "Shaadi Seva", to: "/shaadi-seva" },
    { label: "Earn with Us", to: "/earn" },
  ],
  planning: [
    { label: "AI Wedding Plan", to: "/plan-wizard" },
    { label: "Budget Calculator", to: "/budget-calculator" },
    { label: "Muhurat Finder", to: "/muhurat-finder" },
    { label: "Invite Creator", to: "/invite-creator" },
    { label: "Guest List", to: "/guest-list" },
    { label: "Music Generator", to: "/music-generator" },
    { label: "Couple Quiz", to: "/couple-quiz" },
    { label: "Family Frame", to: "/family-frame" },
  ],
  vendors: [
    { label: "Register as Vendor", to: "/vendor/onboarding" },
    { label: "Vendor Login", to: "/vendor-auth" },
    { label: "Vendor Guide", to: "/vendor-guide" },
    { label: "Vendor Pricing", to: "/vendor-pricing" },
    { label: "Success Stories", to: "/vendor-success-stories" },
    { label: "Check Vendor Trust", to: "/vendor-check" },
    { label: "Profile Setup Service", to: "/vendor-profile-setup" },
  ],
  explore: [
    { label: "Wedding Directory", to: "/wedding-directory" },
    { label: "Photography", to: "/category/photography" },
    { label: "Venues", to: "/category/venues" },
    { label: "Catering", to: "/category/catering" },
    { label: "Decoration", to: "/category/decoration" },
    { label: "All Categories", to: "/categories" },
    { label: "Web Stories", to: "/web-stories" },
  ],
  support: [
    { label: "Help Center", to: "/help" },
    { label: "FAQ", to: "/faq" },
    { label: "Contact Us", to: "/support" },
    { label: "Report an Issue", to: "/support?type=report" },
  ],
  legal: [
    { label: "Terms of Service", to: "/legal" },
    { label: "Privacy Policy", to: "/privacy" },
    { label: "Refund Policy", to: "/cancellation-refunds" },
    { label: "Shipping Policy", to: "/shipping" },
  ],
};

const socialLinks = [
  { icon: Instagram, href: "https://www.instagram.com/karloshaadiofficial/", label: "Instagram" },
  { icon: Facebook, href: "https://www.facebook.com/profile.php?id=61584618427446", label: "Facebook" },
  { icon: Linkedin, href: "https://www.linkedin.com/company/karlo-shaadi/", label: "LinkedIn" },
  { icon: Youtube, href: "https://youtube.com/@karloshaadiofficial", label: "YouTube" },
  { icon: Twitter, href: "https://twitter.com/karloshaadi", label: "Twitter" },
];

export const BhindiFooter = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isVendor, setIsVendor] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const checkUserRole = async (userId: string) => {
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);
    
    setIsVendor(roles?.some(r => r.role === "vendor") || false);
  };

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    if (user) {
      checkUserRole(user.id);
    }
  };

  useEffect(() => {
    checkAuth();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkUserRole(session.user.id);
      } else {
        setIsVendor(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isMobile) return null;

  const getCtaButton = () => {
    if (!user) {
      return (
        <Button size="default" className="rounded-full px-6" asChild>
          <Link to="/auth">
            <span className="flex items-center gap-2">Get Started <ArrowRight className="w-4 h-4" /></span>
          </Link>
        </Button>
      );
    }
    if (isVendor) {
      return (
        <Button size="default" className="rounded-full px-6" asChild>
          <Link to="/vendor/dashboard">
            <span className="flex items-center gap-2">Vendor Dashboard <ArrowRight className="w-4 h-4" /></span>
          </Link>
        </Button>
      );
    }
    return (
      <Button size="default" className="rounded-full px-6" asChild>
        <Link to="/dashboard">
          <span className="flex items-center gap-2">Go to Dashboard <ArrowRight className="w-4 h-4" /></span>
        </Link>
      </Button>
    );
  };

  const getVendorLinks = () => {
    if (isVendor) {
      return [
        { label: "Vendor Dashboard", to: "/vendor/dashboard" },
        { label: "Vendor Pricing", to: "/vendor-pricing" },
        { label: "Success Stories", to: "/vendor-success-stories" },
      ];
    }
    return footerLinks.vendors;
  };

  const getFooterSections = () => ({
    Company: footerLinks.company,
    Planning: footerLinks.planning,
    Explore: footerLinks.explore,
    Vendors: getVendorLinks(),
    Support: footerLinks.support,
  });

  return (
    <footer className="bg-background">
      {/* CTA Section */}
      <div className="container mx-auto px-4 md:px-6 py-16">
        <div className="rounded-2xl bg-muted/30 px-6 sm:px-12 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h2 className="font-semibold text-foreground text-lg md:text-xl max-w-2xl">
              {!user 
                ? "Start Planning Your Wedding Today"
                : isVendor 
                  ? "Manage Your Vendor Profile"
                  : "Continue Planning Your Wedding"
              }
            </h2>
            <p className="text-muted-foreground text-sm">
              {!user 
                ? "Connect with verified vendors and bring your vision to life"
                : isVendor 
                  ? "Update your profile, manage bookings, and grow your business"
                  : "Track your bookings, budget, and wedding checklist"
              }
            </p>
          </div>
          {getCtaButton()}
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 md:px-6 py-16 border-t border-border/50">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-8 lg:gap-6 mb-16">
          {/* Brand Section */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2 space-y-5">
            <img 
              src={cdn.logo} 
              alt="Karlo Shaadi Logo" 
              className="h-12 w-auto"
              style={{ mixBlendMode: 'multiply' }}
            />
            <p className="text-muted-foreground leading-relaxed text-sm max-w-sm">
              India's trusted zero-commission wedding planning platform. Connecting couples with verified vendors across 20+ cities.
            </p>
            
            <div className="space-y-2 text-sm">
              <a href="tel:+917011460321" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <Phone className="h-4 w-4" />
                <span>+91 70114 60321</span>
              </a>
              <a href="mailto:hi@karloshaadi.com" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <Mail className="h-4 w-4" />
                <span>hi@karloshaadi.com</span>
              </a>
              <div className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Lucknow, Uttar Pradesh, India</span>
              </div>
            </div>
            
            <div className="flex gap-2 flex-wrap">
              {socialLinks.map((social) => (
                <a 
                  key={social.label}
                  href={social.href} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-muted/50 hover:bg-muted transition-colors flex items-center justify-center"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4 text-muted-foreground" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(getFooterSections()).map(([category, links]) => (
            <div key={category} className="space-y-3">
              <h3 className="font-semibold text-xs uppercase tracking-wider text-foreground">
                {category}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.to}>
                    <Link 
                      to={link.to} 
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Legal Links Row */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-12 text-xs text-muted-foreground">
          {footerLinks.legal.map((link, index) => (
            <span key={link.to} className="flex items-center gap-4">
              <Link to={link.to} className="hover:text-foreground transition-colors">
                {link.label}
              </Link>
              {index < footerLinks.legal.length - 1 && <span className="text-border">•</span>}
            </span>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-border/30">
          <p className="text-xs text-muted-foreground">
            © {currentYear} Karlo Shaadi. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>Made in India 🇮🇳</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
