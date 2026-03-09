import { useEffect, useState } from 'react';
import { useCapacitor } from '@/hooks/useCapacitor';
import logo from '@/assets/logo-new.png';
import { motion, AnimatePresence } from 'framer-motion';

export function SplashScreen() {
  const { isNative } = useCapacitor();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (isNative) {
      setVisible(false);
      return;
    }
    const timer = setTimeout(() => setVisible(false), 1800);
    return () => clearTimeout(timer);
  }, [isNative]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: 'linear-gradient(165deg, hsl(280 30% 96%) 0%, hsl(330 40% 95%) 30%, hsl(340 50% 92%) 55%, hsl(300 35% 90%) 80%, hsl(260 30% 93%) 100%)' }}
        >
          {/* Floating orbs */}
          <motion.div
            className="absolute w-72 h-72 rounded-full opacity-30"
            style={{ background: 'radial-gradient(circle, hsl(330 60% 85%), transparent)', top: '-5%', right: '-10%' }}
            animate={{ scale: [1, 1.15, 1], x: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute w-56 h-56 rounded-full opacity-25"
            style={{ background: 'radial-gradient(circle, hsl(280 50% 82%), transparent)', bottom: '5%', left: '-8%' }}
            animate={{ scale: [1, 1.2, 1], y: [0, -15, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          />
          <motion.div
            className="absolute w-40 h-40 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, hsl(340 55% 80%), transparent)', top: '40%', left: '60%' }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          />

          {/* Logo */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
            className="relative z-10"
          >
            <div className="w-24 h-24 rounded-[1.75rem] bg-white/70 backdrop-blur-xl shadow-lg shadow-primary/10 flex items-center justify-center">
              <img
                src={logo}
                alt="Karlo Shaadi"
                className="h-16 w-auto"
                style={{ mixBlendMode: 'multiply' }}
              />
            </div>
          </motion.div>

          {/* Brand name */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="relative z-10 mt-6 text-xl font-semibold tracking-tight text-foreground"
          >
            Karlo Shaadi
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="relative z-10 mt-2 text-sm text-muted-foreground font-medium"
          >
            Your Dream Wedding, Simplified
          </motion.p>

          {/* Loading dots */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="relative z-10 mt-10 flex gap-2"
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-foreground/30"
                animate={{ opacity: [0.3, 1, 0.3], scale: [0.85, 1.1, 0.85] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2, ease: 'easeInOut' }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
