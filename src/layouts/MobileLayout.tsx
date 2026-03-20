import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { useCapacitor } from '@/hooks/useCapacitor';
import { useIsMobile } from '@/hooks/use-mobile';
import { BottomNavigation } from '@/components/mobile/BottomNavigation';

// Routes where the bottom nav should NOT appear
const NO_BOTTOM_NAV_ROUTES = [
  '/auth',
  '/vendor-auth',
  '/forgot-password',
  '/reset-password',
  '/onboarding',
  '/vendor/onboarding',
  '/vendor-onboarding',
];

interface MobileLayoutProps {
  children: ReactNode;
  hideBottomNav?: boolean;
}

export function MobileLayout({ children, hideBottomNav = false }: MobileLayoutProps) {
  const { isNative, platform } = useCapacitor();
  const isMobile = useIsMobile();
  const location = useLocation();

  const isNoNavRoute = NO_BOTTOM_NAV_ROUTES.some(r => location.pathname === r || location.pathname.startsWith(r));

  // Show bottom nav only on mobile/native, when not in a no-nav route, and not explicitly hidden
  const showBottomNav = !hideBottomNav && !isNoNavRoute && (isMobile || isNative);

  return (
    <div
      className="min-h-screen"
      style={{
        paddingTop: isNative ? 'env(safe-area-inset-top, 0px)' : undefined,
        paddingBottom: showBottomNav ? 'calc(4rem + env(safe-area-inset-bottom, 0px))' : undefined,
      }}
    >
      <main>
        {children}
      </main>

      {showBottomNav && <BottomNavigation />}
    </div>
  );
}
