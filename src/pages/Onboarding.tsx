import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useEmblaCarousel from 'embla-carousel-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Search, CalendarCheck, ShieldCheck, ArrowRight } from 'lucide-react';

const ONBOARDING_KEY = 'karlo-onboarding-seen';

const slides = [
  {
    icon: Search,
    emoji: '🔍',
    title: 'Find Perfect Vendors',
    subtitle: 'Browse 10,000+ verified wedding vendors across India',
    gradient: 'from-primary/20 to-accent/10',
  },
  {
    icon: Heart,
    emoji: '💕',
    title: 'Plan Your Dream Wedding',
    subtitle: 'AI-powered tools for budget, guest list, muhurat & more',
    gradient: 'from-accent/20 to-primary/10',
  },
  {
    icon: CalendarCheck,
    emoji: '📅',
    title: 'Book With Confidence',
    subtitle: 'Secure payments, real reviews & cancellation protection',
    gradient: 'from-primary/15 to-accent/15',
  },
  {
    icon: ShieldCheck,
    emoji: '✨',
    title: 'Your Wedding, Simplified',
    subtitle: 'Join 50,000+ couples who planned stress-free shaadis',
    gradient: 'from-accent/10 to-primary/20',
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
    if (!canScrollNext) {
      finish();
    } else {
      emblaApi?.scrollNext();
    }
  };

  const isLast = selectedIndex === slides.length - 1;

  return (
    <div className="fixed inset-0 z-[100] bg-background flex flex-col">
      {/* Skip button */}
      <div className="flex justify-end p-4 pt-[calc(env(safe-area-inset-top,0px)+1rem)]">
        <Button variant="ghost" size="sm" onClick={finish} className="text-muted-foreground text-xs">
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
                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="flex flex-col items-center"
                  >
                    <div className={`w-32 h-32 rounded-[2rem] bg-gradient-to-br ${slide.gradient} flex items-center justify-center mb-8 shadow-lg`}>
                      <span className="text-6xl">{slide.emoji}</span>
                    </div>
                    <h2 className="text-2xl font-bold mb-3 tracking-tight">{slide.title}</h2>
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
        {/* Dots */}
        <div className="flex justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === selectedIndex ? 'w-8 bg-primary' : 'w-2 bg-muted-foreground/30'
              }`}
            />
          ))}
        </div>

        {/* CTA */}
        <Button
          onClick={next}
          size="lg"
          className="w-full rounded-2xl h-14 text-base font-semibold gap-2"
        >
          {isLast ? 'Get Started' : 'Next'}
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

export { ONBOARDING_KEY };
