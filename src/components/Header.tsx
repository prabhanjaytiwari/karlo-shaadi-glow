import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Menu, Search, MessageCircle, User } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Header = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-gradient-to-r from-primary via-secondary to-primary text-primary-foreground py-2 text-center text-sm font-medium animate-fade-in">
        ✨ Verified Vendors • Milestone Payments • No Tension Weddings
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 glass border-b border-border/50 animate-fade-in transition-all duration-300">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-all duration-300">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-display font-bold text-lg">K</span>
              </div>
              <span className="font-display font-semibold text-lg hidden sm:inline">Karlo Shaadi</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/categories" className="text-sm font-medium hover:text-primary transition-all duration-300">
                Categories
              </Link>
              <Link to="/city/lucknow" className="text-sm font-medium hover:text-primary transition-all duration-300">
                Cities
              </Link>
              <Link to="/stories" className="text-sm font-medium hover:text-primary transition-all duration-300">
                Stories
              </Link>
              <Link to="/#how-it-works" className="text-sm font-medium hover:text-primary transition-all duration-300">
                How It Works
              </Link>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full hidden sm:flex transition-all duration-300 hover:scale-110"
                onClick={() => navigate("/search")}
              >
                <Search className="h-4 w-4" />
              </Button>
              <Button variant="quiet" size="sm" className="hidden sm:flex gap-2 transition-all duration-300">
                <MessageCircle className="h-4 w-4" />
                <span className="hidden lg:inline">WhatsApp</span>
              </Button>
              {user ? (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full hidden md:flex transition-all duration-300 hover:scale-110"
                  onClick={() => navigate("/dashboard")}
                >
                  <User className="h-4 w-4" />
                </Button>
              ) : (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full hidden md:flex transition-all duration-300 hover:scale-110"
                  onClick={() => navigate("/auth")}
                >
                  <User className="h-4 w-4" />
                </Button>
              )}
              <Button 
                variant="hero" 
                size="default" 
                className="hidden md:flex transition-all duration-300 hover:scale-105"
                onClick={() => navigate("/search")}
              >
                Search Vendors
              </Button>
              
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden transition-all duration-300"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden glass-intense border-t border-border/50 animate-fade-in duration-300">
            <div className="container mx-auto px-4 py-4 space-y-3">
              <Link
                to="/categories"
                className="block py-2 text-sm font-medium hover:text-primary transition-all duration-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                Categories
              </Link>
              <Link
                to="/city/lucknow"
                className="block py-2 text-sm font-medium hover:text-primary transition-all duration-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                Cities
              </Link>
              <Link
                to="/stories"
                className="block py-2 text-sm font-medium hover:text-primary transition-all duration-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                Stories
              </Link>
              <Button 
                variant="hero" 
                className="w-full mt-2 transition-all duration-300"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate("/search");
                }}
              >
                Search Vendors
              </Button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
