import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useCapacitor } from '@/hooks/useCapacitor';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Crown } from 'lucide-react';
import { cdn } from "@/lib/cdnAssets";

export function SplashScreen() {
  const { isNative } = useCapacitor();
  const location = useLocation();
  const [visible, setVisible] = useState(true);

  const isVendorRoute = location.pathname.startsWith('/vendor') || location.pathname === '/vendor-auth';

  useEffect(() => {
    if (isNative) {
      setVisible(false);
      return;
    }
    const timer = setTimeout(() => setVisible(false), 2000);
    return () => clearTimeout(timer);
  }, [isNative]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          style={{
            background: isVendorRoute
              ? 'linear-gradient(165deg, hsl(270 15% 8%) 0%, hsl(260 20% 12%) 40%, hsl(38 30% 15%) 80%, hsl(270 15% 10%) 100%)'
              : 'linear-gradient(165deg, hsl(340 30% 97%) 0%, hsl(330 35% 95%) 40%, hsl(280 25% 95%) 70%, hsl(340 20% 96%) 100%)',
          }}
        >
          {/* Ambient glow */}
          <motion.div
            className="absolute w-80 h-80 rounded-full opacity-30"
            style={{
              background: isVendorRoute
                ? 'radial-gradient(circle, hsl(38 80% 50% / 0.2), transparent)'
                : 'radial-gradient(circle, hsl(340 60% 80% / 0.4), transparent)',
              top: '15%',
              right: '-10%',
            }}
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute w-60 h-60 rounded-full opacity-20"
            style={{
              background: isVendorRoute
                ? 'radial-gradient(circle, hsl(280 40% 40% / 0.2), transparent)'
                : 'radial-gradient(circle, hsl(280 40% 80% / 0.3), transparent)',
              bottom: '10%',
              left: '-5%',
            }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          />

          {/* Logo container */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
            className="relative z-10"
          >
            <div
              className="w-24 h-24 rounded-[1.75rem] flex items-center justify-center shadow-2xl"
              style={{
                background: isVendorRoute
                  ? 'linear-gradient(135deg, hsl(38 80% 50% / 0.15), hsl(270 20% 15%))'
                  : 'rgba(255,255,255,0.75)',
                backdropFilter: 'blur(20px)',
                border: isVendorRoute
                  ? '1px solid hsl(38 60% 50% / 0.3)'
                  : '1px solid rgba(255,255,255,0.5)',
              }}
            >
              <img
                src={cdn.logo}
                alt="Karlo Shaadi"
                className="h-16 w-auto"
                style={{ mixBlendMode: isVendorRoute ? 'normal' : 'multiply' }}
              />
            </div>
          </motion.div>

          {/* Brand name */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className={`relative z-10 mt-6 text-xl font-bold tracking-tight ${isVendorRoute ? 'text-white' : 'text-foreground'}`}
          >
            Karlo Shaadi
          </motion.h1>

          {/* Role-specific tagline with icon */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.5 }}
            className="relative z-10 mt-2 flex items-center gap-1.5"
          >
            {isVendorRoute ? (
              <>
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <p className="text-sm text-white/60 font-medium">Grow Your Wedding Business</p>
              </>
            ) : (
              <>
                <Heart className="w-3.5 h-3.5 text-primary fill-primary" />
                <p className="text-sm text-muted-foreground font-medium">Your Dream Wedding, Simplified</p>
              </>
            )}
          </motion.div>

          {/* Loading indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="relative z-10 mt-10 flex gap-1.5"
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className={`w-1.5 h-1.5 rounded-full ${isVendorRoute ? 'bg-amber-400/40' : 'bg-foreground/25'}`}
                animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
