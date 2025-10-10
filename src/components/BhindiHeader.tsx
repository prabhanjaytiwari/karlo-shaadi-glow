import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";
import { Camera, Utensils, Music, Palette, MapPin, Cake, Sparkles, Heart, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

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
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
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

          {/* Navigation Menu */}
          <nav className="hidden md:flex items-center gap-4">
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

                <NavigationMenuItem>
                  <Link to="/vendor/onboarding">
                    <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "transition-all duration-300")}>
                      For Vendors
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {user ? (
              <>
                <Button 
                  variant="default"
                  onClick={() => navigate("/dashboard")}
                  className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-6 ml-2 transition-all duration-300"
                >
                  Dashboard
                </Button>
                <Button 
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="transition-all duration-300 hover:text-red-500"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Button 
                variant="default"
                onClick={() => navigate("/auth")}
                className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-6 ml-2 transition-all duration-300 hover:scale-105"
              >
                Get Started
              </Button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </Button>
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
