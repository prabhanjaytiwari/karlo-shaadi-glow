import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { NotificationCenter } from "./NotificationCenter";
import { RoleSwitcher, getActiveView } from "./RoleSwitcher";
import { useAuthContext } from "@/contexts/AuthContext";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import {
  Camera,
  Utensils,
  Music,
  Palette,
  MapPin,
  Cake,
  Sparkles,
  Heart,
  LogOut,
  Menu,
  Search,
  Phone,
  Calendar,
  MessageSquare,
  User,
  Wrench,
  Calculator,
  Image,
  FileText,
  BarChart3,
  Globe,
  CreditCard,
  Users,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "./ui/separator";
import { useCapacitor } from "@/hooks/useCapacitor";
import { motion, AnimatePresence } from "framer-motion";
import { cdn } from "@/lib/cdnAssets";

const categories = [
  {
    title: "Photography",
    href: "/category/photography",
    description: "Professional wedding photographers to capture your special moments",
    icon: Camera,
  },
  {
    title: "Catering",
    href: "/category/catering",
    description: "Delicious food and beverage services for your guests",
    icon: Utensils,
  },
  {
    title: "Music",
    href: "/category/music",
    description: "DJs, bands, and entertainment to keep the party alive",
    icon: Music,
  },
  {
    title: "Decoration",
    href: "/category/decoration",
    description: "Beautiful décor to transform your venue",
    icon: Palette,
  },
  {
    title: "Venues",
    href: "/category/venues",
    description: "Perfect locations for your wedding ceremony and reception",
    icon: MapPin,
  },
  {
    title: "Cakes",
    href: "/category/cakes",
    description: "Custom wedding cakes and sweet treats",
    icon: Cake,
  },
  {
    title: "Mehendi",
    href: "/category/mehendi",
    description: "Expert mehendi artists for bridal and guest designs",
    icon: Sparkles,
  },
  {
    title: "Planning",
    href: "/category/planning",
    description: "Full-service wedding planners to coordinate everything",
    icon: Heart,
  },
];

export const BhindiHeader = () => {
  const navigate = useNavigate();
  // Use AuthContext for instant, consistent auth state
  const { user, isAdmin, isVendor, signOut } = useAuthContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchQuery, setMobileSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [windowWidth, setWindowWidth] = useState<number>(() => typeof window !== "undefined" ? window.innerWidth : 1200);
  const { isNative } = useCapacitor();

  useEffect(() => {
    setWindowWidth(window.innerWidth);

    const handleResize = () => setWindowWidth(window.innerWidth);
    const handleScroll = () => setScrolled(window.scrollY > 20);

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const isDesktop = windowWidth >= 768;
  const isMobile = windowWidth < 768;

  const handleLogout = async () => {
    await signOut();
    navigate("/");
    setMobileMenuOpen(false);
  };

  const handleDashboardClick = () => {
    if (isAdmin) {
      navigate("/admin/dashboard");
    } else if (isVendor) {
      navigate("/vendor/dashboard");
    } else {
      navigate("/dashboard");
    }
  };

  const handleProfileClick = () => navigate("/profile");

  const handleMobileSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobileSearchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(mobileSearchQuery)}`);
      setMobileMenuOpen(false);
      setMobileSearchQuery("");
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 bg-background ${
        scrolled ? 'shadow-[var(--shadow-sm)]' : ''
      }`}
    >

      <div className="container mx-auto px-3 sm:px-4 md:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img
              src={cdn.logo}
              alt="Karlo Shaadi Logo"
              className="h-8 sm:h-10 md:h-11 w-auto transition-transform group-hover:scale-[1.02] duration-300"
              style={{ mixBlendMode: 'multiply' }}
            />
          </Link>

          {/* Desktop Navigation */}
          {isDesktop && (
            <nav className="flex items-center gap-3">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="text-sm font-medium">Categories</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[600px] gap-1 p-4 md:grid-cols-2">
                        {categories.map((category) => (
                          <ListItem
                            key={category.title}
                            title={category.title}
                            href={category.href}
                            icon={category.icon}
                          >
                            {category.description}
                          </ListItem>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="text-sm font-medium">Tools</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      {isVendor && getActiveView() === "vendor" ? (
                        <ul className="grid w-[500px] gap-1 p-4 md:grid-cols-2">
                          <ListItem title="CRM & Leads" href="/vendor/dashboard?tab=inquiries" icon={Users}>
                            Manage your leads and pipeline
                          </ListItem>
                          <ListItem title="Contracts" href="/vendor/dashboard?tab=tools" icon={FileText}>
                            Generate digital contracts
                          </ListItem>
                          <ListItem title="Invoices" href="/vendor/dashboard?tab=tools" icon={CreditCard}>
                            Create and track invoices
                          </ListItem>
                          <ListItem title="Analytics" href="/vendor/dashboard?tab=analytics" icon={BarChart3}>
                            Business intelligence dashboard
                          </ListItem>
                          <ListItem title="Mini-Site" href="/vendor/dashboard?tab=tools" icon={Globe}>
                            Your portfolio website
                          </ListItem>
                          <ListItem title="Revenue" href="/vendor/dashboard?tab=revenue" icon={Sparkles}>
                            Revenue charts and insights
                          </ListItem>
                        </ul>
                      ) : (
                        <ul className="grid w-[500px] gap-1 p-4 md:grid-cols-2">
                          <ListItem title="AI Wedding Plan" href="/plan-wizard" icon={Sparkles}>
                            Get a complete wedding plan in 2 minutes
                          </ListItem>
                          <ListItem title="Budget Calculator" href="/budget-calculator" icon={Calculator}>
                            Instant category-wise budget breakdown
                          </ListItem>
                          <ListItem title="Muhurat Finder" href="/muhurat-finder" icon={Calendar}>
                            2025-2026 auspicious wedding dates
                          </ListItem>
                          <ListItem title="Invite Creator" href="/invite-creator" icon={Image}>
                            AI-generated wedding invitations
                          </ListItem>
                          <ListItem title="Couple Quiz" href="/couple-quiz" icon={Heart}>
                            Wedding compatibility score
                          </ListItem>
                          <ListItem title="Vendor Checker" href="/vendor-check" icon={Search}>
                            Check if your vendor is legit
                          </ListItem>
                        </ul>
                      )}
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link to="/pricing" className={cn(navigationMenuTriggerStyle(), "transition-all duration-300")}>
                        Pricing
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link to="/deals" className={cn(navigationMenuTriggerStyle(), "transition-all duration-300 text-accent font-medium")}>
                        Deals
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>

                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link to="/shaadi-seva" className={cn(navigationMenuTriggerStyle(), "transition-all duration-300 text-primary font-medium")}>
                        <Heart className="h-4 w-4 mr-1 fill-primary" />
                        Shaadi Seva
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>

                  {!user && !isVendor && (
                    <NavigationMenuItem>
                      <NavigationMenuLink asChild>
                        <Link to="/for-vendors" className={cn(navigationMenuTriggerStyle(), "transition-all duration-300")}>
                          For Vendors
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  )}
                </NavigationMenuList>
              </NavigationMenu>

              <a href="tel:+917011460321" className="hidden xl:flex">
                <Button variant="outline" size="sm" className="gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Free Consultation</span>
                </Button>
              </a>

              <AnimatePresence mode="wait">
                {user ? (
                  <motion.div
                    key="logged-in"
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isVendor && !isAdmin && <RoleSwitcher isVendor={isVendor} />}
                    <NotificationCenter />
                    {isAdmin && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5 border-amber-500/30 text-amber-700 hover:bg-amber-50"
                        onClick={() => navigate("/admin/dashboard")}
                      >
                        <Shield className="h-3.5 w-3.5" />
                        Admin
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={handleDashboardClick}>
                      {isAdmin ? "Dashboard" : isVendor && getActiveView() === "vendor" ? "Vendor Dashboard" : "Dashboard"}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleProfileClick}>Profile</Button>
                    <Button variant="outline" size="sm" onClick={handleLogout} className="gap-1.5">
                      <LogOut className="h-3.5 w-3.5" />
                      Logout
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="logged-out"
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Button variant="outline" size="sm" onClick={() => navigate("/auth")}>Login</Button>
                    <Button size="sm" onClick={() => navigate("/auth")}>Sign Up Free</Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </nav>
          )}

          {/* Mobile Menu */}
          {isMobile && (
            <div className="flex items-center gap-1">
              {user && <NotificationCenter />}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9"
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setMobileMenuOpen(true);
                    }}
                  >
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[85vw] max-w-[320px] p-4 overflow-y-auto">
                  <SheetHeader className="pb-2">
                    <SheetTitle className="text-left text-sm">Menu</SheetTitle>
                  </SheetHeader>

                  <nav className="flex flex-col gap-3 mt-2">
                    {/* Search Bar */}
                    <form onSubmit={handleMobileSearch} className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Search vendors..."
                        value={mobileSearchQuery}
                        onChange={(e) => setMobileSearchQuery(e.target.value)}
                        className="pl-9 h-9 text-sm rounded-lg border-border/50 bg-muted/30"
                      />
                    </form>

                    {/* Quick Actions for Logged In Users */}
                    {user && (
                      <>
                        {/* Role indicator */}
                        <div className="flex items-center gap-2 px-1">
                          <div className={`w-2 h-2 rounded-full ${isAdmin ? 'bg-amber-500' : isVendor ? 'bg-blue-500' : 'bg-green-500'}`} />
                          <span className="text-xs text-muted-foreground font-medium">
                            {isAdmin ? 'Admin Account' : isVendor ? 'Vendor Account' : 'Couple Account'}
                          </span>
                        </div>
                        <div className="grid grid-cols-4 gap-1.5">
                          {[
                            { icon: Calendar, label: "Bookings", href: "/bookings" },
                            { icon: Heart, label: "Favorites", href: "/favorites" },
                            { icon: MessageSquare, label: "Messages", href: "/messages" },
                            { icon: User, label: "Profile", href: "/profile" },
                          ].map((item) => (
                            <button
                              key={item.href}
                              className="group flex flex-col items-center gap-1 p-2 rounded-lg bg-muted/30 hover:bg-primary/10 transition-all active:scale-95"
                              onClick={() => { navigate(item.href); setMobileMenuOpen(false); }}
                            >
                              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                <item.icon className="h-4 w-4 text-primary" />
                              </div>
                              <span className="text-[10px] font-medium">{item.label}</span>
                            </button>
                          ))}
                        </div>
                        <Separator className="bg-border/30" />
                      </>
                    )}

                    {/* Categories Grid */}
                    <div className="space-y-2">
                      <p className="font-semibold text-[10px] uppercase tracking-wider text-muted-foreground">Categories</p>
                      <div className="grid grid-cols-4 gap-1.5">
                        {categories.map((category) => (
                          <button
                            key={category.href}
                            className="group flex flex-col items-center gap-1 p-2 rounded-lg bg-muted/20 hover:bg-primary/10 transition-all active:scale-95"
                            onClick={() => { navigate(category.href); setMobileMenuOpen(false); }}
                          >
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                              <category.icon className="h-4 w-4 text-primary" />
                            </div>
                            <span className="text-[9px] font-medium text-center leading-tight">{category.title}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <Separator className="bg-border/30" />

                    {/* Tools */}
                    <div className="space-y-2">
                      <p className="font-semibold text-[10px] uppercase tracking-wider text-muted-foreground">Wedding Tools</p>
                      <div className="grid grid-cols-3 gap-1.5">
                        {[
                          { icon: Sparkles, label: "AI Plan", href: "/plan-wizard" },
                          { icon: Calculator, label: "Budget", href: "/budget-calculator" },
                          { icon: Calendar, label: "Muhurat", href: "/muhurat-finder" },
                          { icon: Image, label: "Invites", href: "/invite-creator" },
                          { icon: Heart, label: "Website", href: "/wedding-website" },
                          { icon: Music, label: "Music", href: "/music-generator" },
                        ].map((tool) => (
                          <button
                            key={tool.href}
                            className="group flex flex-col items-center gap-1 p-2 rounded-lg bg-accent/5 hover:bg-accent/15 transition-all active:scale-95"
                            onClick={() => { navigate(tool.href); setMobileMenuOpen(false); }}
                          >
                            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                              <tool.icon className="h-4 w-4 text-accent" />
                            </div>
                            <span className="text-[9px] font-medium text-center leading-tight">{tool.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <Separator className="bg-border/30" />

                    {/* Other Links */}
                    <div className="grid grid-cols-2 gap-1">
                      {[
                        { label: "Stories", href: "/stories" },
                        { label: "Deals", href: "/deals" },
                        ...(user ? [{ label: "Budget Tracker", href: "/budget" }] : []),
                        { label: "Help", href: "/help" },
                        ...(!user && !isVendor ? [{ label: "For Vendors", href: "/for-vendors" }] : []),
                        { label: "About", href: "/about" },
                        { label: "Why Karlo Shaadi", href: "/why-karlo-shaadi" },
                      ].map((link) => (
                        <button
                          key={link.href}
                          className="text-left px-3 py-2 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-all"
                          onClick={() => { navigate(link.href); setMobileMenuOpen(false); }}
                        >
                          {link.label}
                        </button>
                      ))}
                    </div>

                    <Separator className="bg-border/30" />

                    {/* Auth Buttons */}
                    <div className="space-y-2 pb-4">
                      {user ? (
                        <>
                          {isAdmin && (
                            <Button
                              variant="outline"
                              className="w-full h-9 text-sm rounded-lg border-amber-500/30 text-amber-700 hover:bg-amber-50"
                              onClick={() => { navigate("/admin/dashboard"); setMobileMenuOpen(false); }}
                            >
                              <Shield className="h-4 w-4 mr-2" />
                              Admin Dashboard
                            </Button>
                          )}
                          <Button
                            className="w-full h-9 text-sm rounded-lg bg-primary hover:bg-primary/90"
                            onClick={() => { handleDashboardClick(); setMobileMenuOpen(false); }}
                          >
                            {isVendor && !isAdmin ? "Vendor Dashboard" : "My Dashboard"}
                          </Button>
                          <Button
                            variant="ghost"
                            className="w-full h-9 text-sm text-muted-foreground rounded-lg"
                            onClick={handleLogout}
                          >
                            <LogOut className="h-4 w-4 mr-2" />
                            Logout
                          </Button>
                        </>
                      ) : (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            className="flex-1 h-9 text-sm rounded-lg"
                            onClick={() => { navigate("/auth"); setMobileMenuOpen(false); }}
                          >
                            Login
                          </Button>
                          <Button
                            className="flex-1 h-9 text-sm rounded-lg"
                            onClick={() => { navigate("/auth"); setMobileMenuOpen(false); }}
                          >
                            Sign Up
                          </Button>
                        </div>
                      )}
                    </div>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

const ListItem = ({
  className,
  title,
  children,
  icon: Icon,
  href,
}: {
  className?: string;
  title: string;
  children: React.ReactNode;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
}) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          to={href}
          className={cn(
            "group block select-none rounded-lg p-3 leading-none no-underline outline-none",
            "transition-colors duration-200 hover:bg-muted/50",
            className
          )}
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Icon className="h-4 w-4 text-primary" />
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium leading-none">{title}</div>
              <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">{children}</p>
            </div>
          </div>
        </Link>
      </NavigationMenuLink>
    </li>
  );
};
