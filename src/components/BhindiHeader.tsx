import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { NotificationCenter } from "./NotificationCenter";
import logo from "@/assets/logo.png";
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
  X, 
  Search,
  Calendar,
  MessageSquare,
  User
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "./ui/separator";

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
  const [user, setUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mobileSearchQuery, setMobileSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  // Initialize with undefined to prevent hydration mismatch
  const [windowWidth, setWindowWidth] = useState<number | undefined>(undefined);

  useEffect(() => {
    // Set initial width
    setWindowWidth(window.innerWidth);
    
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const isDesktop = windowWidth !== undefined && windowWidth >= 768;
  const isMobile = windowWidth !== undefined && windowWidth < 768;

  useEffect(() => {
    checkAuth();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    
    if (user) {
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);
      
      setIsAdmin(roles?.some(r => r.role === "admin") || false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-background/90 backdrop-blur-xl border-b border-white/10 shadow-sm' 
          : 'bg-transparent backdrop-blur-sm border-b border-transparent'
      }`}
    >
      {/* Premium Gradient Line on Scroll */}
      <div 
        className={`absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent transition-opacity duration-300 ${
          scrolled ? 'opacity-100' : 'opacity-0'
        }`} 
      />
      
      <div className="container mx-auto px-3 sm:px-4 md:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16 md:h-18">
          {/* Logo - Compact on mobile */}
          <Link to="/" className="flex items-center gap-2 group relative">
            <div className="absolute -inset-2 bg-accent/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl hidden sm:block" />
            <img 
              src={logo} 
              alt="Karlo Shaadi Logo" 
              className="relative h-8 sm:h-10 md:h-11 w-auto transition-all group-hover:scale-105 duration-300"
            />
          </Link>

          {/* Desktop Navigation - Absolutely prevent rendering on mobile */}
          {isDesktop && (
            <nav className="flex items-center gap-4" style={{ display: isDesktop ? 'flex' : 'none' }}>
              <NavigationMenu>
                <NavigationMenuList>
                {/* Categories Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-sm font-medium">Categories</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="relative">
                      {/* Premium header gradient */}
                      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
                      <ul className="grid w-[650px] gap-2 p-6 md:grid-cols-2">
                        {categories.map((category, index) => (
                          <ListItem
                            key={category.title}
                            title={category.title}
                            href={category.href}
                            icon={category.icon}
                            index={index}
                          >
                            {category.description}
                          </ListItem>
                        ))}
                      </ul>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Regular Links */}
                <NavigationMenuItem>
                  <Link to="/stories">
                    <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "transition-all duration-300")}>
                      Stories
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link to="/blog">
                    <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "transition-all duration-300")}>
                      Blog
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link to="/pricing">
                    <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "transition-all duration-300")}>
                      Pricing
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                {!user && (
                  <NavigationMenuItem>
                    <Link to="/for-vendors">
                      <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "transition-all duration-300")}>
                        For Vendors
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                )}
              </NavigationMenuList>
            </NavigationMenu>

            {user ? (
              <>
                <NotificationCenter />
                <Button variant="ghost" onClick={() => navigate("/dashboard")}>Dashboard</Button>
                {isAdmin && (
                  <Button variant="ghost" onClick={() => navigate("/admin/dashboard")}>
                    Admin
                  </Button>
                )}
                <Button variant="ghost" onClick={() => navigate("/profile")}>Profile</Button>
                <Button variant="outline" onClick={handleLogout}>Logout</Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => navigate("/auth")}>Login</Button>
                <Button onClick={() => navigate("/auth")}>Sign Up</Button>
              </>
            )}
            </nav>
          )}

          {/* Mobile Menu - Compact */}
          {isMobile && (
            <div className="flex items-center gap-1" style={{ display: isMobile ? 'flex' : 'none' }}>
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
            <SheetContent side="right" className="w-[85vw] max-w-[320px] p-4">
              <SheetHeader className="pb-2">
                <SheetTitle className="text-left text-sm">Menu</SheetTitle>
              </SheetHeader>
              
              <nav className="flex flex-col gap-3 mt-2">
                {/* Compact Search Bar */}
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

                {/* Compact Quick Actions for Logged In Users */}
                {user && (
                  <>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[
                        { icon: Calendar, label: "Bookings", href: "/bookings" },
                        { icon: Heart, label: "Favorites", href: "/favorites" },
                        { icon: MessageSquare, label: "Messages", href: "/messages" },
                        { icon: User, label: "Profile", href: "/profile" },
                      ].map((item) => (
                        <button
                          key={item.href}
                          className="group flex flex-col items-center gap-1 p-2 rounded-lg bg-muted/30 hover:bg-accent/10 transition-all active:scale-95"
                          onClick={() => {
                            navigate(item.href);
                            setMobileMenuOpen(false);
                          }}
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

                {/* Compact Categories Grid */}
                <div className="space-y-2">
                  <p className="font-semibold text-[10px] uppercase tracking-wider text-muted-foreground">Categories</p>
                  <div className="grid grid-cols-4 gap-1.5">
                    {categories.map((category) => (
                      <button
                        key={category.href}
                        className="group flex flex-col items-center gap-1 p-2 rounded-lg bg-muted/20 hover:bg-accent/10 transition-all active:scale-95"
                        onClick={() => {
                          navigate(category.href);
                          setMobileMenuOpen(false);
                        }}
                      >
                        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                          <category.icon className="h-4 w-4 text-accent" />
                        </div>
                        <span className="text-[9px] font-medium text-center leading-tight">{category.title}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <Separator className="bg-border/30" />

                {/* Compact Other Links */}
                <div className="grid grid-cols-2 gap-1">
                  {[
                    { label: "Stories", href: "/stories" },
                    { label: "Help", href: "/help" },
                    ...(!user ? [{ label: "For Vendors", href: "/for-vendors" }] : []),
                    { label: "About", href: "/about" },
                  ].map((link) => (
                    <button
                      key={link.href}
                      className="text-left px-3 py-2 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-all"
                      onClick={() => {
                        navigate(link.href);
                        setMobileMenuOpen(false);
                      }}
                    >
                      {link.label}
                    </button>
                  ))}
                </div>

                <Separator className="bg-border/30" />

                {/* Compact Auth Buttons */}
                <div className="space-y-2 pb-4">
                  {user ? (
                    <>
                      <Button 
                        variant="premium" 
                        className="w-full h-9 text-sm rounded-lg" 
                        onClick={() => { 
                          navigate("/dashboard"); 
                          setMobileMenuOpen(false); 
                        }}
                      >
                        Dashboard
                      </Button>
                      {isAdmin && (
                        <Button 
                          variant="default" 
                          className="w-full h-9 text-sm rounded-lg" 
                          onClick={() => { 
                            navigate("/admin/dashboard"); 
                            setMobileMenuOpen(false); 
                          }}
                        >
                          Admin Panel
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        className="w-full h-9 text-sm text-muted-foreground rounded-lg" 
                        onClick={() => { 
                          handleLogout(); 
                          setMobileMenuOpen(false); 
                        }}
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
                        onClick={() => { 
                          navigate("/auth"); 
                          setMobileMenuOpen(false); 
                        }}
                      >
                        Login
                      </Button>
                      <Button 
                        className="flex-1 h-9 text-sm rounded-lg" 
                        onClick={() => { 
                          navigate("/auth"); 
                          setMobileMenuOpen(false); 
                        }}
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
  index = 0,
}: {
  className?: string;
  title: string;
  children: React.ReactNode;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  index?: number;
}) => {
  return (
    <li 
      className="animate-fade-in"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <NavigationMenuLink asChild>
        <Link
          to={href}
          className={cn(
            "group relative block select-none rounded-xl p-4 leading-none no-underline outline-none",
            "transition-all duration-300 ease-out",
            "hover:bg-accent/10 focus:bg-accent/10",
            "hover:scale-[1.02] active:scale-[0.98]",
            "border border-transparent hover:border-accent/20",
            className
          )}
        >
          {/* Hover glow effect */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="relative flex items-start gap-3">
            {/* Icon container with premium styling */}
            <div className={cn(
              "flex-shrink-0 w-10 h-10 rounded-xl",
              "bg-gradient-to-br from-accent/20 to-accent/5",
              "flex items-center justify-center",
              "group-hover:from-accent/30 group-hover:to-accent/10",
              "group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-accent/20",
              "transition-all duration-300"
            )}>
              <Icon className="h-5 w-5 text-accent" />
            </div>
            
            <div className="space-y-1">
              <div className="text-sm font-semibold leading-none group-hover:text-accent transition-colors duration-300">
                {title}
              </div>
              <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                {children}
              </p>
            </div>
          </div>
        </Link>
      </NavigationMenuLink>
    </li>
  );
};
