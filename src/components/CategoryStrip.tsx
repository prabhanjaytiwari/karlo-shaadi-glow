import { Link } from "react-router-dom";
import categoryVenue from "@/assets/category-venue.jpg";
import categoryPhotography from "@/assets/category-photography.jpg";
import categoryCatering from "@/assets/category-catering.jpg";
import categoryDecoration from "@/assets/category-decoration.jpg";
import categoryMusic from "@/assets/category-music.jpg";
import categoryMehendi from "@/assets/category-mehendi.jpg";
import categoryCake from "@/assets/category-cake.jpg";
import categoryMakeup from "@/assets/category-makeup.jpg";
import categoryJewelry from "@/assets/category-jewelry.jpg";
import categoryInvitations from "@/assets/category-invitations.jpg";

const categories = [
  { name: "Venues", slug: "venues", image: categoryVenue },
  { name: "Photography", slug: "photography", image: categoryPhotography },
  { name: "Catering", slug: "catering", image: categoryCatering },
  { name: "Decoration", slug: "decoration", image: categoryDecoration },
  { name: "Music & DJ", slug: "music", image: categoryMusic },
  { name: "Mehendi", slug: "mehendi", image: categoryMehendi },
  { name: "Cakes", slug: "cakes", image: categoryCake },
  { name: "Makeup", slug: "makeup", image: categoryMakeup },
  { name: "Jewelry", slug: "jewelry", image: categoryJewelry },
  { name: "Invitations", slug: "invitations", image: categoryInvitations },
];

export const CategoryStrip = () => {
  return (
    <section className="py-8 md:py-12 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-semibold text-lg md:text-xl">
            Wedding Categories
          </h2>
          <Link
            to="/categories"
            className="text-sm text-primary font-medium hover:underline underline-offset-4"
          >
            View All →
          </Link>
        </div>

        <div className="flex gap-4 md:gap-6 overflow-x-auto pb-2 scrollbar-hide md:grid md:grid-cols-10 md:overflow-visible">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              to={`/category/${cat.slug}`}
              className="group flex flex-col items-center gap-2 flex-shrink-0 min-w-[72px]"
            >
              <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden ring-2 ring-accent/20 group-hover:ring-accent/60 transition-all duration-300 group-hover:scale-105">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className="text-xs md:text-sm font-medium text-center text-muted-foreground group-hover:text-foreground transition-colors leading-tight">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
