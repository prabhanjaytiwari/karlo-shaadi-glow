import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';
import { 
  Bell, ArrowRight, Star, ChevronRight, Heart, 
  Calculator, Calendar, Shield, CheckCircle2, Users, 
  MapPin, ShieldCheck, IndianRupee
} from 'lucide-react';
import { differenceInDays, format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

import logo from '@/assets/logo-new.png';
import heroWedding from '@/assets/hero-wedding-phere.jpeg';
import iconVenue from '@/assets/icon-venue.jpg';
import iconPhotography from '@/assets/icon-photography.jpg';
import iconDecoration from '@/assets/icon-decoration.jpg';
import iconMehendi from '@/assets/icon-mehendi.jpg';
import iconCatering from '@/assets/icon-catering.jpg';
import weddingCouple1 from '@/assets/wedding-couple-1.jpg';
import weddingCeremony from '@/assets/wedding-ceremony.jpg';
import weddingDecoration from '@/assets/wedding-decoration.jpg';
import weddingHaldi from '@/assets/wedding-haldi.jpg';
import weddingManifesting from '@/assets/wedding-manifesting.jpg';
import weddingFireworks from '@/assets/wedding-fireworks.jpg';

// ─── Static Data ───
const categories = [
  { image: iconVenue, label: 'Budget Calculator', path: '/budget-calculator' },
  { image: iconPhotography, label: 'Muhurat Finder', path: '/muhurat-finder' },
  { image: iconDecoration, label: 'Photographer', path: '/search?category=photography' },
  { image: iconMehendi, label: 'Makeup Artist', path: '/search?category=makeup' },
  { image: iconCatering, label: 'Invite Creator', path: '/invite-creator' },
];

const topVendorPhotos = [
  { image: weddingCouple1, label: 'Wedding Photography' },
  { image: weddingCeremony, label: 'Ceremony' },
  { image: weddingDecoration, label: 'Decoration' },
  { image: weddingHaldi, label: 'Haldi Ceremony' },
];

const checklistItems = [
  { label: 'Book wedding venue', checked: true },
  { label: 'Finalize photographer', checked: false },
  { label: 'Order wedding cards', checked: false },
];

const guestItems = [
  { label: 'Sharma Family (4)', checked: true },
  { label: 'College Friends (8)', checked: false },
  { label: 'Office Colleagues (6)', checked: false },
];

const viralTools = [
  { label: 'Couple Quiz', to: '/couple-quiz' },
  { label: 'Budget Roast', to: '/budget-roast' },
  { label: 'Vendor Checker', to: '/vendor-check' },
  { label: 'Speech Writer', to: '/speech-writer' },
  { label: 'Music Generator', to: '/music-generator' },
];

const howItWorksSteps = [
  { number: '01', title: 'Tell Us Your Vision', description: 'Share your wedding date, location, style & budget' },
  { number: '02', title: 'Get Matched', description: 'We curate perfect vendors for your requirements' },
  { number: '03', title: 'Book & Relax', description: 'Secure vendors with protected payments' },
];

interface VendorCard {
  id: string;
  business_name: string;
  category: string;
  average_rating: number | null;
  total_reviews: number | null;
  logo_url: string | null;
}

export function MobileHomeScreen() {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [vendors, setVendors] = useState<VendorCard[]>([]);

  useEffect(() => {
    fetchVendors();
    if (user) fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    if (data) setProfile(data);
  };

  const fetchVendors = async () => {
    const { data } = await supabase
      .from('vendors')
      .select('id, business_name, category, average_rating, total_reviews, logo_url')
      .eq('verified', true)
      .order('average_rating', { ascending: false })
      .limit(6);
    if (data) setVendors(data as unknown as VendorCard[]);
  };

  const weddingDate = profile?.wedding_date ? new Date(profile.wedding_date) : null;
  const daysLeft = weddingDate ? differenceInDays(weddingDate, new Date()) : null;

  const placeholderVendors: VendorCard[] = [
    { id: '1', business_name: 'Royal Photography', category: 'Photography', average_rating: 4.8, total_reviews: 120, logo_url: null },
    { id: '2', business_name: 'Shahi Decorators', category: 'Decoration', average_rating: 4.7, total_reviews: 89, logo_url: null },
    { id: '3', business_name: 'Ritu Makeup Studio', category: 'Makeup', average_rating: 4.9, total_reviews: 156, logo_url: null },
    { id: '4', business_name: 'Annapurna Caterers', category: 'Catering', average_rating: 4.6, total_reviews: 74, logo_url: null },
  ];
  const placeholderImages = [weddingCouple1, weddingCeremony, weddingDecoration, weddingHaldi];
  const displayVendors = vendors.length > 0 ? vendors : placeholderVendors;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* ─── Sticky Header ─── */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-xl border-b border-border px-4 h-12 flex items-center justify-between">
        <img src={logo} alt="Karlo Shaadi" className="h-7 w-auto" style={{ mixBlendMode: 'multiply' }} />
        <button
          onClick={() => navigate(user ? '/notifications' : '/auth')}
          className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-muted active:scale-95 transition-transform"
        >
          <Bell className="h-5 w-5 text-muted-foreground" />
        </button>
      </header>

      <div className="px-4 pt-4 space-y-6">
        {/* ─── Hero Banner ─── */}
        <section
          className="relative rounded-2xl overflow-hidden aspect-[16/10] cursor-pointer active:scale-[0.98] transition-transform"
          onClick={() => navigate('/budget-calculator')}
        >
          <img src={heroWedding} alt="Dream wedding" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <h1 className="text-white font-display font-bold text-xl leading-tight drop-shadow-md">
              {user ? 'Aap Shaadi Karo,\nTension Hum\nSambhal Lenge' : 'Your Dream\nWedding Starts Here'}
            </h1>
            <button className="mt-3 px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold shadow-lg active:scale-95 transition-transform">
              Calculate Services
            </button>
          </div>
          <div className="absolute bottom-2.5 right-5 flex gap-1.5">
            <span className="w-2 h-2 rounded-full bg-white" />
            <span className="w-2 h-2 rounded-full bg-white/40" />
            <span className="w-2 h-2 rounded-full bg-white/40" />
          </div>
        </section>

        {/* ─── Wedding Countdown ─── */}
        {user && daysLeft !== null && daysLeft > 0 && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200">
            <Heart className="h-5 w-5 text-amber-500 shrink-0" />
            <p className="text-sm text-amber-800 font-medium">
              <span className="font-bold text-amber-600">{daysLeft} days</span> to your wedding
              {weddingDate && <span className="text-amber-600/70"> · {format(weddingDate, 'MMM d, yyyy')}</span>}
            </p>
          </div>
        )}

        {/* ─── Trust Stats ─── */}
        <section className="grid grid-cols-4 gap-1">
          {[
            { icon: <Heart className="h-4 w-4 text-primary" />, value: '500+', label: 'Couples' },
            { icon: <Users className="h-4 w-4 text-primary" />, value: '50+', label: 'Vendors' },
            { icon: <ShieldCheck className="h-4 w-4 text-primary" />, value: '100%', label: 'Secure' },
            { icon: <MapPin className="h-4 w-4 text-primary" />, value: '20+', label: 'Cities' },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center text-center py-2.5 rounded-xl bg-secondary/40 border border-border">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mb-1">
                {stat.icon}
              </div>
              <span className="text-sm font-bold text-foreground">{stat.value}</span>
              <span className="text-[9px] text-muted-foreground">{stat.label}</span>
            </div>
          ))}
        </section>

        {/* ─── Category Quick Access ─── */}
        <section>
          <div className="flex gap-4 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.path}
                onClick={() => navigate(cat.path)}
                className="flex flex-col items-center gap-2 shrink-0 active:scale-95 transition-transform"
              >
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/20 shadow-sm">
                  <img src={cat.image} alt={cat.label} className="w-full h-full object-cover" />
                </div>
                <span className="text-[10px] font-medium text-foreground text-center leading-tight w-16">
                  {cat.label}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* ─── Categories Banner ─── */}
        <section className="rounded-2xl bg-gradient-to-br from-rose-50 via-white to-amber-50/50 border border-border p-5 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-3">
            <span className="text-accent text-[10px] font-medium">Categories</span>
          </div>
          <h2 className="text-base font-semibold text-foreground mb-1">
            2000+ Wedding Services. <span className="text-accent font-quote italic">One Platform.</span>
          </h2>
          <p className="text-[11px] text-muted-foreground mb-3">
            From photographers to caterers — every service, verified and ready.
          </p>
          <Button size="sm" className="rounded-full px-5 text-xs" onClick={() => navigate('/categories')}>
            Explore All Categories
          </Button>
        </section>

        {/* ─── Find Best Vendors ─── */}
        <section>
          <SectionHeader title="Find Best Vendors" onSeeAll={() => navigate('/search')} />
          <div className="flex gap-3 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
            {displayVendors.map((vendor, i) => {
              const img = vendor.logo_url || placeholderImages[i % placeholderImages.length];
              return (
                <button
                  key={vendor.id}
                  onClick={() => navigate(vendors.length > 0 ? `/vendor/${vendor.id}` : '/search')}
                  className="shrink-0 w-36 rounded-xl overflow-hidden border border-border bg-background active:scale-95 transition-transform"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img src={img as string} alt={vendor.business_name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-2.5">
                    <p className="text-xs font-semibold text-foreground truncate">{vendor.business_name}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                      <span className="text-[10px] font-medium text-foreground">{vendor.average_rating || 0}</span>
                      <span className="text-[10px] text-muted-foreground">({vendor.total_reviews || 0})</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* ─── Free Planning Tools ─── */}
        <section>
          <SectionHeader title="Free Planning Tools" onSeeAll={() => navigate('/budget-calculator')} />
          <div className="grid grid-cols-3 gap-2.5">
            {[
              { icon: Calculator, title: 'Budget Calculator', desc: 'Detailed budget breakdown', path: '/budget-calculator', cta: 'Calculate' },
              { icon: Calendar, title: 'Muhurat Finder', desc: 'Auspicious wedding dates', path: '/muhurat-finder', cta: 'Find Dates' },
              { icon: Heart, title: 'Invite Creator', desc: 'Stunning invitations', path: '/invite-creator', cta: 'Create' },
            ].map((tool) => (
              <button
                key={tool.path}
                onClick={() => navigate(tool.path)}
                className="p-3 rounded-xl border border-border bg-background text-left active:scale-[0.97] transition-transform"
              >
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary/15 to-accent/15 flex items-center justify-center mb-2">
                  <tool.icon className="h-4 w-4 text-primary" />
                </div>
                <p className="text-[11px] font-semibold text-foreground leading-tight mb-0.5">{tool.title}</p>
                <p className="text-[9px] text-muted-foreground leading-tight">{tool.desc}</p>
              </button>
            ))}
          </div>
        </section>

        {/* ─── Viral Tools Row ─── */}
        <section>
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
            {viralTools.map((tool) => (
              <Link
                key={tool.to}
                to={tool.to}
                className="shrink-0 px-3.5 py-2 rounded-full border border-border bg-background hover:border-primary/30 hover:bg-primary/5 text-[11px] font-medium text-muted-foreground active:scale-95 transition-all"
              >
                {tool.label}
              </Link>
            ))}
          </div>
        </section>

        {/* ─── Top Vendors Photo Grid ─── */}
        <section>
          <SectionHeader title="Top Vendors" onSeeAll={() => navigate('/search')} />
          <div className="grid grid-cols-2 gap-2.5">
            {topVendorPhotos.map((photo) => (
              <button
                key={photo.label}
                onClick={() => navigate('/search')}
                className="relative aspect-[4/3] rounded-xl overflow-hidden active:scale-[0.97] transition-transform"
              >
                <img src={photo.image} alt={photo.label} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <span className="absolute bottom-2 left-2.5 text-[11px] font-semibold text-white drop-shadow">
                  {photo.label}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* ─── Value Proposition ─── */}
        <section className="rounded-2xl overflow-hidden border border-border">
          <div className="relative aspect-video overflow-hidden">
            <img src={weddingCeremony} alt="Beautiful wedding ceremony" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
            <div className="absolute bottom-3 left-4 right-4">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/10 border border-accent/20 mb-2">
                <span className="text-accent text-[10px] font-medium">Your Wedding, Simplified</span>
              </div>
              <h3 className="text-sm font-semibold text-foreground">
                We Handle Everything, <span className="text-accent">You Celebrate</span>
              </h3>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-1.5 p-3">
            {[
              { title: '300+ Calls', subtitle: 'Handled for you' },
              { title: 'Zero Fraud', subtitle: 'Fully verified' },
              { title: 'Your Day', subtitle: 'Stress-free' },
            ].map((item, i) => (
              <div key={i} className="text-center py-2 px-1 rounded-lg bg-secondary/40 border border-border">
                <p className="text-[11px] font-semibold text-accent">{item.title}</p>
                <p className="text-[9px] text-muted-foreground">{item.subtitle}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── How It Works ─── */}
        <section>
          <SectionHeader title="How It Works" onSeeAll={() => navigate('/plan-wizard')} />
          <div className="space-y-3">
            {howItWorksSteps.map((step, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl border border-border bg-background">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 border border-accent/30 flex items-center justify-center shrink-0">
                  <span className="text-accent font-semibold text-xs">{step.number}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-foreground">{step.title}</p>
                  <p className="text-[10px] text-muted-foreground leading-snug mt-0.5">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
          <Button size="sm" className="rounded-full px-5 text-xs w-full mt-3" onClick={() => navigate('/plan-wizard')}>
            Start Planning Free
          </Button>
        </section>

        {/* ─── Planning Tools (Checklist & Guest List) ─── */}
        <section>
          <SectionHeader title="Planning Tools" onSeeAll={() => navigate('/checklist')} />
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => navigate('/checklist')}
              className="p-3.5 rounded-xl border border-border bg-background text-left active:scale-[0.97] transition-transform"
            >
              <p className="text-xs font-semibold text-foreground mb-2.5">Wedding Checklist</p>
              <div className="space-y-2">
                {checklistItems.map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <Checkbox checked={item.checked} className="h-3.5 w-3.5 pointer-events-none" />
                    <span className={cn('text-[10px] leading-tight', item.checked ? 'text-muted-foreground line-through' : 'text-foreground')}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-0.5 mt-3 text-primary">
                <span className="text-[10px] font-medium">View All</span>
                <ChevronRight className="h-3 w-3" />
              </div>
            </button>

            <button
              onClick={() => navigate('/guest-list')}
              className="p-3.5 rounded-xl border border-border bg-background text-left active:scale-[0.97] transition-transform"
            >
              <p className="text-xs font-semibold text-foreground mb-2.5">Guest List</p>
              <div className="space-y-2">
                {guestItems.map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <Checkbox checked={item.checked} className="h-3.5 w-3.5 pointer-events-none" />
                    <span className={cn('text-[10px] leading-tight', item.checked ? 'text-muted-foreground line-through' : 'text-foreground')}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-0.5 mt-3 text-primary">
                <span className="text-[10px] font-medium">View All</span>
                <ChevronRight className="h-3 w-3" />
              </div>
            </button>
          </div>
        </section>

        {/* ─── Shaadi Seva ─── */}
        <section className="rounded-2xl bg-gradient-to-br from-rose-50 via-white to-amber-50/50 border border-primary/15 p-5 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-3">
            <Heart className="h-3 w-3 text-primary fill-primary" />
            <span className="text-primary text-[10px] font-medium">Shaadi Seva</span>
          </div>
          <h3 className="text-sm font-semibold text-foreground mb-1.5">
            Every Wedding You Plan <span className="text-primary">Helps Someone Get Married</span>
          </h3>
          <p className="text-[11px] text-muted-foreground mb-4 leading-relaxed">
            10% of every payment goes to the Shaadi Seva Fund — supporting couples in need.
          </p>
          <div className="grid grid-cols-2 gap-2.5 mb-3">
            <div className="py-3 px-2 rounded-xl bg-primary/5 border border-primary/15">
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-1.5">
                <IndianRupee className="h-3.5 w-3.5 text-primary" />
              </div>
              <p className="text-sm font-bold text-primary">₹25,000+</p>
              <p className="text-[9px] text-muted-foreground">Total Raised</p>
            </div>
            <div className="py-3 px-2 rounded-xl bg-accent/5 border border-accent/15">
              <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center mx-auto mb-1.5">
                <Heart className="h-3.5 w-3.5 text-accent" />
              </div>
              <p className="text-sm font-bold text-accent">3+</p>
              <p className="text-[9px] text-muted-foreground">Weddings Supported</p>
            </div>
          </div>
          <Button size="sm" variant="outline" className="rounded-full px-5 text-xs border-primary/30" onClick={() => navigate('/shaadi-seva')}>
            Learn More
          </Button>
        </section>

        {/* ─── Success Stories ─── */}
        <section className="rounded-2xl overflow-hidden border border-border">
          <div className="relative aspect-[16/10] overflow-hidden">
            <img src={weddingManifesting} alt="Happy couple" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
            <div className="absolute bottom-3 left-4 right-4">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 mb-2">
                <span className="text-primary text-[10px] font-medium">Success Stories</span>
              </div>
              <h3 className="text-sm font-semibold text-foreground">
                Real Couples, <span className="text-primary">Real Celebrations</span>
              </h3>
            </div>
          </div>
          <div className="p-4">
            <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">
              Over 50,000 couples trusted us with their special day across India.
            </p>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shrink-0">
                <Star className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">4.9/5</p>
                <p className="text-[10px] text-muted-foreground">Average Rating</p>
              </div>
            </div>
            <Button size="sm" variant="outline" className="rounded-full px-5 text-xs w-full border-primary/30" onClick={() => navigate('/testimonials')}>
              Read Their Stories
            </Button>
          </div>
        </section>

        {/* ─── For Vendors Banner ─── */}
        <section className="rounded-2xl overflow-hidden border border-border">
          <div className="relative aspect-[2/1] overflow-hidden">
            <img src={weddingFireworks} alt="Wedding celebration" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          </div>
          <div className="p-4">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 mb-2">
              <span className="text-primary text-[10px] font-medium">For Vendors</span>
            </div>
            <h3 className="text-sm font-semibold text-foreground mb-1">
              Grow Your Business <span className="text-primary">10x Faster</span>
            </h3>
            <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">
              Join India's #1 zero-commission wedding platform. Get verified & connect with ready-to-book clients.
            </p>
            <div className="space-y-1.5 mb-3">
              {[
                { icon: Users, text: 'Couples across 20+ cities' },
                { icon: Shield, text: '100% secure payments' },
                { icon: Star, text: 'Verified reviews only' },
                { icon: CheckCircle2, text: 'Start free, pay when booked' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                    <item.icon className="h-3 w-3 text-primary" />
                  </div>
                  <p className="text-[11px] text-foreground">{item.text}</p>
                </div>
              ))}
            </div>
            <Button size="sm" className="rounded-full px-5 text-xs w-full" onClick={() => navigate('/for-vendors')}>
              Join as Vendor — Free
            </Button>
          </div>
        </section>

        {/* ─── Final CTA ─── */}
        <section className="rounded-2xl bg-gradient-to-br from-primary/10 via-background to-accent/10 border border-border p-5 text-center">
          <h3 className="text-sm font-semibold text-foreground mb-1.5">
            Ready to Start Your <span className="text-primary">Dream Wedding?</span>
          </h3>
          <p className="text-[11px] text-muted-foreground mb-4 leading-relaxed">
            Join 50,000+ happy couples who planned their perfect wedding stress-free.
          </p>
          <div className="flex flex-col gap-2">
            <Button size="sm" className="rounded-full text-xs w-full" onClick={() => navigate('/categories')}>
              Explore Vendors
            </Button>
            {!user && (
              <Button size="sm" variant="outline" className="rounded-full text-xs w-full border-primary/30" onClick={() => navigate('/auth')}>
                Create Free Account
              </Button>
            )}
          </div>
        </section>

        {/* ─── Vendor Acquisition ─── */}
        <section className="rounded-2xl bg-gradient-to-r from-accent/5 via-primary/5 to-accent/5 border border-border p-5 text-center">
          <h3 className="text-sm font-semibold text-foreground mb-1">
            Are You a <span className="text-accent">Wedding Vendor?</span>
          </h3>
          <p className="text-[11px] text-muted-foreground mb-3">
            Register free on India's zero-commission platform. 5,000+ vendors growing with us.
          </p>
          <div className="flex flex-col gap-2">
            <Button size="sm" className="rounded-full text-xs w-full" onClick={() => navigate('/for-vendors')}>
              Register as Vendor — Free
            </Button>
            <Button size="sm" variant="outline" className="rounded-full text-xs w-full border-accent/30" onClick={() => navigate('/vendor-check')}>
              Check Your Vendor Score
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}

// ─── Section Header ───
function SectionHeader({ title, onSeeAll }: { title: string; onSeeAll: () => void }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      <button onClick={onSeeAll} className="flex items-center gap-0.5 text-primary active:scale-95 transition-transform">
        <span className="text-xs font-medium">See All</span>
        <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
