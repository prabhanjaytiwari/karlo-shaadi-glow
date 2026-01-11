import { useEffect, useState } from 'react';
import { useCapacitor } from '@/hooks/useCapacitor';
import logo from '@/assets/logo-new.png';

export function SplashScreen() {
  const { isNative } = useCapacitor();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Only show custom splash for web/PWA, native has its own splash
    if (isNative) {
      setVisible(false);
      return;
    }

    // Fade out after app loads
    const timer = setTimeout(() => {
      setVisible(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [isNative]);

  if (!visible) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-rose-50 via-white to-amber-50 transition-opacity duration-500"
      style={{ 
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none'
      }}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-rose-200/20 rounded-full blur-2xl" />
      </div>

      {/* Logo */}
      <div className="relative animate-pulse">
        <img 
          src={logo} 
          alt="Karlo Shaadi" 
          className="h-20 w-auto drop-shadow-lg"
        />
      </div>

      {/* Tagline */}
      <p className="mt-6 text-sm text-muted-foreground font-medium tracking-wide">
        Your Dream Wedding, Simplified
      </p>

      {/* Loading indicator */}
      <div className="mt-8 flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
