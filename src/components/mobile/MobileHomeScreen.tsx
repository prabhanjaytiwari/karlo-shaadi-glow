import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';
import { Bell, ArrowRight, Star, ChevronRight, Heart } from 'lucide-react';
import { differenceInDays, format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';

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

// Category quick access items
const categories = [
  { image: iconVenue, label: 'Budget Calculator', path: '/budget-calculator' },
  { image: iconPhotography, label: 'Muhurat Finder', path: '/muhurat-finder' },
  { image: iconDecoration, label: 'Photographer', path: '/search?category=photography' },
  { image: iconMehendi, label: 'Makeup Artist', path: '/search?category=makeup' },
  { image: iconCatering, label: 'Invite Creator', path: '/invite-creator' },
];

// Top vendors photo grid
const topVendorPhotos = [
  { image: weddingCouple1, label: 'Wedding Photography' },
  { image: weddingCeremony, label: 'Ceremony' },
  { image: weddingDecoration, label: 'Decoration' },
  { image: weddingHaldi, label: 'Haldi Ceremony' },
];

// Static checklist items
const checklistItems = [
  { label: 'Book wedding venue', checked: true },
  { label: 'Finalize photographer', checked: false },
  { label: 'Order wedding cards', checked: false },
];

// Static guest list items
const guestItems = [
  { label: 'Sharma Family (4)', checked: true },
  { label: 'College Friends (8)', checked: false },
  { label: 'Office Colleagues (6)', checked: false },
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

  // Placeholder vendor cards using existing images when DB is empty
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
          <img
            src={heroWedding}
            alt="Dream wedding"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <h1 className="text-white font-display font-bold text-xl leading-tight drop-shadow-md">
              {user ? 'Aap Shaadi Karo,\nTension Hum\nSambhal Lenge' : 'Your Dream\nWedding Starts Here'}
            </h1>
            <button className="mt-3 px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold shadow-lg active:scale-95 transition-transform">
              Calculate Services
            </button>
          </div>
          {/* Decorative dots */}
          <div className="absolute bottom-2.5 right-5 flex gap-1.5">
            <span className="w-2 h-2 rounded-full bg-white" />
            <span className="w-2 h-2 rounded-full bg-white/40" />
            <span className="w-2 h-2 rounded-full bg-white/40" />
          </div>
        </section>

        {/* ─── Wedding Countdown (logged-in only) ─── */}
        {user && daysLeft !== null && daysLeft > 0 && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200">
            <Heart className="h-5 w-5 text-amber-500 shrink-0" />
            <p className="text-sm text-amber-800 font-medium">
              <span className="font-bold text-amber-600">{daysLeft} days</span> to your wedding
              {weddingDate && <span className="text-amber-600/70"> · {format(weddingDate, 'MMM d, yyyy')}</span>}
            </p>
          </div>
        )}

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

        {/* ─── Planning Tools ─── */}
        <section>
          <SectionHeader title="Planning Tools" onSeeAll={() => navigate('/checklist')} />
          <div className="grid grid-cols-2 gap-2.5">
            {/* Checklist Card */}
            <button
              onClick={() => navigate('/checklist')}
              className="p-3.5 rounded-xl border border-border bg-background text-left active:scale-[0.97] transition-transform"
            >
              <p className="text-xs font-semibold text-foreground mb-2.5">Wedding Checklist</p>
              <div className="space-y-2">
                {checklistItems.map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <Checkbox checked={item.checked} className="h-3.5 w-3.5 pointer-events-none" />
                    <span className={cn(
                      'text-[10px] leading-tight',
                      item.checked ? 'text-muted-foreground line-through' : 'text-foreground'
                    )}>
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

            {/* Guest List Card */}
            <button
              onClick={() => navigate('/guest-list')}
              className="p-3.5 rounded-xl border border-border bg-background text-left active:scale-[0.97] transition-transform"
            >
              <p className="text-xs font-semibold text-foreground mb-2.5">Guest List</p>
              <div className="space-y-2">
                {guestItems.map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <Checkbox checked={item.checked} className="h-3.5 w-3.5 pointer-events-none" />
                    <span className={cn(
                      'text-[10px] leading-tight',
                      item.checked ? 'text-muted-foreground line-through' : 'text-foreground'
                    )}>
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
      </div>
    </div>
  );
}

// ─── Section Header Component ───
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
