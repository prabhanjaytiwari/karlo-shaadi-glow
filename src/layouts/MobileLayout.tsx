import { ReactNode, useEffect, useState } from 'react';
import { useCapacitor } from '@/hooks/useCapacitor';
import { useIsMobile } from '@/hooks/use-mobile';
import { BottomNavigation } from '@/components/mobile/BottomNavigation';
import { supabase } from '@/integrations/supabase/client';

interface MobileLayoutProps {
  children: ReactNode;
  hideBottomNav?: boolean;
}

export function MobileLayout({ children, hideBottomNav = false }: MobileLayoutProps) {
  const { isNative, platform } = useCapacitor();
  const isMobile = useIsMobile();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkAuth();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  // Calculate if we should show bottom navigation
  const showBottomNav = !hideBottomNav && user && (isMobile || isNative);

  return (
    <div 
      className="min-h-screen"
      style={{
        // Add safe area padding for native apps
        paddingTop: isNative ? 'env(safe-area-inset-top, 0px)' : undefined,
        // Add bottom padding when bottom nav is shown
        paddingBottom: showBottomNav ? 'calc(4rem + env(safe-area-inset-bottom, 0px))' : undefined,
      }}
    >
      {/* Main content */}
      <main className={isNative && platform === 'ios' ? 'pt-safe' : ''}>
        {children}
      </main>

      {/* Bottom Navigation for mobile/native */}
      {showBottomNav && <BottomNavigation />}
    </div>
  );
}
