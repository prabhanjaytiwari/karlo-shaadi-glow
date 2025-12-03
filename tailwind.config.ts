import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        quote: ['"Playfair Display"', 'serif'],
        body: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        // Basic animations
        fadeUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        scaleIn: {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          from: { backgroundPosition: "200% 0" },
          to: { backgroundPosition: "-200% 0" },
        },
        // Premium spring-physics animations
        springBounce: {
          "0%": { transform: "translateY(30px) scale(0.95)", opacity: "0" },
          "50%": { transform: "translateY(-8px) scale(1.02)", opacity: "1" },
          "70%": { transform: "translateY(4px) scale(0.99)" },
          "100%": { transform: "translateY(0) scale(1)", opacity: "1" },
        },
        smoothReveal: {
          "0%": { opacity: "0", transform: "translateY(40px)", filter: "blur(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)", filter: "blur(0px)" },
        },
        parallaxFloat: {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "25%": { transform: "translateY(-15px) rotate(2deg)" },
          "50%": { transform: "translateY(-25px) rotate(0deg)" },
          "75%": { transform: "translateY(-15px) rotate(-2deg)" },
        },
        shimmerGlow: {
          "0%": { backgroundPosition: "-200% center", opacity: "0.5" },
          "50%": { opacity: "1" },
          "100%": { backgroundPosition: "200% center", opacity: "0.5" },
        },
        breathe: {
          "0%, 100%": { transform: "scale(1)", boxShadow: "0 0 0 0 hsl(var(--accent) / 0.4)" },
          "50%": { transform: "scale(1.02)", boxShadow: "0 0 20px 10px hsl(var(--accent) / 0)" },
        },
        slideUpSpring: {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "60%": { transform: "translateY(-5%)", opacity: "1" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleUpSpring: {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "60%": { transform: "scale(1.05)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        blurReveal: {
          "0%": { filter: "blur(20px)", opacity: "0", transform: "scale(1.1)" },
          "100%": { filter: "blur(0)", opacity: "1", transform: "scale(1)" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 20px hsl(var(--accent) / 0.3)" },
          "50%": { boxShadow: "0 0 40px hsl(var(--accent) / 0.6)" },
        },
        textReveal: {
          "0%": { opacity: "0", transform: "translateY(20px) rotateX(-90deg)" },
          "100%": { opacity: "1", transform: "translateY(0) rotateX(0deg)" },
        },
        borderGlow: {
          "0%, 100%": { borderColor: "hsl(var(--border))" },
          "50%": { borderColor: "hsl(var(--accent) / 0.5)" },
        },
        magneticPull: {
          "0%": { transform: "translate(0, 0)" },
          "100%": { transform: "translate(var(--magnetic-x, 0), var(--magnetic-y, 0))" },
        },
        tiltIn: {
          "0%": { transform: "perspective(1000px) rotateX(30deg) translateY(30px)", opacity: "0" },
          "100%": { transform: "perspective(1000px) rotateX(0deg) translateY(0)", opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-up": "fadeUp 600ms cubic-bezier(0.22, 1, 0.36, 1)",
        "fade-in": "fadeIn 400ms cubic-bezier(0.22, 1, 0.36, 1)",
        "scale-in": "scaleIn 500ms cubic-bezier(0.22, 1, 0.36, 1)",
        shimmer: "shimmer 2s linear infinite",
        // Premium animations
        "spring-bounce": "springBounce 800ms cubic-bezier(0.34, 1.56, 0.64, 1)",
        "smooth-reveal": "smoothReveal 800ms cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "parallax-float": "parallaxFloat 6s ease-in-out infinite",
        "shimmer-glow": "shimmerGlow 3s ease-in-out infinite",
        "breathe": "breathe 3s ease-in-out infinite",
        "slide-up-spring": "slideUpSpring 700ms cubic-bezier(0.34, 1.56, 0.64, 1)",
        "scale-up-spring": "scaleUpSpring 600ms cubic-bezier(0.34, 1.56, 0.64, 1)",
        "blur-reveal": "blurReveal 800ms cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
        "text-reveal": "textReveal 600ms cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "border-glow": "borderGlow 2s ease-in-out infinite",
        "tilt-in": "tiltIn 800ms cubic-bezier(0.22, 1, 0.36, 1) forwards",
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'smooth': 'cubic-bezier(0.22, 1, 0.36, 1)',
        'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      transitionDuration: {
        'instant': '100ms',
        'fast': '200ms',
        'normal': '300ms',
        'slow': '500ms',
        'slower': '800ms',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
