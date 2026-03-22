import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { useState, useRef, useEffect, ReactNode } from 'react';
import {
  Heart, Star, Shield, MapPin, Users, Calculator, CalendarHeart,
  Sparkles, ArrowRight, ChevronRight, Music, Mic, FlameKindling,
  BadgeCheck, Bell, Utensils, Camera, Palette, Gem, PartyPopper, HandHeart,
  Menu, Search, X, Tag, IndianRupee, LayoutGrid, Headphones, Award,
  Zap, Gift, TrendingUp, Building2
} from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';

// Category images
import categoryVenue from '@/assets/category-venue.jpg';
import categoryPhotography from '@/assets/category-photography.jpg';
import categoryDecoration from '@/assets/category-decoration.jpg';
import categoryMakeup from '@/assets/category-makeup.jpg';
import categoryCatering from '@/assets/category-catering.jpg';
import categoryMehendi from '@/assets/category-mehendi.jpg';
import categoryMusic from '@/assets/category-music.jpg';
import categoryJewelry from '@/assets/category-jewelry.jpg';
import categoryEntertainment from '@/assets/category-entertainment.jpg';

// Section images
import heroImage from '@/assets/hero-wedding-phere.jpeg';
import coupleImage from '@/assets/section-couples.jpg';
import vendorImage1 from '@/assets/wedding-couple-1.jpg';
import vendorImage2 from '@/assets/wedding-ceremony.jpg';
import vendorImage3 from '@/assets/wedding-decoration.jpg';
import vendorImage4 from '@/assets/wedding-haldi.jpg';
import fireworksImage from '@/assets/wedding-fireworks.jpg';
import logoImage from '@/assets/logo-new.png';

// Tool images
import toolBudgetCalc from '@/assets/tool-budget-calculator.jpg';
import toolMuhurat from '@/assets/tool-muhurat-finder.jpg';
import toolInvite from '@/assets/tool-invite-creator.jpg';
import toolPlanner from '@/assets/tool-wedding-planner.jpg';
import toolCoupleQuiz from '@/assets/tool-couple-quiz.jpg';

import toolSpeechWriter from '@/assets/tool-speech-writer.jpg';
import toolMusicGen from '@/assets/tool-music-generator.jpg';
import toolVendorScore from '@/assets/tool-vendor-score.jpg';

// Menu images
import menuCategoriesImg from '@/assets/menu-categories.jpg';
import menuDealsImg from '@/assets/menu-deals.jpg';
import menuSevaImg from '@/assets/menu-seva.jpg';

// ─── DATA ─────────────────────────────────────────────

const vendorCategories = [
  { image: categoryVenue, label: 'Venue', category: 'venues' },
  { image: categoryPhotography, label: 'Photography', category: 'photography' },
  { image: categoryDecoration, label: 'Decoration', category: 'decoration' },
  { image: categoryMakeup, label: 'Makeup', category: 'makeup' },
  { image: categoryCatering, label: 'Catering', category: 'catering' },
  { image: categoryMehendi, label: 'Mehendi', category: 'mehendi' },
  { image: categoryMusic, label: 'Music', category: 'music' },
  { image: categoryJewelry, label: 'Jewelry', category: 'jewelry' },
  { image: categoryEntertainment, label: 'Entertainment', category: 'entertainment' },
];

const planningTools = [
  { title: 'Budget Calculator', desc: 'Plan your budget smartly', icon: Calculator, route: '/budget-calculator', image: toolBudgetCalc },
  { title: 'Muhurat Finder', desc: 'Find auspicious dates', icon: CalendarHeart, route: '/muhurat-finder', image: toolMuhurat },
  { title: 'Invite Creator', desc: 'Design digital invites', icon: Heart, route: '/invite-creator', image: toolInvite },
  { title: 'Wedding Planner', desc: 'Smart wedding planning', icon: Sparkles, route: '/plan-wizard', image: toolPlanner },
];

const funTools = [
  { title: 'Couple Quiz', tagline: 'How well do you know each other?', route: '/couple-quiz', icon: Heart, image: toolCoupleQuiz },
  
  { title: 'Speech Writer', tagline: 'Craft perfect speeches', route: '/speech-writer', icon: Mic, image: toolSpeechWriter },
  { title: 'Music Generator', tagline: 'Create your anthem', route: '/music-generator', icon: Music, image: toolMusicGen },
  { title: 'Vendor Score', tagline: 'Check trust scores', route: '/vendor-check', icon: BadgeCheck, image: toolVendorScore },
];

const howItWorksSteps = [
  { num: '1', title: 'Share Vision', desc: 'Date, city & budget' },
  { num: '2', title: 'Get Matched', desc: 'Verified vendors' },
  { num: '3', title: 'Celebrate', desc: 'Book & enjoy' },
];

const reviewQuotes = [
  { name: 'Priya & Rahul', city: 'Mumbai', quote: 'Karlo Shaadi made our dream wedding a reality. The vendor matching was spot on!', rating: 5 },
  { name: 'Sneha & Amit', city: 'Delhi', quote: 'From venue to catering, every vendor was top-notch. Truly premium service.', rating: 5 },
  { name: 'Ananya & Vikram', city: 'Bangalore', quote: 'The budget calculator saved us lakhs. Best wedding planning platform!', rating: 5 },
];

const menuQuickLinks = [
  { label: 'Pricing', icon: IndianRupee, route: '/pricing' },
  { label: 'Budget Calculator', icon: Calculator, route: '/budget-calculator' },
  { label: 'Muhurat Finder', icon: CalendarHeart, route: '/muhurat-finder' },
  { label: 'Couple Quiz', icon: Heart, route: '/couple-quiz' },
  { label: 'Music Generator', icon: Headphones, route: '/music-generator' },
];

const menuFeatureCards = [
  { label: 'Browse Categories', subtitle: '50+ vendor types', image: menuCategoriesImg, route: '/categories' },
  { label: 'Deals & Offers', subtitle: 'Exclusive savings', image: menuDealsImg, route: '/deals' },
  { label: 'Shaadi Seva', subtitle: 'Give back with love', image: menuSevaImg, route: '/shaadi-seva' },
];

// ─── HOOKS ────────────────────────────────────────────

function useVendors() {
  return useQuery({
    queryKey: ['mobile-top-vendors'],
    queryFn: async () => {
      const { data } = await supabase
        .from('vendors')
        .select('id, business_name, category, average_rating, total_reviews, logo_url, cities (name), vendor_portfolio (image_url, display_order)')
        .eq('is_active', true)
        .eq('verified', true)
        .order('average_rating', { ascending: false })
        .limit(8);
      return data || [];
    },
  });
}

function useWeddingCountdown() {
  const { user } = useAuthContext();
  return useQuery({
    queryKey: ['wedding-countdown', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase
        .from('profiles')
        .select('wedding_date, partner_name')
        .eq('id', user.id)
        .single();
      if (!data?.wedding_date) return null;
      const diff = new Date(data.wedding_date).getTime() - Date.now();
      if (diff <= 0) return null;
      return { days: Math.ceil(diff / (1000 * 60 * 60 * 24)), partnerName: data.partner_name };
    },
    enabled: !!user,
  });
}

// Lazy section wrapper — renders children only when near viewport
function LazySection({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { rootMargin: '200px' }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {visible ? children : <div className="h-32" />}
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────

export function MobileHomeScreen() {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { data: vendors = [] } = useVendors();
  const { data: countdown } = useWeddingCountdown();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const placeholderVendors = [
    { id: 'p1', business_name: 'Royal Palace Venue', category: 'venues', city: 'Mumbai', average_rating: 4.9, total_reviews: 128, image: vendorImage1 },
    { id: 'p2', business_name: 'Candid Captures', category: 'photography', city: 'Delhi', average_rating: 4.8, total_reviews: 95, image: vendorImage2 },
    { id: 'p3', business_name: 'Dream Decor Studio', category: 'decoration', city: 'Jaipur', average_rating: 4.7, total_reviews: 67, image: vendorImage3 },
    { id: 'p4', business_name: 'Haldi Moments', category: 'photography', city: 'Bangalore', average_rating: 4.9, total_reviews: 112, image: vendorImage4 },
  ];

  const displayVendors = vendors.length > 0 ? vendors : placeholderVendors;

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">

      {/* ── STICKY HEADER with Menu ── */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border/50">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMenuOpen(true)}
              className="p-2 -ml-2 rounded-full hover:bg-muted/50 active:scale-95 transition-all"
            >
              <Menu className="h-5 w-5 text-foreground" />
            </button>
            <img src={logoImage} alt="Karlo Shaadi" className="h-7 object-contain" />
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => navigate('/search')}
              className="p-2 rounded-full hover:bg-muted/50 active:scale-95 transition-all"
            >
              <Search className="h-5 w-5 text-foreground" />
            </button>
            {user && (
              <button
                onClick={() => navigate('/notifications')}
                className="relative p-2 rounded-full hover:bg-muted/50 active:scale-95 transition-all"
              >
                <Bell className="h-5 w-5 text-foreground" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ── SLIDE-OUT MENU ── */}
      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="left" className="w-[85%] sm:w-[380px] p-0 overflow-y-auto">
          <SheetHeader className="sr-only">
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>

          {/* Menu Header with gradient */}
          <div className="relative px-5 pt-6 pb-4 bg-gradient-to-br from-primary/10 via-background to-accent/10">
            <img src={logoImage} alt="Karlo Shaadi" className="h-8 object-contain" />
            <p className="text-[10px] text-muted-foreground mt-1 tracking-wide">India's Most Trending Wedding Platform</p>
          </div>

          <div className="px-4 pb-8 space-y-5">

            {/* Auth section - at top */}
            {user ? (
              <div className="space-y-1">
                <button onClick={() => { navigate('/dashboard'); setMenuOpen(false); }} className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-muted/30 active:scale-[0.98] transition-all">
                  <Users className="h-4 w-4 text-primary" />
                  Dashboard
                </button>
                <button onClick={() => { navigate('/profile'); setMenuOpen(false); }} className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-muted/30 active:scale-[0.98] transition-all">
                  <Star className="h-4 w-4 text-primary" />
                  Profile
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                <button
                  onClick={() => { navigate('/auth'); setMenuOpen(false); }}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-primary/85 text-primary-foreground text-sm font-semibold shadow-md active:scale-[0.97] transition-transform"
                >
                  Login / Sign Up
                </button>
                <button
                  onClick={() => { navigate('/vendor/onboarding'); setMenuOpen(false); }}
                  className="w-full py-3 rounded-xl border border-border/50 text-sm font-medium text-foreground active:scale-[0.97] transition-transform"
                >
                  Register as Vendor
                </button>
              </div>
            )}

            <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

            {/* Featured Image Cards */}
            <div className="space-y-2.5">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest px-1">Explore</p>
              <div className="space-y-2">
                {menuFeatureCards.map((card) => (
                  <button
                    key={card.route}
                    onClick={() => { navigate(card.route); setMenuOpen(false); }}
                    className="relative w-full h-20 rounded-xl overflow-hidden active:scale-[0.97] transition-transform group"
                  >
                    <img src={card.image} alt={card.label} className="w-full h-full object-cover group-active:scale-105 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
                    <div className="absolute inset-0 flex flex-col justify-center px-4">
                      <p className="text-white text-sm font-semibold">{card.label}</p>
                      <p className="text-white/70 text-[10px]">{card.subtitle}</p>
                    </div>
                    <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-1.5">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest px-1">Quick Access</p>
              <nav className="grid grid-cols-2 gap-1.5">
                {menuQuickLinks.map((link) => (
                  <button
                    key={link.route}
                    onClick={() => { navigate(link.route); setMenuOpen(false); }}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium text-foreground bg-muted/20 border border-border/20 hover:bg-muted/40 active:scale-[0.97] transition-all"
                  >
                    <link.icon className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                    {link.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* ── CONTENT ── */}
      <div className="space-y-5 pb-24">

        {/* ── HERO BANNER (full-bleed) ── */}
        <section className="mx-3 mt-3">
          <div className="relative rounded-2xl overflow-hidden shadow-[var(--shadow-md)]">
            <img src={heroImage} alt="Wedding celebration" className="w-full h-56 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <span className="inline-block text-amber-300 text-[9px] font-bold tracking-[0.25em] uppercase mb-2 bg-black/30 px-2 py-0.5 rounded-full">
                India's Most Trending Platform
              </span>
              <h1 className="text-white text-2xl font-display font-bold leading-[1.15] mb-0.5">
                Aap Shaadi Karo,
              </h1>
              <p className="text-white/90 text-lg font-display font-medium leading-tight mb-4">
                Tension Hum Sambhal Lenge
              </p>
              <button
                onClick={() => navigate('/plan-wizard')}
                className="bg-primary text-primary-foreground text-sm font-semibold px-6 py-2.5 rounded-full shadow-lg active:scale-95 transition-transform"
              >
                Start Planning Free <ArrowRight className="inline h-3.5 w-3.5 ml-1" />
              </button>
            </div>
          </div>
        </section>

        {/* ── Wedding Countdown ── */}
        {countdown && (
          <section className="px-4">
            <div className="bg-gradient-to-r from-accent/10 via-accent/5 to-primary/10 rounded-xl px-4 py-3 border border-accent/20 flex items-center gap-3">
              <CalendarHeart className="h-5 w-5 text-accent flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-foreground">{countdown.days} days to your wedding! 🎉</p>
                {countdown.partnerName && <p className="text-xs text-muted-foreground">With {countdown.partnerName}</p>}
              </div>
            </div>
          </section>
        )}

        {/* ── TRUST STATS (attached, no gap) ── */}
        <section className="px-4">
          <div className="grid grid-cols-4 gap-2">
            {[
              { icon: Users, value: '500+', label: 'Couples', color: 'text-primary' },
              { icon: Award, value: 'Verified', label: 'Vendors', color: 'text-accent' },
              { icon: Shield, value: '100%', label: 'Secure', color: 'text-emerald-600' },
              { icon: MapPin, value: '20+', label: 'Cities', color: 'text-blue-600' },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center py-3 rounded-xl bg-card shadow-[var(--shadow-xs)]">
                <stat.icon className={`h-5 w-5 ${stat.color} mb-1`} />
                <span className="text-sm font-bold text-foreground">{stat.value}</span>
                <span className="text-[10px] text-muted-foreground font-medium">{stat.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── VENDOR CATEGORIES (tight, 5+ visible) ── */}
        <section className="px-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-foreground">Browse by Category</h2>
            <button onClick={() => navigate('/categories')} className="flex items-center gap-0.5 text-primary text-xs font-medium active:scale-95 transition-transform">
              See All <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
            <div className="flex gap-3 pb-1" style={{ width: 'max-content' }}>
              {vendorCategories.map((cat) => (
                <button
                  key={cat.category}
                  onClick={() => navigate(`/search?category=${cat.category}`)}
                  className="flex flex-col items-center gap-1.5 active:scale-95 transition-transform"
                  style={{ minWidth: '64px' }}
                >
                  <div className="w-14 h-14 rounded-full overflow-hidden shadow-sm">
                    <img src={cat.image} alt={cat.label} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[10px] font-medium text-foreground text-center leading-tight">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <LazySection>
        {/* ── TOP RATED VENDORS (single section, wider cards) ── */}
        <section className="px-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-foreground">Top Rated Vendors</h2>
            <button onClick={() => navigate('/search')} className="flex items-center gap-0.5 text-primary text-xs font-medium active:scale-95 transition-transform">
              See All <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
            <div className="flex gap-3 pb-1" style={{ width: 'max-content' }}>
              {displayVendors.map((vendor: any) => {
                const portfolioImg = vendor.vendor_portfolio?.sort((a: any, b: any) => (a.display_order || 0) - (b.display_order || 0))?.[0]?.image_url;
                const image = vendor.image || vendor.logo_url || portfolioImg || vendorImage1;
                return (
                  <button
                    key={vendor.id}
                    onClick={() => vendor.id?.startsWith?.('p') ? navigate('/search') : navigate(`/vendors/${vendor.id}`)}
                    className="flex-shrink-0 w-44 rounded-xl overflow-hidden bg-card shadow-[var(--shadow-xs)] active:scale-[0.97] transition-transform text-left"
                  >
                    <div className="w-full h-28 overflow-hidden">
                      <img src={image} alt={vendor.business_name} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-2.5">
                      <p className="text-xs font-semibold text-foreground truncate">{vendor.business_name}</p>
                      <p className="text-[10px] text-muted-foreground capitalize">{vendor.category} · {vendor.cities?.name || vendor.city || 'India'}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                        <span className="text-[10px] font-semibold text-foreground">{vendor.average_rating || '4.8'}</span>
                        <span className="text-[10px] text-muted-foreground">({vendor.total_reviews || 0})</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
        </LazySection>

        <LazySection>
        {/* Divider */}
        <div className="mx-4 h-px bg-border" />

        {/* ── FREE PLANNING TOOLS (compact 2x2) ── */}
        <section className="px-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-foreground">Free Planning Tools</h2>
            <button onClick={() => navigate('/budget-calculator')} className="flex items-center gap-0.5 text-primary text-xs font-medium active:scale-95 transition-transform">
              See All <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {planningTools.map((tool) => (
              <button
                key={tool.route}
                onClick={() => navigate(tool.route)}
                className="flex flex-col rounded-xl overflow-hidden bg-card active:scale-[0.97] transition-transform text-left shadow-[var(--shadow-xs)]"
              >
                <div className="w-full h-20 overflow-hidden">
                  <img src={tool.image} alt={tool.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-2.5">
                  <p className="text-xs font-semibold text-foreground leading-tight">{tool.title}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug">{tool.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* ── FUN WEDDING TOOLS (horizontal scroll, gradient cards) ── */}
        <section className="px-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-foreground">Fun Wedding Tools</h2>
          </div>
          <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
            <div className="flex gap-2.5 pb-1" style={{ width: 'max-content' }}>
              {funTools.map((tool) => (
                <button
                  key={tool.route}
                  onClick={() => navigate(tool.route)}
                  className="flex-shrink-0 w-36 rounded-xl overflow-hidden active:scale-[0.97] transition-transform text-left shadow-[var(--shadow-xs)]"
                >
                  <div className="w-full h-20 overflow-hidden">
                    <img src={tool.image} alt={tool.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-2.5 bg-card">
                    <p className="text-[11px] font-semibold text-foreground leading-tight">{tool.title}</p>
                    <p className="text-[9px] text-muted-foreground mt-0.5 leading-snug">{tool.tagline}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
        </LazySection>

        <LazySection>
        {/* ── DEALS & OFFERS ── */}
        <section className="px-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-foreground">Deals & Offers</h2>
            <button onClick={() => navigate('/deals')} className="flex items-center gap-0.5 text-primary text-xs font-medium active:scale-95 transition-transform">
              View All <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
            <div className="flex gap-2.5 pb-1" style={{ width: 'max-content' }}>
              {[
                { title: 'Early Bird Discount', desc: 'Book 6+ months early & save 15%', icon: Zap, color: 'from-amber-500 to-orange-500' },
                { title: 'Monsoon Special', desc: 'Flat 20% off monsoon weddings', icon: Gift, color: 'from-emerald-500 to-teal-500' },
                { title: 'Bundle & Save', desc: 'Book 3+ vendors for extra 10% off', icon: Tag, color: 'from-primary to-accent' },
              ].map((deal, i) => (
                <button
                  key={i}
                  onClick={() => navigate('/deals')}
                  className="flex-shrink-0 w-52 rounded-xl overflow-hidden active:scale-[0.97] transition-transform text-left"
                >
                  <div className={`bg-gradient-to-br ${deal.color} p-4 text-white`}>
                    <deal.icon className="h-6 w-6 mb-2 opacity-90" />
                    <p className="text-sm font-bold leading-tight">{deal.title}</p>
                    <p className="text-[10px] opacity-80 mt-1 leading-snug">{deal.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── WEDDING DIRECTORY (City Grid) ── */}
        <section className="px-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-foreground">Wedding Directory</h2>
            <button onClick={() => navigate('/wedding-directory')} className="flex items-center gap-0.5 text-primary text-xs font-medium active:scale-95 transition-transform">
              All Cities <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { name: 'Delhi', emoji: '🏛️' },
              { name: 'Mumbai', emoji: '🌊' },
              { name: 'Bangalore', emoji: '🌿' },
              { name: 'Jaipur', emoji: '🏰' },
              { name: 'Lucknow', emoji: '🕌' },
              { name: 'Kolkata', emoji: '🌸' },
            ].map((city) => (
              <button
                key={city.name}
                onClick={() => navigate(`/vendors-in/${city.name.toLowerCase()}`)}
                className="flex flex-col items-center py-3 rounded-xl bg-card border border-border/40 active:scale-[0.97] transition-transform"
              >
                <span className="text-xl mb-1">{city.emoji}</span>
                <span className="text-xs font-semibold text-foreground">{city.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* ── TRENDING ON KARLO SHAADI ── */}
        <section className="px-4">
          <h2 className="text-base font-semibold text-foreground mb-3">Trending on Karlo Shaadi</h2>
          <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
            <div className="flex gap-2.5 pb-1" style={{ width: 'max-content' }}>
              {[
                { title: 'Shaadi Wrapped', desc: 'Your wedding recap', route: '/shaadi-wrapped', icon: Sparkles },
                { title: 'Earn With Us', desc: 'Refer & earn ₹500', route: '/earn', icon: TrendingUp },
                { title: 'Why Karlo Shaadi?', desc: 'See why we\'re #1', route: '/why-karlo-shaadi', icon: Award },
                { title: 'Vendor Leaderboard', desc: 'Top rated vendors', route: '/leaderboard', icon: Building2 },
              ].map((item) => (
                <button
                  key={item.route}
                  onClick={() => navigate(item.route)}
                  className="flex-shrink-0 w-40 p-3 rounded-xl bg-card border border-border/40 active:scale-[0.97] transition-transform text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/15 to-accent/15 flex items-center justify-center mb-2">
                    <item.icon className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-[11px] font-semibold text-foreground leading-tight">{item.title}</p>
                  <p className="text-[9px] text-muted-foreground mt-0.5">{item.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="mx-4 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

        {/* ── HOW IT WORKS (compact horizontal strip) ── */}
        <section className="px-4">
          <h2 className="text-base font-semibold text-foreground mb-3">Book a Vendor in 3 Steps</h2>
          <div className="flex gap-2">
            {howItWorksSteps.map((step, i) => (
              <div key={i} className="flex-1 flex flex-col items-center text-center p-3 rounded-xl bg-card border border-border/40">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/15 to-accent/15 flex items-center justify-center mb-2 border border-primary/20">
                  <span className="text-xs font-bold text-primary">{step.num}</span>
                </div>
                <p className="text-[11px] font-semibold text-foreground leading-tight">{step.title}</p>
                <p className="text-[9px] text-muted-foreground mt-0.5 leading-snug">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── SHAADI SEVA ── */}
        <section className="px-4">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/50">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <HandHeart className="h-5 w-5 text-emerald-700" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">Shaadi Seva</p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                Every booking helps underprivileged couples celebrate their wedding. ₹25,000+ raised.
              </p>
              <button onClick={() => navigate('/shaadi-seva')} className="text-xs font-semibold text-emerald-700 mt-2 flex items-center gap-1 active:scale-95 transition-transform">
                Learn More <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        </section>

        {/* ── SUCCESS STORIES + REVIEWS ── */}
        <section className="px-4 space-y-3">
          <div className="relative rounded-xl overflow-hidden">
            <img src={coupleImage} alt="Real couples" className="w-full h-36 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <p className="text-white text-sm font-display font-semibold">Real Couples, Real Celebrations</p>
              <p className="text-white/70 text-[10px] mt-0.5">Trusted by 500+ couples across India</p>
            </div>
          </div>

          <div className="flex items-center justify-between bg-card rounded-xl p-3 border border-border/40">
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />)}
              </div>
              <span className="text-sm font-bold text-foreground">4.9/5</span>
            </div>
            <button onClick={() => navigate('/testimonials')} className="text-xs font-semibold text-primary active:scale-95 transition-transform">
              Read Stories
            </button>
          </div>

          <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
            <div className="flex gap-2.5 pb-1" style={{ width: 'max-content' }}>
              {reviewQuotes.map((review, i) => (
                <div key={i} className="flex-shrink-0 w-64 p-3 rounded-xl bg-card border border-border/40">
                  <div className="flex items-center gap-0.5 mb-1.5">
                    {[...Array(review.rating)].map((_, j) => <Star key={j} className="h-3 w-3 text-amber-400 fill-amber-400" />)}
                  </div>
                  <p className="text-[11px] text-foreground leading-relaxed italic">&ldquo;{review.quote}&rdquo;</p>
                  <p className="text-[10px] font-semibold text-muted-foreground mt-1.5">{review.name} · {review.city}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FOR VENDORS BANNER ── */}
        <section className="px-4">
          <div className="relative rounded-xl overflow-hidden">
            <img src={fireworksImage} alt="For vendors" className="w-full h-36 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <p className="text-white text-sm font-display font-semibold">Grow Your Wedding Business</p>
              <p className="text-white/70 text-[10px] mt-0.5 mb-2.5">Join 50+ verified vendors on Karlo Shaadi</p>
              <button
                onClick={() => navigate('/vendor/onboarding')}
                className="bg-accent text-accent-foreground text-xs font-semibold px-4 py-2 rounded-full active:scale-95 transition-transform"
              >
                Register as Vendor
              </button>
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section className="px-4">
          <div className="text-center py-6 px-5 rounded-xl bg-gradient-to-br from-primary/5 via-card to-accent/5 border border-border/40">
            
            <h2 className="text-base font-display font-semibold text-foreground mb-1">Start Your Dream Wedding</h2>
            <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
              Plan, book, and celebrate — all in one place
            </p>
            <button
              onClick={() => navigate('/plan-wizard')}
              className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground text-sm font-semibold px-6 py-2.5 rounded-full shadow-lg active:scale-95 transition-transform"
            >
              Get Started Free
            </button>
            {!user && (
              <button
                onClick={() => navigate('/vendor/onboarding')}
                className="block mx-auto mt-2 text-xs font-medium text-muted-foreground underline underline-offset-2 active:scale-95 transition-transform"
              >
                Are You a Vendor? Register Here →
              </button>
            )}
          </div>
        </section>
        </LazySection>

      </div>
    </div>
  );
}
