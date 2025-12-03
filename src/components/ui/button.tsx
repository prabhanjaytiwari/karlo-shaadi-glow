import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 transform-gpu will-change-transform active:scale-[0.97] active:duration-75",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-md hover:bg-primary/90 hover:shadow-lg hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-300 ease-smooth",
        hero: "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg hover:shadow-xl hover:scale-[1.03] hover:-translate-y-1 hover:from-primary hover:to-primary/80 transition-all duration-300 ease-smooth",
        secondary: "bg-secondary text-secondary-foreground shadow-md hover:bg-secondary/90 hover:shadow-lg hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-300 ease-smooth",
        accent: "bg-accent text-accent-foreground shadow-md hover:bg-accent/90 hover:shadow-lg hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-300 ease-smooth",
        glass: "glass hover:glass-intense backdrop-blur-xl hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-300 ease-smooth",
        quiet: "bg-transparent hover:bg-accent/10 text-foreground hover:scale-[1.02] transition-all duration-300 ease-smooth",
        outline: "border-2 border-primary/20 bg-transparent hover:bg-primary hover:text-primary-foreground hover:border-primary hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-300 ease-smooth",
        ghost: "hover:bg-accent/10 hover:text-accent-foreground hover:scale-[1.02] transition-all duration-300 ease-smooth",
        link: "text-primary underline-offset-4 hover:underline",
        premium: "relative overflow-hidden bg-gradient-to-r from-accent to-primary text-white shadow-lg hover:shadow-xl hover:scale-[1.03] hover:-translate-y-1 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-700 transition-all duration-300 ease-smooth",
        glow: "bg-primary text-primary-foreground shadow-md hover:shadow-[0_0_30px_hsl(var(--accent)/0.5)] hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-300 ease-smooth",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-8 text-base",
        xl: "h-14 px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
