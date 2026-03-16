import { Link } from "react-router-dom";
import { MapPin, Users } from "lucide-react";
import weddingCouple1 from "@/assets/wedding-couple-1.jpg";
import weddingCouple2 from "@/assets/wedding-couple-2.jpg";
import weddingHaldi from "@/assets/wedding-haldi.jpg";
import weddingBride from "@/assets/wedding-bride.jpg";
import weddingCeremony from "@/assets/wedding-ceremony.jpg";
import weddingDecoration from "@/assets/wedding-decoration.jpg";

const realWeddings = [
  { image: weddingCouple1, couple: "Priya & Raj", city: "Udaipur", vendors: 8, className: "md:col-span-2 md:row-span-2" },
  { image: weddingHaldi, couple: "Ananya & Vikram", city: "Jaipur", vendors: 6, className: "" },
  { image: weddingBride, couple: "Meera & Arjun", city: "Delhi", vendors: 12, className: "" },
  { image: weddingCeremony, couple: "Kavya & Rohit", city: "Mumbai", vendors: 9, className: "" },
  { image: weddingCouple2, couple: "Sneha & Aditya", city: "Lucknow", vendors: 7, className: "" },
  { image: weddingDecoration, couple: "Divya & Karan", city: "Goa", vendors: 5, className: "" },
];

export const RealWeddingsMosaic = () => {
  return (
    <section className="py-12 md:py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-3">
              <span className="text-primary font-medium text-sm">Real Weddings</span>
            </div>
            <h2 className="font-display font-semibold text-2xl md:text-3xl">
              Beautiful Love <span className="text-primary">Stories</span>
            </h2>
          </div>
          <Link
            to="/stories"
            className="hidden md:inline-flex text-sm text-primary font-medium hover:underline underline-offset-4"
          >
            View All Stories →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {realWeddings.map((wedding, index) => (
            <Link
              key={index}
              to="/stories"
              className={`group relative rounded-2xl overflow-hidden ${wedding.className} ${index === 0 ? 'aspect-square' : 'aspect-[3/4]'}`}
            >
              <img
                src={wedding.image}
                alt={wedding.couple}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              {/* Dark gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

              {/* Content overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                <h3 className="text-white font-semibold text-sm md:text-base leading-tight">
                  {wedding.couple}
                </h3>
                <div className="flex items-center gap-3 mt-1">
                  <span className="flex items-center gap-1 text-white/80 text-xs">
                    <MapPin className="h-3 w-3" />
                    {wedding.city}
                  </span>
                  <span className="flex items-center gap-1 text-white/80 text-xs">
                    <Users className="h-3 w-3" />
                    {wedding.vendors} vendors
                  </span>
                </div>
              </div>

              {/* Hover ring */}
              <div className="absolute inset-0 ring-inset ring-2 ring-white/0 group-hover:ring-white/30 rounded-2xl transition-all duration-300" />
            </Link>
          ))}
        </div>

        <div className="md:hidden text-center mt-6">
          <Link
            to="/stories"
            className="text-sm text-primary font-medium hover:underline underline-offset-4"
          >
            View All Stories →
          </Link>
        </div>
      </div>
    </section>
  );
};
