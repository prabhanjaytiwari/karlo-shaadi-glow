import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Search, Wrench, Calendar, User, LogIn } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useCapacitor } from '@/hooks/useCapacitor';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface NavItem {
  icon: typeof Home;
  label: string;
  path: string;
}

export function BottomNavigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { isNative } = useCapacitor();
  const [user, setUser] = useState<any>(null);
  const [isVendor, setIsVendor] = useState(false);

  useEffect(() => {
    checkAuth();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) checkVendorRole();
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

  if (!isMobile && !isNative) return null;

  const vendorNavItems: NavItem[] = [
    { icon: Home, label: 'Home', path: '/vendor/dashboard' },
    { icon: Search, label: 'Inquiries', path: '/vendor/dashboard?tab=inquiries' },
    { icon: Wrench, label: 'Tools', path: '/tools' },
    { icon: Calendar, label: 'Bookings', path: '/vendor/dashboard?tab=bookings' },
    { icon: User, label: 'Profile', path: '/vendor/dashboard?tab=profile' },
  ];

  const coupleNavItems: NavItem[] = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Vendors', path: '/search' },
    { icon: Wrench, label: 'Tools', path: '/tools' },
    { icon: Calendar, label: 'Bookings', path: '/bookings' },
    { icon: User, label: 'Profile', path: '/dashboard' },
  ];

  const guestNavItems: NavItem[] = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Vendors', path: '/search' },
    { icon: Wrench, label: 'Tools', path: '/tools' },
    { icon: Calendar, label: 'Categories', path: '/categories' },
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
      className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-t border-border"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="flex items-center justify-around h-[60px] px-1">
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
            >
              <div className={cn(
                "w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200",
                active
                  ? "bg-primary text-primary-foreground scale-105"
                  : "text-muted-foreground"
              )}>
                <item.icon className="h-[18px] w-[18px]" />
              </div>
              <span className={cn(
                "text-[10px] transition-all duration-200",
                active ? "font-semibold text-primary" : "font-medium text-muted-foreground"
              )}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
