    "use client";

import React from "react";
import { motion, HTMLMotionProps } from "motion/react";
import { Loader2 } from "lucide-react";

export type ButtonVariant = "primary" | "secondary" | "outline" | "accent" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, "size"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      className = "",
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-semibold rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none shadow-2xs hover:shadow-xs";

    const variantStyles: Record<ButtonVariant, string> = {
      primary:
        "bg-[#185334] text-white hover:bg-[#124229] focus-visible:ring-[#185334]",
      secondary:
        "bg-[var(--color-secondary-light)] text-[var(--color-foreground)] hover:bg-gray-200 focus-visible:ring-[var(--color-secondary)]",
      outline:
        "border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-300 focus-visible:ring-[#185334]",
      accent:
        "bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] focus-visible:ring-[var(--color-accent)]",
      ghost:
        "text-[var(--color-foreground)] hover:bg-[var(--color-secondary-light)] focus-visible:ring-[#185334]",
    };

    const sizeStyles: Record<ButtonSize, string> = {
      sm: "text-xs px-4 py-1.5 gap-1.5",
      md: "text-sm px-5 py-2.5 gap-2",
      lg: "text-base px-7 py-3.5 gap-2.5 font-semibold",
    };

    return (
      <motion.button
        ref={ref}
        whileHover={disabled || isLoading ? undefined : { scale: 1.02 }}
        whileTap={disabled || isLoading ? undefined : { scale: 0.98 }}
        transition={{ duration: 0.15 }}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-current" aria-hidden="true" />
        ) : (
          leftIcon
        )}
        <span>{children}</span>
        {!isLoading && rightIcon}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
