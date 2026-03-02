import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';
import {
  Calculator, CheckSquare, Users, Palette, Search, Globe,
  ArrowRight, Clock, IndianRupee, Sparkles, Heart
} from 'lucide-react';
import { differenceInDays, format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { CountdownCircle } from './CountdownCircle';
import { CircularIconButton } from './CircularIconButton';
import logo from '@/assets/logo-new.png';

interface Booking {
  id: string;
  status: string;
  wedding_date: string;
  total_amount: number;
  vendor: { business_name: string; category: string } | null;
}

const quickActions = [
  { icon: Calculator, label: 'Budget', path: '/budget-calculator', variant: 'maroon' as const },
  { icon: CheckSquare, label: 'Checklist', path: '/checklist', variant: 'gold' as const },
  { icon: Users, label: 'Guests', path: '/guest-list', variant: 'cream' as const },
  { icon: Palette, label: 'Moodboard', path: '/moodboards', variant: 'maroon' as const },
  { icon: Search, label: 'Vendors', path: '/search', variant: 'gold' as const },
  { icon: Globe, label: 'Website', path: '/wedding-website', variant: 'cream' as const },
];

export function MobileHomeScreen() {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchData();
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
  const planningProgress = 42; // Could calculate from checklist completion

  const statusColor: Record<string, string> = {
    pending: 'bg-accent',
    confirmed: 'bg-emerald-500',
    completed: 'bg-primary',
    cancelled: 'bg-destructive',
  };

  const formatBudget = (amount: number) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}k`;
    return `₹${amount}`;
  };

  return (
    <div className="min-h-screen bg-background pb-4">
      {/* Top bar */}
      <div className="sticky top-0 z-40 bg-card/95 backdrop-blur-xl border-b border-border px-4 h-12 flex items-center justify-between">
        <img src={logo} alt="Karlo Shaadi" className="h-7 w-auto" style={{ mixBlendMode: 'multiply' }} />
        <button onClick={() => navigate('/notifications')} className="relative w-8 h-8 flex items-center justify-center rounded-full active:scale-95">
          <Sparkles className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>

      <div className="px-4 pt-5 space-y-6">
        {/* Greeting */}
        <div className="text-center">
          <h1 className="text-xl font-semibold text-foreground">
            Hey {firstName}! 👋
          </h1>
          {weddingDate && (
            <p className="text-xs text-muted-foreground mt-0.5">
              {format(weddingDate, 'EEEE, MMMM d, yyyy')}
            </p>
          )}
        </div>

        {/* Countdown Circle */}
        {weddingDate && daysLeft !== null && daysLeft > 0 && (
          <CountdownCircle weddingDate={weddingDate} />
        )}

        {/* Planning Progress */}
        <div className="px-2">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-muted-foreground">Planning Progress</span>
            <span className="text-xs font-semibold text-primary">{planningProgress}%</span>
          </div>
          <Progress value={planningProgress} className="h-2" />
        </div>

        {/* Quick Actions Grid 2x3 */}
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-3">Quick Actions</h2>
          <div className="grid grid-cols-3 gap-4">
            {quickActions.map((action) => (
              <CircularIconButton
                key={action.path}
                icon={action.icon}
                label={action.label}
                onClick={() => navigate(action.path)}
                variant={action.variant}
              />
            ))}
          </div>
        </div>

        {/* Budget Summary Card */}
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              <IndianRupee className="h-4 w-4 text-accent" />
              Budget Overview
            </h3>
            <button onClick={() => navigate('/budget-calculator')} className="text-xs text-primary font-medium">
              Details →
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">₹15L</p>
              <p className="text-[10px] text-muted-foreground">Total</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-accent">₹6.2L</p>
              <p className="text-[10px] text-muted-foreground">Spent</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">₹8.8L</p>
              <p className="text-[10px] text-muted-foreground">Remaining</p>
            </div>
          </div>
        </div>

        {/* Planning Tools */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-foreground">Planning Tools</h2>
            <button onClick={() => navigate('/tools')} className="text-xs text-primary font-medium flex items-center gap-1">
              See All <ArrowRight className="h-3 w-3" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate('/checklist')}
              className="flex items-center gap-3 p-3.5 rounded-xl border border-border bg-card active:scale-[0.98] transition-transform"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <CheckSquare className="h-5 w-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-xs font-semibold text-foreground">Checklist</p>
                <p className="text-[10px] text-muted-foreground">12/28 done</p>
              </div>
            </button>
            <button
              onClick={() => navigate('/guest-list')}
              className="flex items-center gap-3 p-3.5 rounded-xl border border-border bg-card active:scale-[0.98] transition-transform"
            >
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                <Users className="h-5 w-5 text-accent" />
              </div>
              <div className="text-left">
                <p className="text-xs font-semibold text-foreground">Guest List</p>
                <p className="text-[10px] text-muted-foreground">150 guests</p>
              </div>
            </button>
          </div>
        </div>

        {/* Recent Bookings */}
        {bookings.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-foreground">Recent Bookings</h2>
              <button onClick={() => navigate('/bookings')} className="text-xs text-primary font-medium flex items-center gap-1">
                View All <ArrowRight className="h-3 w-3" />
              </button>
            </div>
            <div className="space-y-2.5">
              {bookings.map((booking) => (
                <button
                  key={booking.id}
                  onClick={() => navigate(`/booking/${booking.id}`)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border border-border bg-card active:scale-[0.98] transition-transform text-left"
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
                    <p className="text-sm font-semibold text-foreground">{formatBudget(booking.total_amount)}</p>
                    <p className={cn('text-[10px] font-medium capitalize',
                      booking.status === 'confirmed' ? 'text-foreground' :
                      booking.status === 'pending' ? 'text-accent' : 'text-muted-foreground'
                    )}>
                      {booking.status}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Explore */}
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-3">Explore</h2>
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { label: 'Browse Deals', path: '/deals', icon: Sparkles },
              { label: 'Real Weddings', path: '/stories', icon: Heart },
            ].map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="flex items-center gap-3 p-3.5 rounded-xl border border-border bg-card active:scale-95 transition-transform"
              >
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
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
