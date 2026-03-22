import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useEmblaCarousel from 'embla-carousel-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Search, Calendar, Shield, Heart } from 'lucide-react';
import onboardingHero from '@/assets/onboarding-couple-hero.jpg';

const ONBOARDING_KEY = 'karlo-onboarding-seen';

const slides = [
  {
    icon: <Search className="w-7 h-7" />,
    title: 'Discover Vendors',
    subtitle: 'Browse 10,000+ verified wedding vendors across India.',
    accent: 'hsl(340 65% 55%)',
  },
  {
    icon: <Calendar className="w-7 h-7" />,
    title: 'Plan Your Shaadi',
    subtitle: 'Budget, guest list, muhurat finder, and more — all free.',
    accent: 'hsl(38 80% 55%)',
  },
  {
    icon: <Shield className="w-7 h-7" />,
    title: 'Book With Confidence',
    subtitle: 'Secure payments, real reviews & cancellation protection.',
    accent: 'hsl(160 60% 45%)',
  },
  {
    icon: <Heart className="w-7 h-7" />,
    title: 'Your Shaadi, Simplified',
    subtitle: 'Join 50,000+ couples who planned stress-free weddings.',
    accent: 'hsl(340 65% 55%)',
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
    <div className="fixed inset-0 z-[100] flex flex-col bg-background">
      {/* Skip */}
      <div className="flex justify-end p-4 pt-[calc(env(safe-area-inset-top,0px)+1rem)]">
        <Button variant="ghost" size="sm" onClick={finish} className="text-muted-foreground text-xs hover:text-foreground">
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
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="flex flex-col items-center"
                  >
                    {/* Hero image card with glassmorphism */}
                    <div className="relative w-56 h-56 mb-8 rounded-3xl overflow-hidden shadow-2xl">
                      <img
                        src={onboardingHero}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      {/* Icon floating on glass card */}
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
                        className="absolute bottom-4 left-1/2 -translate-x-1/2"
                      >
                        <div
                          className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl"
                          style={{
                            background: `linear-gradient(135deg, ${slide.accent}, ${slide.accent}dd)`,
                            backdropFilter: 'blur(12px)',
                          }}
                        >
                          {slide.icon}
                        </div>
                      </motion.div>
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
