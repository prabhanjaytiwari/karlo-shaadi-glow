import { type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CircularIconButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  variant?: 'cream' | 'maroon' | 'gold';
}

const variantStyles = {
  cream: 'bg-secondary text-primary',
  maroon: 'bg-primary/10 text-primary',
  gold: 'bg-accent/10 text-accent',
};

export function CircularIconButton({ icon: Icon, label, onClick, variant = 'cream' }: CircularIconButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1.5 active:scale-95 transition-transform"
    >
      <div className={cn(
        'w-12 h-12 rounded-full flex items-center justify-center transition-colors',
        variantStyles[variant]
      )}>
        <Icon className="h-5 w-5" />
      </div>
      <span className="text-[11px] font-medium text-foreground text-center leading-tight max-w-[64px]">
        {label}
      </span>
    </button>
  );
}
