import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="glass border-t border-border/50 mt-20">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* About Column */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4">About</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">Our Story</Link></li>
              <li><Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">Careers</Link></li>
              <li><Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">Press</Link></li>
              <li><Link to="/support" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">Blog</Link></li>
              <li><Link to="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link to="/success-stories" className="text-sm text-muted-foreground hover:text-primary transition-colors">Success Stories</Link></li>
              <li><Link to="/testimonials" className="text-sm text-muted-foreground hover:text-primary transition-colors">Testimonials</Link></li>
            </ul>
          </div>

          {/* For Vendors Column */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4">For Vendors</h3>
            <ul className="space-y-2">
              <li><Link to="/vendor/onboarding" className="text-sm text-muted-foreground hover:text-primary transition-colors">Join Us</Link></li>
              <li><Link to="/pricing" className="text-sm text-muted-foreground hover:text-primary transition-colors">Pricing</Link></li>
              <li><Link to="/for-vendors" className="text-sm text-muted-foreground hover:text-primary transition-colors">Guidelines</Link></li>
              <li><Link to="/for-vendors" className="text-sm text-muted-foreground hover:text-primary transition-colors">Service Terms</Link></li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/legal" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/legal" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/legal" className="text-sm text-muted-foreground hover:text-primary transition-colors">Refund Policy</Link></li>
              <li><Link to="/legal" className="text-sm text-muted-foreground hover:text-primary transition-colors">KYC Policy</Link></li>
            </ul>
          </div>

          {/* Help Column */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4">Help & Support</h3>
            <ul className="space-y-2">
              <li><Link to="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link to="/data-export" className="text-sm text-muted-foreground hover:text-primary transition-colors">Export Your Data</Link></li>
              <li><Link to="/support" className="text-sm text-muted-foreground hover:text-primary transition-colors">Dispute Resolution</Link></li>
              <li><Link to="/support" className="text-sm text-muted-foreground hover:text-primary transition-colors">Safety Center</Link></li>
              <li><a href="https://wa.me/" className="text-sm text-muted-foreground hover:text-primary transition-colors">WhatsApp Support</a></li>
            </ul>
          </div>
        </div>

        {/* Cities & Categories */}
        <div className="border-t border-border/50 pt-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-sm mb-3">Popular Cities</h4>
              <div className="flex flex-wrap gap-2">
                {["Lucknow", "Delhi", "Mumbai", "Bangalore", "Hyderabad", "Pune", "Jaipur", "Chandigarh"].map((city) => (
                  <Link
                    key={city}
                    to={`/city/${city.toLowerCase()}`}
                    className="glass-subtle px-3 py-1 rounded-full text-xs hover:glass-intense transition-all"
                  >
                    {city}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Top Categories</h4>
              <div className="flex flex-wrap gap-2">
                {["Photography", "Venues", "Catering", "Decor", "Makeup", "Mehendi"].map((cat) => (
                  <Link
                    key={cat}
                    to={`/category/${cat.toLowerCase()}`}
                    className="glass-subtle px-3 py-1 rounded-full text-xs hover:glass-intense transition-all"
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Social & Copyright */}
        <div className="border-t border-border/50 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-4">
            <a href="#" className="glass-subtle p-2 rounded-full hover:glass-intense transition-all">
              <Instagram className="h-4 w-4" />
            </a>
            <a href="#" className="glass-subtle p-2 rounded-full hover:glass-intense transition-all">
              <Facebook className="h-4 w-4" />
            </a>
            <a href="#" className="glass-subtle p-2 rounded-full hover:glass-intense transition-all">
              <Twitter className="h-4 w-4" />
            </a>
            <a href="#" className="glass-subtle p-2 rounded-full hover:glass-intense transition-all">
              <Youtube className="h-4 w-4" />
            </a>
          </div>
          
          <div className="text-xs text-muted-foreground text-center md:text-right">
            <p>© {currentYear} Karlo Shaadi. All rights reserved.</p>
            <p className="mt-1">GST: 09XXXXX1234X1Z5 • Last updated: Jan 2025</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
