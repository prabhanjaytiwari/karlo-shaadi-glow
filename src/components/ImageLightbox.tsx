import { useState, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageLightboxProps {
  images: string[];
  initialIndex?: number;
  open: boolean;
  onClose: () => void;
}

export function ImageLightbox({ images, initialIndex = 0, open, onClose }: ImageLightboxProps) {
  const [index, setIndex] = useState(initialIndex);

  useEffect(() => {
    if (open) setIndex(initialIndex);
  }, [open, initialIndex]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && index < images.length - 1) setIndex(i => i + 1);
      if (e.key === 'ArrowLeft' && index > 0) setIndex(i => i - 1);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, index, images.length, onClose]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (Math.abs(info.offset.y) > 100) {
      onClose();
    } else if (info.offset.x < -50 && index < images.length - 1) {
      setIndex(i => i + 1);
    } else if (info.offset.x > 50 && index > 0) {
      setIndex(i => i - 1);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[300] bg-black flex items-center justify-center"
          onClick={onClose}
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-[calc(env(safe-area-inset-top,0px)+1rem)] right-4 z-10 p-2 rounded-full bg-white/10 text-white backdrop-blur-sm"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Counter */}
          <div className="absolute top-[calc(env(safe-area-inset-top,0px)+1rem)] left-4 z-10 text-white/70 text-sm font-medium">
            {index + 1} / {images.length}
          </div>

          {/* Image */}
          <motion.img
            key={index}
            src={images[index]}
            alt=""
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            drag
            dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
            dragElastic={0.3}
            onDragEnd={handleDragEnd}
            onClick={e => e.stopPropagation()}
            className="max-w-full max-h-full object-contain select-none touch-none"
          />

          {/* Desktop nav arrows */}
          {index > 0 && (
            <button
              onClick={e => { e.stopPropagation(); setIndex(i => i - 1); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 text-white backdrop-blur-sm hidden sm:block"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}
          {index < images.length - 1 && (
            <button
              onClick={e => { e.stopPropagation(); setIndex(i => i + 1); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 text-white backdrop-blur-sm hidden sm:block"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
