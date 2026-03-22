import { useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import { Star } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const testimonials = [
  {
    name: "Priya & Raj",
    handle: "@priyaraj_wedding",
    text: "Karlo Shaadi made our dream wedding a reality! The verified vendors were professional and the milestone payment system gave us complete peace of mind. No stress, just beautiful memories.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya",
    rating: 5,
  },
  {
    name: "Ananya Sharma",
    handle: "@ananya_bride",
    text: "Best decision ever! Found our photographer, decorator, and caterer all in one place. The fraud protection was a huge relief. Planning a wedding has never been this easy!",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ananya",
    rating: 5,
  },
  {
    name: "Vikram Mehta",
    handle: "@vikram_events",
    text: "As a vendor, joining Karlo Shaadi was game-changing. Direct access to couples, transparent pricing, and secure payments. The platform truly understands both sides of the wedding business.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=vikram",
    rating: 5,
  },
  {
    name: "Meera & Arjun",
    handle: "@meeraarjun2024",
    text: "We planned our destination wedding entirely through Karlo Shaadi. The vendor coordination, payment tracking, and customer support made everything seamless. Highly recommend!",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=meera",
    rating: 5,
  },
  {
    name: "Ravi Kumar",
    handle: "@raviphotography",
    text: "The verification process showed me this platform is serious about quality. I've booked more weddings in 3 months than the entire last year. Great for growing my business!",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ravi",
    rating: 5,
  },
  {
    name: "Kavya Reddy",
    handle: "@kavyaweddings",
    text: "From initial booking to final payment, everything was transparent. The milestone system protected us at every step. Our vendors were amazing and everything was on time!",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=kavya",
    rating: 5,
  }
];

export const ReviewsSection = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start" },
    [AutoScroll({ playOnInit: true, speed: 0.8 })]
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
    <section ref={ref} className="py-16 md:py-24 overflow-hidden relative">
      <div 
        className="container mx-auto px-4 sm:px-6 mb-10"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(16px)',
          transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-muted mb-4">
          <span className="text-muted-foreground font-medium text-sm">Customer Stories</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-semibold mb-2">
          Voices From <span className="text-accent">Happy Couples</span>
        </h2>
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-5 px-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="flex-[0_0_88%] md:flex-[0_0_42%] lg:flex-[0_0_30%] min-w-0"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
                transition: 'all 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
                transitionDelay: `${index * 80}ms`,
              }}
            >
              <div className="relative bg-card rounded-2xl p-6 sm:p-7 h-full flex flex-col shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow duration-200">
                {/* Rating Stars */}
                <div className="flex gap-0.5 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                </div>
                
                <p className="text-muted-foreground leading-relaxed mb-6 flex-grow text-sm">
                  "{testimonial.text}"
                </p>
                
                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full bg-muted"
                  />
                  <div>
                    <p className="font-semibold text-foreground text-sm">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.handle}</p>
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
