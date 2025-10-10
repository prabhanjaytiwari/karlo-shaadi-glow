import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Menu, Search, MessageCircle, User } from "lucide-react";
import { useState } from "react";

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-gradient-to-r from-primary via-secondary to-primary text-primary-foreground py-2 text-center text-sm font-medium animate-fade-in">
        ✨ Verified Vendors • Milestone Payments • No Tension Weddings
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 glass border-b border-border/50 animate-fade-in">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-display font-bold text-lg">K</span>
              </div>
              <span className="font-display font-semibold text-lg hidden sm:inline">Karlo Shaadi</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/categories" className="text-sm font-medium hover:text-primary transition-colors">
                Categories
              </Link>
              <Link to="/city/lucknow" className="text-sm font-medium hover:text-primary transition-colors">
                Cities
              </Link>
              <Link to="/stories" className="text-sm font-medium hover:text-primary transition-colors">
                Stories
              </Link>
              <Link to="/#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">
                How It Works
              </Link>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="rounded-full hidden sm:flex">
                <Search className="h-4 w-4" />
              </Button>
              <Button variant="quiet" size="sm" className="hidden sm:flex gap-2">
                <MessageCircle className="h-4 w-4" />
                <span className="hidden lg:inline">WhatsApp</span>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full hidden md:flex">
                <User className="h-4 w-4" />
              </Button>
              <Button variant="hero" size="default" className="hidden md:flex">
                Instant Match
              </Button>
              
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden glass-intense border-t border-border/50 animate-fade-in">
            <div className="container mx-auto px-4 py-4 space-y-3">
              <Link
                to="/categories"
                className="block py-2 text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Categories
              </Link>
              <Link
                to="/city/lucknow"
                className="block py-2 text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Cities
              </Link>
              <Link
                to="/stories"
                className="block py-2 text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Stories
              </Link>
              <Button variant="hero" className="w-full mt-2">
                Instant Match
              </Button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
