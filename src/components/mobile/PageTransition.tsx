import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

interface PageTransitionProps {
  children: ReactNode;
}

const mobileVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

const desktopVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export function PageTransition({ children }: PageTransitionProps) {
  const isMobile = useIsMobile();

  return (
    <motion.div
      variants={isMobile ? mobileVariants : desktopVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{
        type: isMobile ? 'spring' : 'tween',
        stiffness: 300,
        damping: 30,
        duration: isMobile ? undefined : 0.2,
      }}
    >
      {children}
    </motion.div>
  );
}
