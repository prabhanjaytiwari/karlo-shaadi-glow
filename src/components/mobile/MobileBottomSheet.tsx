import { ReactNode } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/use-mobile';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface MobileBottomSheetProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  trigger?: ReactNode;
  children: ReactNode;
  /** Use dialog on desktop, drawer on mobile. Defaults to true. */
  adaptiveDesktop?: boolean;
}

/**
 * On mobile: renders a swipeable bottom sheet (vaul Drawer).
 * On desktop: renders a centered Dialog (or passes through based on adaptiveDesktop).
 */
export function MobileBottomSheet({
  open,
  onOpenChange,
  title,
  trigger,
  children,
  adaptiveDesktop = true,
}: MobileBottomSheetProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        {trigger && <DrawerTrigger asChild>{trigger}</DrawerTrigger>}
        <DrawerContent className="max-h-[85vh]">
          {title && (
            <DrawerHeader className="pb-2">
              <DrawerTitle>{title}</DrawerTitle>
            </DrawerHeader>
          )}
          <div className="px-4 pb-6 overflow-y-auto">{children}</div>
        </DrawerContent>
      </Drawer>
    );
  }

  if (!adaptiveDesktop) {
    // On desktop without adaptation, just render children (caller handles layout)
    return <>{children}</>;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent>
        {title && (
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
        )}
        {children}
      </DialogContent>
    </Dialog>
  );
}
