import { useState } from 'react';
import { Plus, X, Search, Image, Calendar, Calculator } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const quickActions = [
  { icon: Search, label: 'Find Vendors', path: '/search', color: 'bg-primary' },
  { icon: Image, label: 'Create Invite', path: '/invite-creator', color: 'bg-accent' },
  { icon: Calculator, label: 'Budget', path: '/budget-calculator', color: 'bg-emerald-500' },
  { icon: Calendar, label: 'Muhurat', path: '/muhurat-finder', color: 'bg-violet-500' },
];

export function QuickActionFAB() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Action items */}
      <AnimatePresence>
        {open && (
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[61] flex flex-col items-center gap-3">
            {quickActions.map((action, i) => (
              <motion.button
                key={action.path}
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.8 }}
                transition={{ delay: i * 0.05, type: 'spring', stiffness: 400, damping: 25 }}
                onClick={() => {
                  navigate(action.path);
                  setOpen(false);
                }}
                className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-background border border-border shadow-lg active:scale-95 transition-transform"
              >
                <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-white", action.color)}>
                  <action.icon className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium text-foreground whitespace-nowrap">{action.label}</span>
              </motion.button>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* FAB button */}
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "fixed z-[62] w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 active:scale-90",
          "bottom-[calc(4rem+env(safe-area-inset-bottom,0px)+0.5rem)] left-1/2 -translate-x-1/2",
          open
            ? "bg-muted-foreground rotate-45"
            : "bg-gradient-to-br from-amber-400 to-amber-600 shadow-amber-400/40 shadow-lg"
        )}
        aria-label={open ? "Close quick actions" : "Quick actions"}
      >
        {open ? (
          <X className="h-5 w-5 text-white" />
        ) : (
          <Plus className="h-5 w-5 text-primary-foreground" />
        )}
      </button>
    </>
  );
}
