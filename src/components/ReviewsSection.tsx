import { useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import { Quote, Star } from "lucide-react";
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
    <section ref={ref} className="py-24 bg-background overflow-hidden relative">
      {/* Premium Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <div className="absolute top-1/3 left-10 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      </div>
      
      <div 
        className="container mx-auto px-6 mb-12"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div className="inline-block mb-4">
          <div className="px-4 py-2 rounded-lg bg-card/80 backdrop-blur-md border border-accent/20">
            <span className="text-accent text-sm font-medium">Customer Stories</span>
          </div>
        </div>
        <h2 className="text-3xl md:text-4xl font-semibold mb-4">
          Voices From <span className="text-accent">Happy Couples</span>
        </h2>
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-6 px-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="flex-[0_0_90%] md:flex-[0_0_45%] lg:flex-[0_0_30%] min-w-0"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
                transition: 'all 0.8s cubic-bezier(0.22, 1, 0.36, 1)',
                transitionDelay: `${index * 100}ms`,
              }}
            >
              {/* Premium Glass Card */}
              <div className="group relative h-full">
                {/* Gradient Border on Hover */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-accent/50 via-primary/50 to-accent/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
                
                <div className="relative bg-card/60 backdrop-blur-xl border border-white/10 group-hover:border-transparent rounded-2xl p-8 h-full flex flex-col transition-all duration-500 group-hover:shadow-[0_20px_60px_hsl(var(--accent)/0.15)]">
                  {/* Quote Icon with Glow */}
                  <div className="relative inline-block mb-4">
                    <div className="absolute -inset-2 bg-accent/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <Quote className="relative text-accent group-hover:scale-110 transition-transform duration-500" size={32} />
                  </div>
                  
                  {/* Rating Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star 
                        key={i} 
                        className="h-4 w-4 fill-accent text-accent" 
                        style={{ 
                          animationDelay: `${i * 100}ms`,
                          opacity: isVisible ? 1 : 0,
                          transition: 'opacity 0.3s ease-out',
                          transitionDelay: `${(index * 100) + (i * 50)}ms`,
                        }} 
                      />
                    ))}
                  </div>
                  
                  <p className="text-muted-foreground leading-relaxed mb-8 flex-grow group-hover:text-foreground/80 transition-colors duration-300">
                    "{testimonial.text}"
                  </p>
                  
                  <div className="flex items-center gap-4">
                    {/* Avatar with Ring */}
                    <div className="relative">
                      <div className="absolute -inset-1 bg-gradient-to-r from-accent to-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="relative w-12 h-12 rounded-full ring-2 ring-white/10 group-hover:ring-accent/50 transition-all duration-300"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground group-hover:text-accent transition-colors duration-300">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.handle}</p>
                    </div>
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
