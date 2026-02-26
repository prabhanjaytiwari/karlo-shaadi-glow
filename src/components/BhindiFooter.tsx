import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import logo from "@/assets/logo-new.png";
import { Instagram, Linkedin, Facebook, ArrowRight, Youtube, Twitter, Phone, Mail, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

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
    { label: "Budget Roast", to: "/budget-roast" },
  ],
  vendors: [
    { label: "Register as Vendor", to: "/for-vendors" },
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
    { label: "Report an Issue", to: "/support" },
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

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    if (user) {
      checkUserRole(user.id);
    }
  };

  const checkUserRole = async (userId: string) => {
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);
    
    setIsVendor(roles?.some(r => r.role === "vendor") || false);
  };

  const getCtaButton = () => {
    if (!user) {
      return (
        <Button 
          size="default" 
          className="rounded-full px-6"
          asChild
        >
          <Link to="/auth">
            <span className="flex items-center gap-2">
              Get Started
              <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        </Button>
      );
    }

    if (isVendor) {
      return (
        <Button 
          size="default" 
          className="rounded-full px-6"
          asChild
        >
          <Link to="/vendor/dashboard">
            <span className="flex items-center gap-2">
              Vendor Dashboard
              <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        </Button>
      );
    }

    return (
      <Button 
        size="default" 
        className="rounded-full px-6"
        asChild
      >
        <Link to="/dashboard">
          <span className="flex items-center gap-2">
            Go to Dashboard
            <ArrowRight className="w-4 h-4" />
          </span>
        </Link>
      </Button>
    );
  };

  // Filter vendor links for existing vendors
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

  // Get all footer sections
  const getFooterSections = () => {
    return {
      Company: footerLinks.company,
      Planning: footerLinks.planning,
      Explore: footerLinks.explore,
      Vendors: getVendorLinks(),
      Support: footerLinks.support,
    };
  };

  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-rose-50/50 via-white to-amber-50/30">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(38_90%_55%/0.05)_0%,transparent_50%)]" />
      
      {/* CTA Section */}
      <div className="relative container mx-auto px-6 py-16">
        <div className="group relative rounded-2xl overflow-hidden">
          {/* CTA Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/10 to-primary/5" />
          
          {/* Border */}
          <div className="absolute inset-0 rounded-2xl border-2 border-accent/30" />
          
          <div className="relative px-8 sm:px-12 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
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
      </div>

      {/* Main Footer */}
      <div className="relative container mx-auto px-6 py-16">
        {/* Divider with gradient */}
        <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-8 lg:gap-6 mb-16">
          {/* Brand Section */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2 space-y-5">
            <div className="flex items-center gap-3">
              <div className="relative group/logo">
                <div className="absolute -inset-2 bg-accent/20 rounded-xl blur-lg opacity-0 group-hover/logo:opacity-100 transition-opacity duration-500" />
                <img 
                  src={logo} 
                  alt="Karlo Shaadi Logo" 
                  className="relative h-12 w-auto"
                  style={{ mixBlendMode: 'multiply' }}
                />
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed text-sm max-w-sm">
              India's trusted wedding planning platform. Connecting couples with 5000+ verified vendors across 50+ cities.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2 text-sm">
              <a href="tel:+917011460321" className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors">
                <Phone className="h-4 w-4" />
                <span>+91 70114 60321</span>
              </a>
              <a href="mailto:hello@karloshaadi.com" className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors">
                <Mail className="h-4 w-4" />
                <span>hello@karloshaadi.com</span>
              </a>
              <div className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Delhi NCR, India</span>
              </div>
            </div>
            
            {/* Social Links */}
            <div className="flex gap-2 flex-wrap">
              {socialLinks.map((social, index) => (
                <a 
                  key={social.label}
                  href={social.href} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/social relative w-9 h-9 rounded-lg bg-white border border-accent/20 hover:border-accent/50 transition-all duration-300 flex items-center justify-center overflow-hidden shadow-sm"
                  aria-label={social.label}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/10 opacity-0 group-hover/social:opacity-100 transition-opacity duration-300" />
                  <social.icon className="relative w-4 h-4 text-muted-foreground group-hover/social:text-accent transition-colors duration-300" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(getFooterSections()).map(([category, links], categoryIndex) => (
            <div 
              key={category} 
              className="space-y-3"
            >
              <h3 className="font-semibold text-xs uppercase tracking-wider text-accent">
                {category}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.to}>
                    <Link 
                      to={link.to} 
                      className="group/link relative inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
                    >
                      <span className="relative">
                        {link.label}
                        {/* Animated underline */}
                        <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gradient-to-r from-accent to-primary group-hover/link:w-full transition-all duration-300" />
                      </span>
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
              <Link to={link.to} className="hover:text-accent transition-colors">
                {link.label}
              </Link>
              {index < footerLinks.legal.length - 1 && <span className="text-border">•</span>}
            </span>
          ))}
        </div>

        {/* Watermark Section */}
        <div className="relative py-12">
          {/* Large watermark text */}
          <div className="text-center text-[8rem] md:text-[12rem] font-bold text-accent/[0.08] select-none leading-none whitespace-nowrap overflow-hidden">
            Karlo Shaadi
          </div>
          
          {/* Bottom bar */}
          <div className="absolute inset-x-0 bottom-0 flex flex-col md:flex-row items-center justify-between gap-4 py-4">
            <p className="text-xs text-muted-foreground">
              © {currentYear} Karlo Shaadi. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>Made in India</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
