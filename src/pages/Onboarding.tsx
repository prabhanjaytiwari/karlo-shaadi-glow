import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useEmblaCarousel from 'embla-carousel-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const ONBOARDING_KEY = 'karlo-onboarding-seen';

const slides = [
  {
    emoji: '💍',
    orbs: ['🏛️', '📸', '🎶', '🎂', '💐', '💄', '🪔', '🎊'],
    title: 'Discover Vendors',
    subtitle: 'Browse 10,000+ verified wedding vendors across India.',
    bg: 'linear-gradient(165deg, hsl(280 30% 96%) 0%, hsl(330 40% 94%) 40%, hsl(340 45% 91%) 70%, hsl(300 30% 93%) 100%)',
  },
  {
    emoji: '✨',
    orbs: ['📋', '💰', '📅', '👗', '🎵', '📝', '🗓️', '🤖'],
    title: 'Plan Your Shaadi',
    subtitle: 'Budget, guest list, muhurat finder, and more — all free.',
    bg: 'linear-gradient(165deg, hsl(340 35% 95%) 0%, hsl(20 40% 94%) 40%, hsl(38 50% 92%) 70%, hsl(340 30% 94%) 100%)',
  },
  {
    emoji: '🛡️',
    orbs: ['⭐', '💳', '📄', '🔒', '✅', '💬', '📞', '🏆'],
    title: 'Book With Confidence',
    subtitle: 'Secure payments, real reviews & cancellation protection.',
    bg: 'linear-gradient(165deg, hsl(260 30% 96%) 0%, hsl(280 35% 93%) 40%, hsl(320 40% 92%) 70%, hsl(260 25% 95%) 100%)',
  },
  {
    emoji: '🎊',
    orbs: ['❤️', '🥂', '🎉', '👫', '🌸', '✨', '💕', '🙏'],
    title: 'Your Shaadi, Simplified',
    subtitle: 'Join 50,000+ couples who planned stress-free weddings.',
    bg: 'linear-gradient(165deg, hsl(330 35% 95%) 0%, hsl(340 45% 92%) 40%, hsl(350 40% 90%) 70%, hsl(280 30% 94%) 100%)',
  },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, dragFree: false });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    onSelect();
    return () => { emblaApi.off('select', onSelect); };
  }, [emblaApi, onSelect]);

  const finish = () => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    navigate('/');
  };

  const next = () => {
    if (!canScrollNext) finish();
    else emblaApi?.scrollNext();
  };

  const isLast = selectedIndex === slides.length - 1;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col" style={{ background: slides[selectedIndex].bg }}>
      {/* Skip */}
      <div className="flex justify-end p-4 pt-[calc(env(safe-area-inset-top,0px)+1rem)]">
        <Button variant="ghost" size="sm" onClick={finish} className="text-muted-foreground/70 text-xs hover:text-foreground">
          Skip
        </Button>
      </div>

      {/* Carousel */}
      <div className="flex-1 overflow-hidden" ref={emblaRef}>
        <div className="flex h-full">
          {slides.map((slide, i) => (
            <div key={i} className="flex-[0_0_100%] min-w-0 flex flex-col items-center justify-center px-8 text-center">
              <AnimatePresence mode="wait">
                {selectedIndex === i && (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                    className="flex flex-col items-center"
                  >
                    {/* Orbiting emojis ring */}
                    <div className="relative w-48 h-48 mb-10">
                      {/* Central emoji */}
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <div className="w-20 h-20 rounded-[1.25rem] bg-white/70 backdrop-blur-lg shadow-lg flex items-center justify-center">
                          <span className="text-4xl">{slide.emoji}</span>
                        </div>
                      </motion.div>

                      {/* Orbiting items */}
                      {slide.orbs.map((orb, oi) => {
                        const angle = (oi / slide.orbs.length) * Math.PI * 2 - Math.PI / 2;
                        const radius = 80;
                        const x = Math.cos(angle) * radius;
                        const y = Math.sin(angle) * radius;
                        const size = oi % 3 === 0 ? 'w-10 h-10 text-lg' : oi % 3 === 1 ? 'w-9 h-9 text-base' : 'w-8 h-8 text-sm';
                        return (
                          <motion.div
                            key={oi}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.15 + oi * 0.06, type: 'spring', stiffness: 300, damping: 20 }}
                            className={`absolute ${size} rounded-xl bg-white/60 backdrop-blur-sm shadow-md flex items-center justify-center`}
                            style={{
                              left: `calc(50% + ${x}px - 1rem)`,
                              top: `calc(50% + ${y}px - 1rem)`,
                            }}
                          >
                            {orb}
                          </motion.div>
                        );
                      })}
                    </div>

                    <h2 className="text-2xl font-bold mb-3 tracking-tight text-foreground">
                      {slide.title}
                    </h2>
                    <p className="text-muted-foreground text-base leading-relaxed max-w-[280px]">
                      {slide.subtitle}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {/* Dots + CTA */}
      <div className="pb-[calc(env(safe-area-inset-bottom,0px)+2rem)] px-8 space-y-6">
        <div className="flex justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === selectedIndex ? 'w-8 bg-foreground' : 'w-2 bg-foreground/20'
              }`}
            />
          ))}
        </div>

        <Button
          onClick={next}
          size="lg"
          className="w-full rounded-2xl h-14 text-base font-semibold gap-2 bg-foreground text-background hover:bg-foreground/90 shadow-xl"
        >
          {isLast ? 'Get Started' : 'Next'}
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

export { ONBOARDING_KEY };
