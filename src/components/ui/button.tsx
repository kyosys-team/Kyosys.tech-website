import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// CTA rules — emotional-psychology color spec (2026-09-28):
// • primary  = ink (#0F172A) bg + white text — conversion actions on LIGHT
//              surfaces ONLY (Palette 3 inverted CTA, 17.85:1)
// • secondary = brand-900 (deep blue) outline — exploratory actions
// • .btn-emerald (globals.css) = emerald conversion CTA on DARK sections
// Never amber/emerald text on white. Never emerald with white text
// (2.54:1 — fails); emerald pairs with #0B0F19 text (7.55:1).
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-ink text-white shadow-sm hover:bg-slate-800",
        secondary:
          "border-2 border-brand-900 text-brand-900 hover:bg-brand-900 hover:text-white",
        secondaryLight:
          "border-2 border-white/60 text-white hover:bg-white hover:text-brand-950",
        ghost: "text-brand-900 hover:bg-mist",
        danger: "bg-danger text-white hover:opacity-90",
      },
      size: {
        sm: "h-9 px-4 text-[13px]",
        md: "h-11 px-6",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
);
Button.displayName = "Button";

export { Button, buttonVariants };
