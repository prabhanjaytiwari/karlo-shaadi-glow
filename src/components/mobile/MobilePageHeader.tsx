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
        "sticky top-0 z-40 flex items-center h-12 px-4 bg-background/95 backdrop-blur-xl border-b border-border",
        className
      )}
    >
      {showBack && (
        <button
          onClick={() => {
            // Check if there's router history to go back to
            if (window.history.state?.idx > 0) {
              navigate(-1);
            } else {
              navigate('/');
            }
          }}
          className="flex items-center justify-center w-8 h-8 -ml-1 rounded-full active:scale-95 transition-transform"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
      )}

      <h1 className={cn(
        "text-base font-semibold text-foreground truncate",
        showBack ? "ml-2" : "ml-0"
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
