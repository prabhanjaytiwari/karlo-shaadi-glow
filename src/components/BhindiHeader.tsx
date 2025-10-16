import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { NotificationCenter } from "./NotificationCenter";
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
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    // Check if mobile on mount and on resize
    const checkMobile = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl animate-fade-in transition-all duration-300">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center transition-transform group-hover:scale-110 duration-300">
              <span className="text-primary-foreground font-bold text-xl">K</span>
            </div>
            <span className="font-semibold text-lg tracking-tight group-hover:text-accent transition-colors duration-300">
              Karlo Shaadi
            </span>
          </Link>

          {/* Navigation Menu - Desktop Only - Only render on desktop */}
          {!isMobileView && (
            <nav className="flex items-center gap-4">
              <NavigationMenu>
                <NavigationMenuList>
                {/* Categories Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-sm transition-all duration-300">Categories</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[600px] gap-3 p-6 md:grid-cols-2 animate-fade-in">
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

                {/* Regular Links */}
                <NavigationMenuItem>
                  <Link to="/stories">
                    <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "transition-all duration-300")}>
                      Stories
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

          {/* Mobile Menu Button - Only render on mobile */}
          {isMobileView && (
            <div className="flex items-center">
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="relative z-50"
                  type="button"
                >
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              
              <nav className="flex flex-col gap-4 mt-6">
                {/* Search Bar */}
                <form onSubmit={handleMobileSearch} className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search vendors..."
                    value={mobileSearchQuery}
                    onChange={(e) => setMobileSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </form>

                {/* Quick Actions for Logged In Users */}
                {user && (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        className="justify-start"
                        onClick={() => {
                          navigate("/bookings");
                          setMobileMenuOpen(false);
                        }}
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        Bookings
                      </Button>
                      <Button
                        variant="outline"
                        className="justify-start"
                        onClick={() => {
                          navigate("/favorites");
                          setMobileMenuOpen(false);
                        }}
                      >
                        <Heart className="h-4 w-4 mr-2" />
                        Favorites
                      </Button>
                      <Button
                        variant="outline"
                        className="justify-start"
                        onClick={() => {
                          navigate("/messages");
                          setMobileMenuOpen(false);
                        }}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Messages
                      </Button>
                      <Button
                        variant="outline"
                        className="justify-start"
                        onClick={() => {
                          navigate("/profile");
                          setMobileMenuOpen(false);
                        }}
                      >
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </Button>
                    </div>
                    <Separator />
                  </>
                )}

                {/* Categories */}
                <div className="space-y-2">
                  <p className="font-semibold text-sm text-muted-foreground px-2">Categories</p>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((category) => (
                      <Button
                        key={category.href}
                        variant="ghost"
                        className="justify-start h-auto py-3"
                        onClick={() => {
                          navigate(category.href);
                          setMobileMenuOpen(false);
                        }}
                      >
                        <div className="flex flex-col items-center gap-1 w-full">
                          <category.icon className="h-5 w-5 text-primary" />
                          <span className="text-xs">{category.title}</span>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Other Links */}
                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      navigate("/stories");
                      setMobileMenuOpen(false);
                    }}
                  >
                    Stories
                  </Button>
                  {!user && (
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => {
                        navigate("/for-vendors");
                        setMobileMenuOpen(false);
                      }}
                    >
                      For Vendors
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      navigate("/about");
                      setMobileMenuOpen(false);
                    }}
                  >
                    About Us
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      navigate("/support");
                      setMobileMenuOpen(false);
                    }}
                  >
                    Support
                  </Button>
                </div>

                <Separator />

                {/* Auth Buttons */}
                <div className="space-y-2">
                  {user ? (
                    <>
                      <Button 
                        variant="default" 
                        className="w-full" 
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
                          className="w-full" 
                          onClick={() => { 
                            navigate("/admin/dashboard"); 
                            setMobileMenuOpen(false); 
                          }}
                        >
                          Admin Dashboard
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        className="w-full" 
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
                    <>
                      <Button 
                        variant="outline" 
                        className="w-full" 
                        onClick={() => { 
                          navigate("/auth"); 
                          setMobileMenuOpen(false); 
                        }}
                      >
                        Login
                      </Button>
                      <Button 
                        className="w-full" 
                        onClick={() => { 
                          navigate("/auth"); 
                          setMobileMenuOpen(false); 
                        }}
                      >
                        Sign Up
                      </Button>
                    </>
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
            "block select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-all duration-300 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground group hover:scale-105",
            className
          )}
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-all duration-300">
              <Icon className="h-4 w-4 text-accent" />
            </div>
            <div className="text-sm font-medium leading-none">{title}</div>
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground pl-10">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
};
