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
    if (user) {
      fetchBadgeCounts();
    }
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

  // Only show on mobile devices or in native app
  if (!isMobile && !isNative) return null;

  // Vendor nav items
  const vendorNavItems: NavItem[] = [
    { icon: Home, label: 'Home', path: '/vendor/dashboard' },
    { icon: FileQuestion, label: 'Inquiries', path: '/vendor/dashboard?tab=inquiries' },
    // Center gap for FAB
    { icon: Calendar, label: 'Bookings', path: '/vendor/dashboard?tab=bookings', badge: pendingBookings },
    { icon: MessageSquare, label: 'Messages', path: '/vendor/dashboard?tab=messages', badge: unreadMessages },
    { icon: User, label: 'Profile', path: '/vendor/dashboard?tab=profile' },
  ];

  // Logged-in couple nav items
  const coupleNavItems: NavItem[] = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Vendors', path: '/search' },
    { icon: Calendar, label: 'Bookings', path: '/bookings', badge: pendingBookings },
    { icon: MessageSquare, label: 'Messages', path: '/messages', badge: unreadMessages },
    { icon: User, label: 'Profile', path: '/dashboard' },
  ];

  // Guest nav items
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
      // For vendor tabs, check the tab query param
      const tabParam = new URLSearchParams(path.split('?')[1]).get('tab');
      const currentTab = new URLSearchParams(location.search).get('tab');
      if (tabParam) return currentTab === tabParam;
      return !currentTab; // Home tab = no tab param
    }
    return location.pathname.startsWith(basePath);
  };

  const handleNavClick = (path: string) => {
    const [basePath, query] = path.split('?');
    if (query) {
      navigate(`${basePath}?${query}`);
    } else {
      navigate(basePath);
    }
  };

  return (

      <nav
        className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t border-border"
        style={{
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}
      >
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.map((item, index) => {
            const active = isActive(item.path);

            // Insert spacer in the center for FAB (between item 2 and 3)
            const showSpacer = index === 2 && user;

            return (
              <div key={item.path} className="contents">
                {showSpacer && <div className="w-14 flex-shrink-0" />}
                <button
                  onClick={() => handleNavClick(item.path)}
                  className={cn(
                    "relative flex flex-col items-center justify-center gap-1 flex-1 h-full",
                    "transition-all duration-200 active:scale-90",
                    active ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  <div className="relative">
                    <item.icon
                      className={cn(
                        "h-5 w-5 transition-all duration-200",
                        active && "scale-110"
                      )}
                    />
                    {item.badge && item.badge > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-1 flex items-center justify-center bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full">
                        {item.badge > 99 ? '99+' : item.badge}
                      </span>
                    )}
                  </div>
                  <span className={cn(
                    "text-[10px] font-medium transition-all duration-200",
                    active && "font-semibold"
                  )}>
                    {item.label}
                  </span>
                  {active && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </nav>
  );
}
