import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import logo from "@/assets/logo.png";
export const BhindiFooter = () => {
  const currentYear = new Date().getFullYear();
  return <footer className="bg-background">
      {/* CTA Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="bg-primary/10 backdrop-blur-sm rounded-3xl px-12 py-16 flex items-center justify-between">
          <h2 className="font-bold text-foreground max-w-2xl text-xl">
            Join Us in Creating Your Perfect Wedding
          </h2>
          <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground px-8">
            Get Started
          </Button>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-20">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <img 
                src={logo} 
                alt="Karlo Shaadi Logo" 
                className="h-12 w-auto"
              />
            </div>
            <p className="text-muted-foreground leading-relaxed mb-6 max-w-md">
              Karlo Shaadi is your wedding planning platform, connecting you with verified vendors to create seamless wedding experiences.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-lg bg-muted hover:bg-accent transition-colors flex items-center justify-center">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-muted hover:bg-accent transition-colors flex items-center justify-center">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-6">Company</h3>
            <ul className="space-y-4">
              <li><Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">About</Link></li>
              <li><Link to="/stories" className="text-muted-foreground hover:text-foreground transition-colors">Stories</Link></li>
              <li><Link to="/investors" className="text-muted-foreground hover:text-foreground transition-colors">Investors</Link></li>
              <li><Link to="/support" className="text-muted-foreground hover:text-foreground transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-6">Vendors</h3>
            <ul className="space-y-4">
              <li><Link to="/for-vendors" className="text-muted-foreground hover:text-foreground transition-colors">Register</Link></li>
              <li><Link to="/vendor/onboarding" className="text-muted-foreground hover:text-foreground transition-colors">Login</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-6">Opportunities</h3>
            <ul className="space-y-4">
              <li><Link to="/join-as-manager" className="text-muted-foreground hover:text-foreground transition-colors">Join as Manager</Link></li>
              <li><Link to="/affiliate" className="text-muted-foreground hover:text-foreground transition-colors">Affiliate Program</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-6">Legal</h3>
            <ul className="space-y-4">
              <li><Link to="/legal" className="text-muted-foreground hover:text-foreground transition-colors">Terms</Link></li>
              <li><Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">Privacy</Link></li>
              <li><Link to="/cancellation-refunds" className="text-muted-foreground hover:text-foreground transition-colors">Cancellation & Refunds</Link></li>
              <li><Link to="/shipping" className="text-muted-foreground hover:text-foreground transition-colors">Shipping</Link></li>
            </ul>
          </div>
        </div>

        {/* Watermark Section */}
        <div className="relative py-12">
          <div className="text-center text-[12rem] font-bold text-muted/5 select-none leading-none">
            Karlo Shaadi
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-sm text-muted-foreground">
              @karloshaadi.com - all rights reserved
            </p>
          </div>
        </div>
      </div>
    </footer>;
};