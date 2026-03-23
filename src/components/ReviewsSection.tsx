import { useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import { Star, Quote } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const testimonials = [
  {
    name: "Sneha & Arjun Kapoor",
    location: "Delhi • Dec 2025",
    text: "Papa kehte the ki shaadi ki planning mein bahut tension hoti hai. Karlo Shaadi ne sab kuch itna easy kar diya — photographer, decorator, caterer — sab verified, sab time pe. Humari family bahut khush hai.",
    category: "Full Wedding Planning",
    rating: 5,
  },
  {
    name: "Ritu & Manish Sharma",
    location: "Jaipur • Nov 2025",
    text: "We planned a destination wedding at a palace in Jaipur for 400 guests. Found every vendor through Karlo Shaadi — from the pandit ji to the fireworks team. The milestone payment system gave our parents complete peace of mind.",
    category: "Destination Wedding",
    rating: 5,
  },
  {
    name: "Kavya Reddy",
    location: "Hyderabad • Vendor",
    text: "As a mehendi artist, this platform changed my business. I went from 3 bookings a month to 12. The verification badge builds instant trust with families. Best decision I made for my career.",
    category: "Mehendi Artist",
    rating: 5,
  },
  {
    name: "Pooja & Vikrant Tiwari",
    location: "Lucknow • Jan 2026",
    text: "Humne apni poori shaadi ka budget ₹8 lakh mein manage kiya — Budget Calculator se sab clear tha. Vendor bhi transparent the, koi hidden cost nahi. Maa-Papa ko bhi bharosa tha har step pe.",
    category: "Budget Wedding",
    rating: 5,
  },
  {
    name: "Amit Saxena Photography",
    location: "Mumbai • Vendor",
    text: "In 6 months on Karlo Shaadi, I've shot 18 weddings. The quality of leads is unmatched — couples come prepared, they know what they want. Zero commission means I keep every rupee I earn.",
    category: "Photographer",
    rating: 5,
  },
  {
    name: "Nidhi & Rahul Gupta",
    location: "Chandigarh • Feb 2026",
    text: "The AI wedding planner gave us a complete plan in 2 minutes — venue suggestions, muhurat dates, budget split, everything. It felt like having a personal wedding coordinator for free. Our sangeet was the talk of the town!",
    category: "AI Planned Wedding",
    rating: 5,
  },
];

export const ReviewsSection = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start" },
    [AutoScroll({ playOnInit: true, speed: 0.6 })]
  );
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });

  useEffect(() => {
    if (emblaApi) {
      const emblaNode = emblaApi.rootNode();
      emblaNode.addEventListener("mouseenter", () => emblaApi.plugins().autoScroll?.stop());
      emblaNode.addEventListener("mouseleave", () => emblaApi.plugins().autoScroll?.play());
    }
  }, [emblaApi]);

  return (
    <section ref={ref} className="py-20 md:py-28 overflow-hidden relative">
      <div
        className="container mx-auto px-4 sm:px-6 mb-12"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(16px)',
          transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div className="text-center">
          <p className="text-accent font-medium text-sm tracking-widest uppercase mb-3">Real Stories</p>
          <h2 className="font-display font-semibold text-3xl md:text-4xl">
            Trusted by Families<br />
            <span className="font-quote italic text-primary">Across India</span>
          </h2>
        </div>
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-5 px-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="flex-[0_0_88%] md:flex-[0_0_42%] lg:flex-[0_0_32%] min-w-0"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
                transition: 'all 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
                transitionDelay: `${index * 80}ms`,
              }}
            >
              <div className="relative bg-card rounded-2xl p-7 h-full flex flex-col shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow duration-300 border border-border/50">
                {/* Quote mark */}
                <Quote className="h-8 w-8 text-accent/20 mb-3" />

                {/* Rating */}
                <div className="flex gap-0.5 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                </div>

                <p className="text-foreground/85 leading-relaxed mb-6 flex-grow text-sm">
                  "{testimonial.text}"
                </p>

                <div className="border-t border-border/50 pt-4">
                  <p className="font-display font-semibold text-foreground text-sm">{testimonial.name}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/8 text-primary font-medium">
                      {testimonial.category}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
