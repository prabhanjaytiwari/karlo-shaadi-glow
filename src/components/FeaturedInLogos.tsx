import { motion } from "framer-motion";

const pressLogos = [
  { name: "Times of India", abbreviation: "TOI" },
  { name: "Vogue India", abbreviation: "VOGUE" },
  { name: "Elle", abbreviation: "ELLE" },
  { name: "Economic Times", abbreviation: "ET" },
  { name: "Hindustan Times", abbreviation: "HT" },
  { name: "India Today", abbreviation: "IT" },
];

export function FeaturedInLogos() {
  return (
    <div className="flex flex-col items-center gap-3 mt-6 sm:mt-8">
      <p className="text-xs text-white/70 uppercase tracking-widest font-medium">
        Featured In
      </p>
      <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8">
        {pressLogos.map((logo, index) => (
          <motion.div
            key={logo.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index, duration: 0.4 }}
            className="text-white/60 hover:text-white/90 transition-colors duration-300"
          >
            <span className="font-display font-bold text-sm sm:text-base tracking-wide">
              {logo.abbreviation}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
