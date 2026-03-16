import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Search, Calendar, MessageSquare, User, LogIn, Tag, Wrench, FileQuestion } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useCapacitor } from '@/hooks/useCapacitor';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';

interface NavItem {
  icon: typeof Home;
  label: string;
  path: string;
  badge?: number;
}

export function BottomNavigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { isNative } = useCapacitor();
  const { user, isVendor } = useAuthContext();
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [pendingBookings, setPendingBookings] = useState(0);

  useEffect(() => {
    if (user) fetchBadgeCounts();
  }, [user]);

  const fetchBadgeCounts = async () => {
    if (!user) return;
    const { count: msgCount } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('recipient_id', user.id)
      .eq('read', false);
    setUnreadMessages(msgCount || 0);

    const { count: bookingCount } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('couple_id', user.id)
      .eq('status', 'pending');
    setPendingBookings(bookingCount || 0);
  };

  if (!isMobile && !isNative) return null;

  const vendorNavItems: NavItem[] = [
    { icon: Home, label: 'Home', path: '/vendor/dashboard' },
    { icon: FileQuestion, label: 'Inquiries', path: '/vendor/dashboard?tab=inquiries' },
    { icon: Calendar, label: 'Bookings', path: '/vendor/dashboard?tab=bookings', badge: pendingBookings },
    { icon: MessageSquare, label: 'Messages', path: '/vendor/dashboard?tab=messages', badge: unreadMessages },
    { icon: User, label: 'Profile', path: '/vendor/dashboard?tab=profile' },
  ];

  const coupleNavItems: NavItem[] = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Vendors', path: '/search' },
    { icon: Calendar, label: 'Bookings', path: '/bookings', badge: pendingBookings },
    { icon: MessageSquare, label: 'Messages', path: '/messages', badge: unreadMessages },
    { icon: User, label: 'Profile', path: '/dashboard' },
  ];

  const guestNavItems: NavItem[] = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Vendors', path: '/search' },
    { icon: Tag, label: 'Deals', path: '/deals' },
    { icon: Wrench, label: 'Tools', path: '/tools' },
    { icon: LogIn, label: 'Login', path: '/auth' },
  ];

  const navItems = user ? (isVendor ? vendorNavItems : coupleNavItems) : guestNavItems;

  const isActive = (path: string) => {
    const basePath = path.split('?')[0];
    if (basePath === '/') return location.pathname === '/';
    if (basePath === '/vendor/dashboard' && location.pathname === '/vendor/dashboard') {
      const tabParam = new URLSearchParams(path.split('?')[1]).get('tab');
      const currentTab = new URLSearchParams(location.search).get('tab');
      if (tabParam) return currentTab === tabParam;
      return !currentTab;
    }
    return location.pathname.startsWith(basePath);
  };

  const handleNavClick = (path: string) => {
    const [basePath, query] = path.split('?');
    navigate(query ? `${basePath}?${query}` : basePath);
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 glass-ios-thick"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        borderTop: '0.5px solid hsl(0 0% 100% / 0.5)',
      }}
    >
      <div className="flex items-center justify-around h-16 px-1">
        {navItems.map((item) => {
          const active = isActive(item.path);

          return (
            <button
              key={item.path}
              onClick={() => handleNavClick(item.path)}
              className={cn(
                "relative flex flex-col items-center justify-center gap-0.5 flex-1 h-full",
                "transition-all duration-200 active:scale-90"
              )}
              style={{ transitionTimingFunction: 'var(--ease-spring)' }}
            >
              {/* Active glass pill background */}
              {active && (
                <div 
                  className="absolute inset-x-2 top-1.5 bottom-1.5 rounded-2xl"
                  style={{
                    background: 'hsl(var(--primary) / 0.08)',
                    backdropFilter: 'blur(10px)',
                    border: '0.5px solid hsl(var(--primary) / 0.15)',
                  }}
                />
              )}
              
              <div className="relative z-10">
                <item.icon
                  className={cn(
                    "h-5 w-5 transition-all duration-200",
                    active ? "text-primary scale-110" : "text-muted-foreground"
                  )}
                  strokeWidth={active ? 2.2 : 1.8}
                />
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 flex items-center justify-center bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full shadow-sm">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>
              <span className={cn(
                "relative z-10 text-[10px] font-medium transition-all duration-200",
                active ? "text-primary font-semibold" : "text-muted-foreground"
              )}>
                {item.label}
              </span>
              
              {/* Glowing dot indicator */}
              {active && (
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary shadow-[0_0_6px_2px_hsl(var(--primary)/0.4)]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
