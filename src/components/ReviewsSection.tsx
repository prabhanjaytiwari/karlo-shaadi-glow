import { useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Priya & Raj",
    handle: "@priyaraj_wedding",
    text: "Karlo Shaadi made our dream wedding a reality! The verified vendors were professional and the milestone payment system gave us complete peace of mind. No stress, just beautiful memories.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya"
  },
  {
    name: "Ananya Sharma",
    handle: "@ananya_bride",
    text: "Best decision ever! Found our photographer, decorator, and caterer all in one place. The fraud protection was a huge relief. Planning a wedding has never been this easy!",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ananya"
  },
  {
    name: "Vikram Mehta",
    handle: "@vikram_events",
    text: "As a vendor, joining Karlo Shaadi was game-changing. Direct access to couples, transparent pricing, and secure payments. The platform truly understands both sides of the wedding business.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=vikram"
  },
  {
    name: "Meera & Arjun",
    handle: "@meeraarjun2024",
    text: "We planned our destination wedding entirely through Karlo Shaadi. The vendor coordination, payment tracking, and customer support made everything seamless. Highly recommend!",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=meera"
  },
  {
    name: "Ravi Kumar",
    handle: "@raviphotography",
    text: "The verification process showed me this platform is serious about quality. I've booked more weddings in 3 months than the entire last year. Great for growing my business!",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ravi"
  },
  {
    name: "Kavya Reddy",
    handle: "@kavyaweddings",
    text: "From initial booking to final payment, everything was transparent. The milestone system protected us at every step. Our vendors were amazing and everything was on time!",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=kavya"
  }
];

export const ReviewsSection = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start" },
    [AutoScroll({ playOnInit: true, speed: 1 })]
  );

  useEffect(() => {
    if (emblaApi) {
      // Optional: pause on hover
      const emblaNode = emblaApi.rootNode();
      emblaNode.addEventListener("mouseenter", () => emblaApi.plugins().autoScroll?.stop());
      emblaNode.addEventListener("mouseleave", () => emblaApi.plugins().autoScroll?.play());
    }
  }, [emblaApi]);

  return (
    <section className="py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-6 mb-12">
        <p className="text-accent text-center text-sm font-medium mb-4">
          The Karlo Shaadi Experience
        </p>
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
          Voices From Happy Couples
        </h2>
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="flex-[0_0_90%] md:flex-[0_0_45%] lg:flex-[0_0_30%] min-w-0"
            >
              <div className="bg-card border border-border/50 rounded-2xl p-8 h-full flex flex-col">
                <Quote className="text-accent mb-4" size={32} />
                <p className="text-muted-foreground leading-relaxed mb-8 flex-grow">
                  {testimonial.text}
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.handle}</p>
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
