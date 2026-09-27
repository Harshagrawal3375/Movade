import clsx from "clsx";
import { ReactNode } from "react";

export function Pill({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium",
        className
      )}
    >
      {children}
    </span>
  );
}

export function Chip({
  children,
  active,
  onClick,
}: {
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-300",
        active
          ? "border-text-primary bg-text-primary text-white"
          : "border-border-subtle bg-transparent text-text-primary hover:border-text-primary"
      )}
    >
      {children}
    </button>
  );
}
