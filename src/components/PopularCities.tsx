import { Link } from "react-router-dom";

const cities = [
  { name: "Delhi", slug: "delhi", vendors: 1200, gradient: "from-rose-600/70 to-rose-900/80" },
  { name: "Mumbai", slug: "mumbai", vendors: 980, gradient: "from-amber-600/70 to-amber-900/80" },
  { name: "Jaipur", slug: "jaipur", vendors: 650, gradient: "from-pink-600/70 to-pink-900/80" },
  { name: "Udaipur", slug: "udaipur", vendors: 420, gradient: "from-orange-600/70 to-orange-900/80" },
  { name: "Bangalore", slug: "bangalore", vendors: 870, gradient: "from-emerald-600/70 to-emerald-900/80" },
  { name: "Lucknow", slug: "lucknow", vendors: 530, gradient: "from-violet-600/70 to-violet-900/80" },
  { name: "Hyderabad", slug: "hyderabad", vendors: 720, gradient: "from-sky-600/70 to-sky-900/80" },
  { name: "Goa", slug: "goa", vendors: 380, gradient: "from-teal-600/70 to-teal-900/80" },
];

export const PopularCities = () => {
  return (
    <section className="py-12 md:py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-4">
            <span className="text-accent font-medium text-sm">Browse by City</span>
          </div>
          <h2 className="font-display font-semibold text-2xl md:text-3xl mb-2">
            Popular Wedding <span className="text-accent">Destinations</span>
          </h2>
          <div className="w-16 h-0.5 bg-gradient-to-r from-accent/30 via-accent to-accent/30 mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-5xl mx-auto">
          {cities.map((city) => (
            <Link
              key={city.slug}
              to={`/city/${city.slug}`}
              className="group relative aspect-[4/3] rounded-2xl overflow-hidden border border-border/50 hover:border-accent/40 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              {/* Gradient background (instead of image to keep it lightweight) */}
              <div className={`absolute inset-0 bg-gradient-to-br ${city.gradient}`} />
              
              {/* Pattern overlay */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10S0 14.5 0 20s4.5 10 10 10 10-4.5 10-10zm20 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`,
                  backgroundSize: '20px 20px',
                }}
              />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
                <h3 className="font-display font-bold text-xl md:text-2xl group-hover:scale-110 transition-transform duration-300">
                  {city.name}
                </h3>
                <span className="text-white/80 text-xs md:text-sm mt-1">
                  {city.vendors}+ Vendors
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

