import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Search, Calendar, MessageSquare, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useCapacitor } from '@/hooks/useCapacitor';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [pendingBookings, setPendingBookings] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [isVendor, setIsVendor] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      fetchBadgeCounts();
      checkVendorRole();
    }
  }, [user]);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const checkVendorRole = async () => {
    if (!user) return;
    const { data: roles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id);
    setIsVendor(roles?.some(r => r.role === 'vendor') || false);
  };

  const fetchBadgeCounts = async () => {
    if (!user) return;

    // Fetch unread messages
    const { count: msgCount } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('recipient_id', user.id)
      .eq('read', false);
    setUnreadMessages(msgCount || 0);

    // Fetch pending bookings
    const { count: bookingCount } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('couple_id', user.id)
      .eq('status', 'pending');
    setPendingBookings(bookingCount || 0);
  };

  // Only show on mobile devices or in native app
  if (!isMobile && !isNative) return null;

  // Don't show if user is not logged in
  if (!user) return null;

  const navItems: NavItem[] = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Search', path: '/search' },
    { icon: Calendar, label: 'Bookings', path: '/bookings', badge: pendingBookings },
    { icon: MessageSquare, label: 'Messages', path: '/messages', badge: unreadMessages },
    { icon: User, label: 'Profile', path: isVendor ? '/vendor/dashboard' : '/dashboard' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t border-border"
      style={{ 
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "relative flex flex-col items-center justify-center gap-1 flex-1 h-full",
                "transition-all duration-200 active:scale-95",
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
          );
        })}
      </div>
    </nav>
  );
}
