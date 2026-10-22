import React from "react";

export type BadgeVariant = "success" | "warning" | "danger" | "neutral" | "primary";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  children: React.ReactNode;
}

export function Badge({ variant = "neutral", children, className = "", ...props }: BadgeProps) {
  const variantStyles: Record<BadgeVariant, string> = {
    primary: "bg-[var(--color-primary-light)] text-[var(--color-primary)] border-[var(--color-primary)]/20",
    success: "bg-[var(--color-success-light)] text-[var(--color-success)] border-[var(--color-success)]/20",
    warning: "bg-[var(--color-accent-light)] text-[var(--color-accent)] border-[var(--color-accent)]/20",
    danger: "bg-[var(--color-danger-light)] text-[var(--color-danger)] border-[var(--color-danger)]/20",
    neutral: "bg-[var(--color-secondary-light)] text-[var(--color-secondary)] border-gray-200",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
