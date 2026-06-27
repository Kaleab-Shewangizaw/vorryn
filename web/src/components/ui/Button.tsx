"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "relative inline-flex items-center justify-center",
    "font-cinzel font-bold uppercase tracking-widest",
    "rounded overflow-hidden cursor-pointer select-none",
    "disabled:pointer-events-none disabled:opacity-30",
  ],
  {
    variants: {
      variant: {
        primary: [
          "bg-black text-slate-100 border border-vorryn-steel/50",
          "transition-all duration-400",
          "hover:border-vorryn-glow-end",
          "hover:shadow-[0_0_20px_rgba(249,115,22,0.4),0_0_40px_rgba(220,38,38,0.2),inset_0_0_10px_rgba(249,115,22,0.2)]",
          "hover:[text-shadow:0_0_8px_rgba(249,115,22,0.8)]",
          "before:content-[''] before:absolute before:inset-0 before:-translate-x-full",
          "before:bg-gradient-to-r before:from-transparent before:via-orange-500/20 before:to-transparent",
          "before:transition-transform before:duration-500",
          "hover:before:translate-x-full",
        ],
        ghost: [
          "bg-transparent text-slate-400 border border-vorryn-steel/50",
          "transition-all duration-300",
          "hover:border-slate-400 hover:text-slate-200",
        ],
        danger: [
          "bg-transparent text-red-400 border border-red-900/60",
          "transition-all duration-300",
          "hover:border-red-600 hover:text-red-300",
          "hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]",
        ],
      },
      size: {
        sm: "text-xs px-6 py-2",
        md: "text-sm px-8 py-3",
        lg: "text-base px-10 py-4",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants>;

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
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
