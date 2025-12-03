import { cn } from "@/lib/utils";
import { HTMLAttributes, useRef, useState, useCallback, useEffect } from "react";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "intense" | "subtle" | "premium";
  hover?: boolean;
  tilt?: boolean;
  glow?: boolean;
  magnetic?: boolean;
}

export const GlassCard = ({ 
  children, 
  className, 
  variant = "default",
  hover = false,
  tilt = false,
  glow = false,
  magnetic = false,
  ...props 
}: GlassCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [tiltStyle, setTiltStyle] = useState({ rotateX: 0, rotateY: 0 });
  const [magneticStyle, setMagneticStyle] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    if (tilt) {
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;
      setTiltStyle({ rotateX, rotateY });
    }

    if (magnetic) {
      const deltaX = (x - centerX) * 0.1;
      const deltaY = (y - centerY) * 0.1;
      setMagneticStyle({ x: deltaX, y: deltaY });
    }
  }, [tilt, magnetic]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setTiltStyle({ rotateX: 0, rotateY: 0 });
    setMagneticStyle({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    const element = ref.current;
    if (!element || (!tilt && !magnetic)) return;

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseEnter, handleMouseLeave, tilt, magnetic]);

  const computedStyle = {
    transform: `
      perspective(1000px)
      rotateX(${tiltStyle.rotateX}deg)
      rotateY(${tiltStyle.rotateY}deg)
      translate(${magneticStyle.x}px, ${magneticStyle.y}px)
    `,
    transition: isHovered 
      ? 'transform 0.1s ease-out' 
      : 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
  };

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl transition-all duration-300",
        variant === "default" && "glass",
        variant === "intense" && "glass-intense",
        variant === "subtle" && "glass-subtle",
        variant === "premium" && "glass-intense border-gradient",
        hover && "hover-lift cursor-pointer",
        glow && "hover-glow",
        (tilt || magnetic) && "transform-gpu will-change-transform",
        className
      )}
      style={(tilt || magnetic) ? computedStyle : undefined}
      {...props}
    >
      {children}
    </div>
  );
};
