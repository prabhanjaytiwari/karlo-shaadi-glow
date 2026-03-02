import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MobilePageHeader } from "@/components/mobile/MobilePageHeader";
import { useIsMobile } from "@/hooks/use-mobile";
import logoImage from "@/assets/logo-new.png";

const NotFound = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-background">
      <MobilePageHeader title="Page Not Found" />

      <div className={`flex flex-col items-center justify-center ${isMobile ? 'min-h-[70vh] px-6' : 'min-h-[80vh] pt-20'}`}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
          className="text-center max-w-md"
        >
          <motion.img
            src={logoImage}
            alt="Karlo Shaadi"
            className="h-12 mx-auto mb-8 opacity-30"
            style={{ mixBlendMode: 'multiply' }}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          />

          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 150 }}
            className="text-8xl font-bold text-primary/20 mb-4"
          >
            404
          </motion.div>

          <h1 className="text-2xl font-bold text-foreground mb-3">
            Oops! This page doesn't exist
          </h1>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Looks like this page got lost on its way to the mandap. Let's get you back on track!
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => navigate("/")} size="lg" className="gap-2">
              <Home className="h-4 w-4" />
              Go Home
            </Button>
            <Button onClick={() => navigate("/search")} variant="outline" size="lg" className="gap-2">
              <Heart className="h-4 w-4" />
              Browse Vendors
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
