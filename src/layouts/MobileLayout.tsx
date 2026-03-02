import { ReactNode } from 'react';
import { useCapacitor } from '@/hooks/useCapacitor';
import { useIsMobile } from '@/hooks/use-mobile';
import { BottomNavigation } from '@/components/mobile/BottomNavigation';

interface MobileLayoutProps {
  children: ReactNode;
  hideBottomNav?: boolean;
}

export function MobileLayout({ children, hideBottomNav = false }: MobileLayoutProps) {
  const { isNative, platform } = useCapacitor();
  const isMobile = useIsMobile();

  // Show bottom nav on mobile/native (BottomNavigation handles auth state internally)
  const showBottomNav = !hideBottomNav && (isMobile || isNative);

  return (
    <div 
      className="min-h-screen"
      style={{
        paddingTop: isNative ? 'env(safe-area-inset-top, 0px)' : undefined,
        paddingBottom: showBottomNav ? 'calc(4rem + env(safe-area-inset-bottom, 0px))' : undefined,
      }}
    >
      <main className={isNative && platform === 'ios' ? 'pt-safe' : ''}>
        {children}
      </main>

      {showBottomNav && <BottomNavigation />}
    </div>
  );
}