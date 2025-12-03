import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import logo from "@/assets/logo.png";
import { Instagram, Twitter, Youtube, Facebook, ArrowRight, Sparkles } from "lucide-react";

const footerLinks = {
  company: [
    { label: "About", to: "/about" },
    { label: "Stories", to: "/stories" },
    { label: "Investors", to: "/investors" },
    { label: "Contact", to: "/support" },
  ],
  vendors: [
    { label: "Register", to: "/for-vendors" },
    { label: "Vendor Login", to: "/vendor-auth" },
    { label: "Onboarding Guide", to: "/vendor-guide" },
    { label: "Pricing Plans", to: "/vendor-pricing" },
  ],
  support: [
    { label: "Help Center", to: "/help" },
    { label: "FAQ", to: "/faq" },
    { label: "Contact Us", to: "/support" },
  ],
  opportunities: [
    { label: "Join as Manager", to: "/join-as-manager" },
    { label: "Affiliate Program", to: "/affiliate" },
  ],
  legal: [
    { label: "Terms", to: "/legal" },
    { label: "Privacy", to: "/privacy" },
    { label: "Cancellation & Refunds", to: "/cancellation-refunds" },
    { label: "Shipping", to: "/shipping" },
  ],
};

const socialLinks = [
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Youtube, href: "#", label: "Youtube" },
  { icon: Facebook, href: "#", label: "Facebook" },
];

export const BhindiFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-primary/5" />
      <div className="absolute inset-0 noise-texture opacity-30" />
      
      {/* CTA Section */}
      <div className="relative container mx-auto px-6 py-16">
        <div className="group relative rounded-3xl overflow-hidden">
          {/* CTA Background with glassmorphism */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 backdrop-blur-xl" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          {/* Animated border */}
          <div className="absolute inset-0 rounded-3xl border border-primary/20 group-hover:border-primary/40 transition-colors duration-500" />
          <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500" />
          
          {/* Floating sparkles */}
          <div className="absolute top-6 right-12 text-primary/30 animate-pulse">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="absolute bottom-8 left-20 text-accent/30 animate-pulse" style={{ animationDelay: '1s' }}>
            <Sparkles className="w-4 h-4" />
          </div>
          
          <div className="relative px-12 py-16 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <h2 className="font-bold text-foreground text-xl md:text-2xl max-w-2xl">
                Join Us in Creating Your Perfect Wedding
              </h2>
              <p className="text-muted-foreground text-sm">
                Connect with verified vendors and start planning today
              </p>
            </div>
            <Button 
              variant="premium" 
              size="lg" 
              className="group/btn relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Get Started
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="relative container mx-auto px-6 py-16">
        {/* Divider with gradient */}
        <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-20">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <div className="relative group/logo">
                <div className="absolute -inset-2 bg-primary/20 rounded-xl blur-lg opacity-0 group-hover/logo:opacity-100 transition-opacity duration-500" />
                <img 
                  src={logo} 
                  alt="Karlo Shaadi Logo" 
                  className="relative h-12 w-auto"
                />
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed max-w-md">
              Karlo Shaadi is your wedding planning platform, connecting you with verified vendors to create seamless wedding experiences.
            </p>
            
            {/* Social Links with glow effects */}
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <a 
                  key={social.label}
                  href={social.href} 
                  className="group/social relative w-10 h-10 rounded-xl bg-muted/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-300 flex items-center justify-center overflow-hidden"
                  style={{ animationDelay: `${index * 100}ms` }}
                  aria-label={social.label}
                >
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 opacity-0 group-hover/social:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 bg-primary/10 scale-0 group-hover/social:scale-100 transition-transform duration-300 rounded-xl" />
                  
                  <social.icon className="relative w-4 h-4 text-muted-foreground group-hover/social:text-primary transition-colors duration-300 group-hover/social:scale-110 transform" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns with staggered reveal */}
          {Object.entries(footerLinks).map(([category, links], categoryIndex) => (
            <div 
              key={category} 
              className="space-y-4"
              style={{ animationDelay: `${categoryIndex * 100}ms` }}
            >
              <h3 className="font-semibold text-sm uppercase tracking-wider text-foreground/80">
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </h3>
              <ul className="space-y-3">
                {links.map((link, linkIndex) => (
                  <li 
                    key={link.to}
                    style={{ animationDelay: `${(categoryIndex * 100) + (linkIndex * 50)}ms` }}
                  >
                    <Link 
                      to={link.to} 
                      className="group/link relative inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
                    >
                      <span className="relative">
                        {link.label}
                        {/* Animated underline */}
                        <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gradient-to-r from-primary to-accent group-hover/link:w-full transition-all duration-300" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Watermark Section */}
        <div className="relative py-12">
          {/* Large watermark text */}
          <div className="text-center text-[8rem] md:text-[12rem] font-bold text-muted/[0.03] select-none leading-none whitespace-nowrap overflow-hidden">
            Karlo Shaadi
          </div>
          
          {/* Bottom bar */}
          <div className="absolute inset-x-0 bottom-0 flex flex-col md:flex-row items-center justify-between gap-4 py-4">
            <p className="text-xs text-muted-foreground">
              © {currentYear} Karlo Shaadi. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>GST: 09XXXXX1234X1Z5</span>
              <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
              <span>Made with ❤️ in India</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
