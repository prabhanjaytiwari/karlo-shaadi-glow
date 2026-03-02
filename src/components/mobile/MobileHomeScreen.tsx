import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import {
  Heart, Star, Shield, MapPin, Users, Calculator, CalendarHeart,
  Sparkles, ArrowRight, ChevronRight, Music, Mic, FlameKindling,
  BadgeCheck, Bell, Utensils, Camera, Palette, Gem, PartyPopper, HandHeart
} from 'lucide-react';

// Category images (vendor categories ONLY)
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

// ─── DATA ─────────────────────────────────────────────

const vendorCategories = [
  { image: categoryVenue, label: 'Venue', category: 'venue', icon: MapPin },
  { image: categoryPhotography, label: 'Photography', category: 'photography', icon: Camera },
  { image: categoryDecoration, label: 'Decoration', category: 'decoration', icon: Palette },
  { image: categoryMakeup, label: 'Makeup', category: 'makeup', icon: Sparkles },
  { image: categoryCatering, label: 'Catering', category: 'catering', icon: Utensils },
  { image: categoryMehendi, label: 'Mehendi', category: 'mehendi', icon: Heart },
  { image: categoryMusic, label: 'Music', category: 'music', icon: Music },
  { image: categoryJewelry, label: 'Jewelry', category: 'jewelry', icon: Gem },
  { image: categoryEntertainment, label: 'Entertainment', category: 'entertainment', icon: PartyPopper },
];

const planningTools = [
  { title: 'Budget Calculator', desc: 'Plan your wedding budget smartly', icon: Calculator, route: '/budget-calculator', gradient: 'from-amber-50 to-orange-50' },
  { title: 'Muhurat Finder', desc: 'Find auspicious wedding dates', icon: CalendarHeart, route: '/muhurat-finder', gradient: 'from-rose-50 to-pink-50' },
  { title: 'Invite Creator', desc: 'Design beautiful digital invites', icon: Heart, route: '/invite-creator', gradient: 'from-violet-50 to-purple-50' },
  { title: 'Wedding Planner', desc: 'AI-powered wedding planning', icon: Sparkles, route: '/plan-wizard', gradient: 'from-emerald-50 to-teal-50' },
];

const funTools = [
  { title: 'Couple Quiz', tagline: 'How well do you know each other?', route: '/couple-quiz', key: 'couple-quiz', icon: Heart },
  { title: 'Budget Roast', tagline: 'Get your budget humorously roasted', route: '/budget-roast', key: 'budget-roast', icon: FlameKindling },
  { title: 'Speech Writer', tagline: 'AI-crafted wedding speeches', route: '/speech-writer', key: 'speech-writer', icon: Mic },
  { title: 'Music Generator', tagline: 'Create your wedding anthem', route: '/music-generator', key: 'music-generator', icon: Music },
  { title: 'Vendor Score', tagline: 'Check any vendor\'s trust score', route: '/vendor-check', key: 'vendor-score', icon: BadgeCheck },
];

const howItWorksSteps = [
  { num: '01', title: 'Tell Us Your Vision', desc: 'Share your wedding date, city, budget & style preferences' },
  { num: '02', title: 'Get Matched', desc: 'We match you with verified vendors perfectly suited to your needs' },
  { num: '03', title: 'Book & Celebrate', desc: 'Secure your vendors with safe payments & enjoy your big day' },
];

const reviewQuotes = [
  { name: 'Priya & Rahul', city: 'Mumbai', quote: 'Karlo Shaadi made our dream wedding a reality. The vendor matching was spot on!', rating: 5 },
  { name: 'Sneha & Amit', city: 'Delhi', quote: 'From venue to catering, every vendor was top-notch. Truly premium service.', rating: 5 },
  { name: 'Ananya & Vikram', city: 'Bangalore', quote: 'The budget calculator saved us lakhs. Best wedding planning platform!', rating: 5 },
];

// ─── HOOKS ────────────────────────────────────────────

function useVendors() {
  return useQuery({
    queryKey: ['mobile-top-vendors'],
    queryFn: async () => {
      const { data } = await supabase
        .from('vendors')
        .select('id, business_name, category, city, average_rating, total_reviews, logo_url, portfolio_images')
        .order('average_rating', { ascending: false })
        .limit(8);
      return data || [];
    },
  });
}

function useBannerImages() {
  const [banners, setBanners] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBanners() {
      try {
        const { data: files } = await supabase.storage.from('home-banners').list();
        if (files && files.length >= 5) {
          const urls: Record<string, string> = {};
          for (const f of files) {
            const key = f.name.replace('.png', '');
            const { data } = supabase.storage.from('home-banners').getPublicUrl(f.name);
            urls[key] = data.publicUrl;
          }
          setBanners(urls);
          setLoading(false);
          return;
        }
        const { data, error } = await supabase.functions.invoke('generate-home-banners');
        if (!error && data?.banners) {
          setBanners(data.banners);
        }
      } catch (e) {
        console.error('Banner load error:', e);
      } finally {
        setLoading(false);
      }
    }
    loadBanners();
  }, []);

  return { banners, loading };
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

// ─── SUB-COMPONENTS ───────────────────────────────────

function SectionHeader({ title, seeAllRoute }: { title: string; seeAllRoute?: string }) {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-base font-semibold text-foreground tracking-tight">{title}</h2>
      {seeAllRoute && (
        <button
          onClick={() => navigate(seeAllRoute)}
          className="flex items-center gap-0.5 text-primary text-xs font-medium active:scale-95 transition-transform"
        >
          See All <ChevronRight className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}

function PremiumDivider() {
  return <div className="mx-4 h-px bg-gradient-to-r from-transparent via-border to-transparent" />;
}

// ─── MAIN COMPONENT ───────────────────────────────────

export function MobileHomeScreen() {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { data: vendors = [] } = useVendors();
  const { banners } = useBannerImages();
  const { data: countdown } = useWeddingCountdown();

  const placeholderVendors = [
    { id: 'p1', business_name: 'Royal Palace Venue', category: 'venue', city: 'Mumbai', average_rating: 4.9, total_reviews: 128, image: vendorImage1 },
    { id: 'p2', business_name: 'Candid Captures', category: 'photography', city: 'Delhi', average_rating: 4.8, total_reviews: 95, image: vendorImage2 },
    { id: 'p3', business_name: 'Dream Decor Studio', category: 'decoration', city: 'Jaipur', average_rating: 4.7, total_reviews: 67, image: vendorImage3 },
    { id: 'p4', business_name: 'Haldi Moments', category: 'photography', city: 'Bangalore', average_rating: 4.9, total_reviews: 112, image: vendorImage4 },
  ];

  const displayVendors = vendors.length > 0 ? vendors : placeholderVendors;

  return (
    <div className="min-h-screen bg-background">

      {/* ── SECTION 1: Sticky Header ── */}
      <header className="sticky top-0 z-50 glass-intense">
        <div className="flex items-center justify-between px-4 h-14">
          <img src={logoImage} alt="Karlo Shaadi" className="h-8 object-contain" />
          <div className="flex items-center gap-3">
            {user && (
              <button onClick={() => navigate('/notifications')} className="relative p-2 rounded-full hover:bg-muted/50 active:scale-95 transition-all">
                <Bell className="h-5 w-5 text-foreground" />
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="space-y-8 pb-8">

        {/* ── SECTION 2: Hero Banner ── */}
        <section className="px-4 pt-4">
          <div className="relative rounded-2xl overflow-hidden shadow-xl border border-accent/20">
            <img src={heroImage} alt="Wedding celebration" className="w-full h-52 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <p className="text-amber-300 text-[10px] font-semibold tracking-[0.2em] uppercase mb-1">
                India's Most Trending Wedding Planning Platform
              </p>
              <h1 className="text-white text-xl font-display font-semibold leading-tight mb-1">
                Aap Shaadi Karo,
              </h1>
              <p className="text-white/90 text-base font-display font-medium leading-tight mb-3">
                Tension Hum Sambhal Lenge
              </p>
              <button
                onClick={() => navigate('/plan-wizard')}
                className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground text-sm font-semibold px-5 py-2.5 rounded-full shadow-lg active:scale-95 transition-transform"
              >
                Start Planning Free
              </button>
            </div>
            <div className="absolute bottom-3 right-4 flex gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-white/80" />
              <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
              <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
            </div>
          </div>
        </section>

        {/* ── Wedding Countdown (logged-in only) ── */}
        {countdown && (
          <section className="px-4 -mt-4">
            <div className="bg-gradient-to-r from-accent/10 via-accent/5 to-primary/10 rounded-xl px-4 py-3 border border-accent/20 flex items-center gap-3">
              <CalendarHeart className="h-5 w-5 text-accent flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {countdown.days} days to your wedding! 🎉
                </p>
                {countdown.partnerName && (
                  <p className="text-xs text-muted-foreground">With {countdown.partnerName}</p>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ── SECTION 3: Trust Stats ── */}
        <section className="px-4">
          <div className="grid grid-cols-4 gap-2">
            {[
              { icon: Users, value: '500+', label: 'Couples', color: 'text-primary' },
              { icon: Star, value: '50+', label: 'Vendors', color: 'text-accent' },
              { icon: Shield, value: '100%', label: 'Secure', color: 'text-emerald-600' },
              { icon: MapPin, value: '20+', label: 'Cities', color: 'text-blue-600' },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center py-3 px-1 rounded-xl bg-card border border-border/50">
                <stat.icon className={`h-5 w-5 ${stat.color} mb-1.5`} />
                <span className="text-sm font-bold text-foreground">{stat.value}</span>
                <span className="text-[10px] text-muted-foreground font-medium">{stat.label}</span>
              </div>
            ))}
          </div>
        </section>

        <PremiumDivider />

        {/* ── SECTION 4: Vendor Categories (ONLY vendors, no tools) ── */}
        <section className="px-4">
          <SectionHeader title="Browse by Category" seeAllRoute="/categories" />
          <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
            <div className="flex gap-4 pb-2" style={{ width: 'max-content' }}>
              {vendorCategories.map((cat) => (
                <button
                  key={cat.category}
                  onClick={() => navigate(`/search?category=${cat.category}`)}
                  className="flex flex-col items-center gap-2 active:scale-95 transition-transform"
                  style={{ minWidth: '72px' }}
                >
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-accent/20 shadow-md">
                    <img src={cat.image} alt={cat.label} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[11px] font-medium text-foreground text-center leading-tight">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <PremiumDivider />

        {/* ── SECTION 5: Top Rated Vendors ── */}
        <section className="px-4">
          <SectionHeader title="Top Rated Vendors" seeAllRoute="/search" />
          <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
            <div className="flex gap-3 pb-2" style={{ width: 'max-content' }}>
              {displayVendors.map((vendor: any) => {
                const image = vendor.image || vendor.logo_url || vendor.portfolio_images?.[0] || vendorImage1;
                return (
                  <button
                    key={vendor.id}
                    onClick={() => vendor.id?.startsWith?.('p') ? navigate('/search') : navigate(`/vendor/${vendor.id}`)}
                    className="flex-shrink-0 w-40 rounded-xl overflow-hidden border border-border/50 bg-card shadow-sm active:scale-[0.97] transition-transform text-left"
                  >
                    <div className="w-full h-28 overflow-hidden">
                      <img src={image} alt={vendor.business_name} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-2.5">
                      <p className="text-xs font-semibold text-foreground truncate">{vendor.business_name}</p>
                      <p className="text-[10px] text-muted-foreground capitalize">{vendor.category} · {vendor.city}</p>
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

        {/* ── Top Vendors Photo Grid ── */}
        <section className="px-4">
          <SectionHeader title="Top Vendors" seeAllRoute="/search" />
          <div className="grid grid-cols-2 gap-2">
            {[vendorImage1, vendorImage2, vendorImage3, vendorImage4].map((img, i) => (
              <button
                key={i}
                onClick={() => navigate('/search')}
                className="rounded-xl overflow-hidden aspect-square active:scale-[0.97] transition-transform shadow-sm"
              >
                <img src={img} alt={`Top vendor ${i + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </section>

        <PremiumDivider />

        {/* ── SECTION 6: Free Planning Tools (separate from categories!) ── */}
        <section className="px-4">
          <SectionHeader title="Free Planning Tools" seeAllRoute="/budget-calculator" />
          <div className="grid grid-cols-2 gap-3">
            {planningTools.map((tool) => (
              <button
                key={tool.route}
                onClick={() => navigate(tool.route)}
                className={`flex flex-col items-start p-4 rounded-xl bg-gradient-to-br ${tool.gradient} border border-border/30 shadow-sm active:scale-[0.97] transition-transform text-left`}
              >
                <div className="w-9 h-9 rounded-lg bg-white/80 border border-border/20 flex items-center justify-center mb-2.5 shadow-sm">
                  <tool.icon className="h-4 w-4 text-primary" />
                </div>
                <p className="text-xs font-semibold text-foreground leading-tight">{tool.title}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug">{tool.desc}</p>
              </button>
            ))}
          </div>
        </section>

        <PremiumDivider />

        {/* ── SECTION 7: Fun Wedding Tools (with generated images) ── */}
        <section className="px-4">
          <SectionHeader title="Fun Wedding Tools" />
          <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
            <div className="flex gap-3 pb-2" style={{ width: 'max-content' }}>
              {funTools.map((tool) => {
                const bannerUrl = banners[tool.key];
                return (
                  <button
                    key={tool.key}
                    onClick={() => navigate(tool.route)}
                    className="flex-shrink-0 w-44 rounded-xl overflow-hidden border border-border/50 bg-card shadow-sm active:scale-[0.97] transition-transform text-left"
                  >
                    <div className="w-full h-24 bg-gradient-to-br from-accent/10 via-primary/5 to-accent/5 flex items-center justify-center overflow-hidden">
                      {bannerUrl ? (
                        <img src={bannerUrl} alt={tool.title} className="w-full h-full object-cover" />
                      ) : (
                        <tool.icon className="h-8 w-8 text-primary/40" />
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-xs font-semibold text-foreground">{tool.title}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug">{tool.tagline}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <PremiumDivider />

        {/* ── SECTION 8: How It Works ── */}
        <section className="px-4">
          <SectionHeader title="How It Works" />
          <div className="space-y-3">
            {howItWorksSteps.map((step, i) => (
              <div key={i} className="flex gap-4 items-start p-4 rounded-xl bg-card border border-border/50">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center flex-shrink-0 border border-primary/20">
                  <span className="text-xs font-bold text-primary">{step.num}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{step.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <PremiumDivider />

        {/* ── SECTION 9: Shaadi Seva (Social Impact) ── */}
        <section className="px-4">
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/50 p-5">
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <HandHeart className="h-5 w-5 text-emerald-700" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Shaadi Seva</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  Every booking contributes to helping underprivileged couples celebrate their wedding. ₹25,000+ raised so far.
                </p>
                <button
                  onClick={() => navigate('/shaadi-seva')}
                  className="text-xs font-semibold text-emerald-700 mt-2 flex items-center gap-1 active:scale-95 transition-transform"
                >
                  Learn More <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        </section>

        <PremiumDivider />

        {/* ── SECTION 10: Success Stories + Reviews ── */}
        <section className="px-4 space-y-4">
          <div className="relative rounded-2xl overflow-hidden">
            <img src={coupleImage} alt="Real couples" className="w-full h-44 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <p className="text-white text-base font-display font-semibold">Real Couples, Real Celebrations</p>
              <p className="text-white/70 text-xs mt-0.5">Trusted by 500+ couples across India</p>
            </div>
          </div>

          <div className="flex items-center justify-between bg-card rounded-xl p-3 border border-border/50">
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <span className="text-sm font-bold text-foreground">4.9/5</span>
              <span className="text-xs text-muted-foreground">from 500+ reviews</span>
            </div>
            <button onClick={() => navigate('/testimonials')} className="text-xs font-semibold text-primary active:scale-95 transition-transform">
              Read Stories
            </button>
          </div>

          <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
            <div className="flex gap-3 pb-2" style={{ width: 'max-content' }}>
              {reviewQuotes.map((review, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-72 p-4 rounded-xl bg-card/80 backdrop-blur-sm border border-border/50 shadow-sm"
                >
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(review.rating)].map((_, j) => (
                      <Star key={j} className="h-3 w-3 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-foreground leading-relaxed italic">&ldquo;{review.quote}&rdquo;</p>
                  <p className="text-[10px] font-semibold text-muted-foreground mt-2">{review.name} · {review.city}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <PremiumDivider />

        {/* ── SECTION 11: For Vendors Banner ── */}
        <section className="px-4">
          <div className="relative rounded-2xl overflow-hidden">
            <img src={fireworksImage} alt="For vendors" className="w-full h-40 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <p className="text-white text-base font-display font-semibold">Grow Your Wedding Business</p>
              <p className="text-white/70 text-xs mt-0.5 mb-3">Join 50+ verified vendors on Karlo Shaadi</p>
              <button
                onClick={() => navigate('/for-vendors')}
                className="bg-accent text-accent-foreground text-xs font-semibold px-4 py-2 rounded-full active:scale-95 transition-transform"
              >
                Register as Vendor
              </button>
            </div>
          </div>
        </section>

        <PremiumDivider />

        {/* ── SECTION 12: Final CTA ── */}
        <section className="px-4 pb-4">
          <div className="text-center py-8 px-6 rounded-2xl bg-gradient-to-br from-primary/5 via-card to-accent/5 border border-border/50">
            <Sparkles className="h-8 w-8 text-accent mx-auto mb-3" />
            <h2 className="text-lg font-display font-semibold text-foreground mb-1">Start Your Dream Wedding</h2>
            <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
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
                onClick={() => navigate('/for-vendors')}
                className="block mx-auto mt-3 text-xs font-medium text-muted-foreground underline underline-offset-2 active:scale-95 transition-transform"
              >
                Are You a Vendor? Register Here →
              </button>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}
