import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import weddingCouple1 from "@/assets/wedding-couple-1.jpg";
import weddingCouple2 from "@/assets/wedding-couple-2.jpg";
import weddingCoupleRomantic from "@/assets/wedding-couple-romantic.jpg";

const testimonials = [
  {
    id: 1,
    quote: "Karlo Shaadi made our dream wedding a reality. The vendors were amazing and everything was stress-free!",
    couple: "Priya & Rahul",
    location: "Mumbai",
    image: weddingCouple1,
  },
  {
    id: 2,
    quote: "We found the perfect photographer and decorator through this platform. Highly recommend to every couple!",
    couple: "Sneha & Arjun",
    location: "Delhi",
    image: weddingCouple2,
  },
  {
    id: 3,
    quote: "The AI matching feature saved us so much time. We got connected with vendors that truly understood our vision.",
    couple: "Ananya & Vikram",
    location: "Bangalore",
    image: weddingCoupleRomantic,
  },
];

export function TestimonialsCarousel() {
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToPrev = () => {
    setIsAutoPlaying(false);
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrent((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto mt-8 sm:mt-10">
      <div className="relative bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-6 sm:p-8 border border-accent/10">
        {/* Quote Icon */}
        <div className="absolute -top-3 left-6 sm:left-8">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary flex items-center justify-center shadow-lg">
            <Quote className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
          </div>
        </div>

        {/* Testimonial Content */}
        <div className="relative min-h-[140px] sm:min-h-[120px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={testimonials[current].id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              <p className="text-foreground text-sm sm:text-base leading-relaxed italic mb-4 pt-2">
                "{testimonials[current].quote}"
              </p>
              <div className="flex items-center gap-3">
                <img
                  src={testimonials[current].image}
                  alt={testimonials[current].couple}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-primary/20"
                />
                <div>
                  <p className="font-semibold text-foreground text-sm sm:text-base">
                    {testimonials[current].couple}
                  </p>
                  <p className="text-muted-foreground text-xs sm:text-sm">
                    {testimonials[current].location}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          {/* Dots */}
          <div className="flex gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsAutoPlaying(false);
                  setCurrent(index);
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === current
                    ? "bg-primary w-6"
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          {/* Arrows */}
          <div className="flex gap-2">
            <button
              onClick={goToPrev}
              className="w-8 h-8 rounded-full bg-muted/50 hover:bg-muted flex items-center justify-center transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-4 w-4 text-foreground" />
            </button>
            <button
              onClick={goToNext}
              className="w-8 h-8 rounded-full bg-muted/50 hover:bg-muted flex items-center justify-center transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-4 w-4 text-foreground" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
