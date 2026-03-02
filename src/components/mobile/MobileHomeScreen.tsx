import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';
import {
  Search, Calculator, Calendar, Heart, Music, Image, CheckSquare, Users,
  Sparkles, MessageSquare, ArrowRight, Clock
} from 'lucide-react';
import { differenceInDays, differenceInHours, format } from 'date-fns';
import { cn } from '@/lib/utils';
import logo from '@/assets/logo-new.png';

interface QuickAction {
  icon: typeof Search;
  label: string;
  path: string;
  color: string;
}

const quickActions: QuickAction[] = [
  { icon: Search, label: 'Search Vendors', path: '/search', color: 'bg-primary/10 text-primary' },
  { icon: Calculator, label: 'Budget', path: '/budget-calculator', color: 'bg-accent/10 text-accent' },
  { icon: CheckSquare, label: 'Checklist', path: '/checklist', color: 'bg-emerald-500/10 text-emerald-600' },
  { icon: Users, label: 'Guest List', path: '/guest-list', color: 'bg-violet-500/10 text-violet-600' },
  { icon: Calendar, label: 'Muhurat', path: '/muhurat-finder', color: 'bg-amber-500/10 text-amber-600' },
];

interface ToolItem {
  icon: typeof Search;
  label: string;
  path: string;
  color: string;
}

const tools: ToolItem[] = [
  { icon: Calculator, label: 'Budget Calculator', path: '/budget-calculator', color: 'bg-primary/10 text-primary' },
  { icon: Image, label: 'Invite Creator', path: '/invite-creator', color: 'bg-accent/10 text-accent' },
  { icon: Music, label: 'Music Generator', path: '/music-generator', color: 'bg-violet-500/10 text-violet-600' },
  { icon: Sparkles, label: 'Speech Writer', path: '/speech-writer', color: 'bg-emerald-500/10 text-emerald-600' },
  { icon: Heart, label: 'Couple Quiz', path: '/couple-quiz', color: 'bg-pink-500/10 text-pink-600' },
  { icon: Search, label: 'Vendor Check', path: '/vendor-check', color: 'bg-amber-500/10 text-amber-600' },
];

interface Booking {
  id: string;
  status: string;
  wedding_date: string;
  total_amount: number;
  vendor: { business_name: string; category: string } | null;
}

export function MobileHomeScreen() {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    
    const [profileRes, bookingsRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase
        .from('bookings')
        .select('id, status, wedding_date, total_amount, vendor:vendors(business_name, category)')
        .eq('couple_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3),
    ]);

    if (profileRes.data) setProfile(profileRes.data);
    if (bookingsRes.data) setBookings(bookingsRes.data as any);
    setLoading(false);
  };

  const weddingDate = profile?.wedding_date ? new Date(profile.wedding_date) : null;
  const daysLeft = weddingDate ? differenceInDays(weddingDate, new Date()) : null;
  const firstName = profile?.full_name?.split(' ')[0] || 'there';

  const statusColor: Record<string, string> = {
    pending: 'bg-amber-500',
    confirmed: 'bg-emerald-500',
    completed: 'bg-primary',
    cancelled: 'bg-destructive',
  };

  return (
    <div className="min-h-screen bg-background pb-4">
      {/* Top bar with logo */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-xl border-b border-border px-4 h-12 flex items-center justify-between">
        <img src={logo} alt="Karlo Shaadi" className="h-7 w-auto" style={{ mixBlendMode: 'multiply' }} />
        <button onClick={() => navigate('/notifications')} className="relative w-8 h-8 flex items-center justify-center rounded-full active:scale-95">
          <MessageSquare className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>

      <div className="px-4 pt-4 space-y-5">
        {/* Greeting */}
        <div>
          <h1 className="text-xl font-semibold text-foreground">
            Hey {firstName}! 👋
          </h1>
          {daysLeft !== null && daysLeft > 0 && (
            <p className="text-sm text-muted-foreground mt-0.5">
              Your wedding is in <span className="text-primary font-semibold">{daysLeft} days</span>
            </p>
          )}
        </div>

        {/* Wedding Countdown Card */}
        {weddingDate && daysLeft !== null && daysLeft > 0 && (
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5 border border-primary/20 p-5">
            <div className="absolute top-2 right-2 opacity-10">
              <Heart className="h-16 w-16 text-primary" />
            </div>
            <p className="text-xs font-medium text-primary/70 uppercase tracking-wider mb-2">Wedding Countdown</p>
            <div className="flex items-end gap-1">
              <span className="text-4xl font-bold text-primary tabular-nums">{daysLeft}</span>
              <span className="text-base text-muted-foreground mb-1 ml-1">days to go</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">
              {format(weddingDate, 'EEEE, MMMM d, yyyy')}
            </p>
          </div>
        )}

        {/* Quick Action Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
          {quickActions.map((action) => (
            <button
              key={action.path}
              onClick={() => navigate(action.path)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-border bg-background whitespace-nowrap active:scale-95 transition-transform shrink-0"
            >
              <div className={cn('w-6 h-6 rounded-full flex items-center justify-center', action.color)}>
                <action.icon className="h-3.5 w-3.5" />
              </div>
              <span className="text-xs font-medium text-foreground">{action.label}</span>
            </button>
          ))}
        </div>

        {/* Recent Bookings */}
        {bookings.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-foreground">Recent Bookings</h2>
              <button onClick={() => navigate('/bookings')} className="text-xs text-primary font-medium flex items-center gap-1">
                View All <ArrowRight className="h-3 w-3" />
              </button>
            </div>
            <div className="space-y-2.5">
              {bookings.map((booking) => (
                <button
                  key={booking.id}
                  onClick={() => navigate(`/booking/${booking.id}`)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border border-border bg-background active:scale-[0.98] transition-transform text-left"
                >
                  <div className={cn('w-1.5 h-10 rounded-full shrink-0', statusColor[booking.status] || 'bg-muted')} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {(booking.vendor as any)?.business_name || 'Vendor'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {format(new Date(booking.wedding_date), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-foreground">₹{(booking.total_amount / 1000).toFixed(0)}k</p>
                    <p className={cn('text-[10px] font-medium capitalize', 
                      booking.status === 'confirmed' ? 'text-emerald-600' :
                      booking.status === 'pending' ? 'text-amber-600' : 'text-muted-foreground'
                    )}>
                      {booking.status}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tools Grid */}
        <div>
          <h2 className="text-base font-semibold text-foreground mb-3">Wedding Tools</h2>
          <div className="grid grid-cols-3 gap-2.5">
            {tools.map((tool) => (
              <button
                key={tool.path}
                onClick={() => navigate(tool.path)}
                className="flex flex-col items-center gap-2 p-3.5 rounded-xl border border-border bg-background active:scale-95 transition-transform"
              >
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', tool.color)}>
                  <tool.icon className="h-5 w-5" />
                </div>
                <span className="text-[11px] font-medium text-foreground text-center leading-tight">{tool.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Explore Section */}
        <div>
          <h2 className="text-base font-semibold text-foreground mb-3">Explore</h2>
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { label: 'Browse Deals', path: '/deals', icon: Sparkles },
              { label: 'Real Weddings', path: '/stories', icon: Heart },
              { label: 'Wedding Directory', path: '/wedding-directory', icon: Search },
              { label: 'Shaadi Seva', path: '/shaadi-seva', icon: Users },
            ].map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="flex items-center gap-3 p-3.5 rounded-xl border border-border bg-background active:scale-95 transition-transform"
              >
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <item.icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <span className="text-xs font-medium text-foreground">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
