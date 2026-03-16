import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { ReactNode } from 'react';

interface MobilePageHeaderProps {
  title: string;
  showBack?: boolean;
  rightActions?: ReactNode;
  className?: string;
}

export function MobilePageHeader({ title, showBack = true, rightActions, className }: MobilePageHeaderProps) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  return (
    <header
      className={cn(
        "sticky top-0 z-40 flex items-center h-12 px-4 glass-ios-thick",
        className
      )}
      style={{
        borderBottom: '0.5px solid hsl(0 0% 100% / 0.4)',
      }}
    >
      {showBack && (
        <button
          onClick={() => {
            if (window.history.state?.idx > 0) {
              navigate(-1);
            } else {
              navigate('/');
            }
          }}
          className="flex items-center justify-center w-8 h-8 -ml-1 rounded-full glass-ios-thin active:scale-90 transition-transform"
          style={{ transitionTimingFunction: 'var(--ease-spring)' }}
          aria-label="Go back"
        >
          <ArrowLeft className="h-4.5 w-4.5 text-foreground" />
        </button>
      )}

      <h1 className={cn(
        "text-base font-semibold text-foreground truncate",
        showBack ? "ml-2.5" : "ml-0"
      )}>
        {title}
      </h1>

      {rightActions && (
        <div className="ml-auto flex items-center gap-1">
          {rightActions}
        </div>
      )}
    </header>
  );
}
