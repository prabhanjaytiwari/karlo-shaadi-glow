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
        display: ['"DM Serif Display"', 'Georgia', 'serif'],
        quote: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['Outfit', 'system-ui', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.02em' }],
        'sm': ['0.875rem', { lineHeight: '1.5', letterSpacing: '0.01em' }],
        'base': ['1rem', { lineHeight: '1.65', letterSpacing: '0.01em' }],
        'lg': ['1.125rem', { lineHeight: '1.5', letterSpacing: '0' }],
        'xl': ['1.25rem', { lineHeight: '1.4', letterSpacing: '-0.01em' }],
        '2xl': ['1.5rem', { lineHeight: '1.35', letterSpacing: '-0.015em' }],
        '3xl': ['1.875rem', { lineHeight: '1.25', letterSpacing: '-0.02em' }],
        '4xl': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.025em' }],
        '5xl': ['3rem', { lineHeight: '1.15', letterSpacing: '-0.03em' }],
        '6xl': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.035em' }],
        '7xl': ['4.5rem', { lineHeight: '1.05', letterSpacing: '-0.04em' }],
        '8xl': ['6rem', { lineHeight: '1', letterSpacing: '-0.04em' }],
        '9xl': ['8rem', { lineHeight: '1', letterSpacing: '-0.045em' }],
      },
      fontWeight: {
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
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
        fadeUp: {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        scaleIn: {
          from: { opacity: "0", transform: "scale(0.92)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          from: { backgroundPosition: "200% 0" },
          to: { backgroundPosition: "-200% 0" },
        },
        smoothReveal: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        textReveal: {
          "0%": { opacity: "0", transform: "translateY(12px)", filter: "blur(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)", filter: "blur(0)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(100%)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        glow: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-up": "fadeUp 600ms cubic-bezier(0.16, 1, 0.3, 1)",
        "fade-in": "fadeIn 500ms cubic-bezier(0.16, 1, 0.3, 1)",
        "scale-in": "scaleIn 500ms cubic-bezier(0.16, 1, 0.3, 1)",
        shimmer: "shimmer 2s linear infinite",
        "smooth-reveal": "smoothReveal 700ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "text-reveal": "textReveal 600ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "slide-up": "slideUp 500ms cubic-bezier(0.16, 1, 0.3, 1)",
        "float": "float 6s ease-in-out infinite",
        "glow": "glow 3s ease-in-out infinite",
        "marquee": "marquee 30s linear infinite",
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'decel': 'cubic-bezier(0, 0, 0.2, 1)',
        'accel': 'cubic-bezier(0.4, 0, 1, 1)',
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      transitionDuration: {
        'instant': '100ms',
        'fast': '150ms',
        'normal': '250ms',
        'slow': '400ms',
        'slower': '600ms',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
