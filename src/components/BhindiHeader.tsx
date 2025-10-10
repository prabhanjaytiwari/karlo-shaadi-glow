import { Link } from "react-router-dom";
import { Button } from "./ui/button";

export const BhindiHeader = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">K</span>
            </div>
            <span className="font-semibold text-lg tracking-tight group-hover:text-accent transition-colors">
              Karlo Shaadi
            </span>
          </Link>

          {/* Nav - Right Side */}
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              to="/categories" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Categories
            </Link>
            <Link 
              to="/stories" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Stories
            </Link>
            <Link 
              to="/vendor-onboarding" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              For Vendors
            </Link>
            
            <Button 
              variant="default"
              className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-6"
            >
              Get Started
            </Button>
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
