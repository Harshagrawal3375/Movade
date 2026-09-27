"use client";

import { useRef, useState, MouseEvent, ReactNode } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
  range?: number;
}

export default function MagneticButton({
  children,
  className,
  onClick,
  href,
  range = 12,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setPos({
      x: (x / rect.width) * range,
      y: (y / rect.height) * range,
    });
  };

  const handleMouseLeave = () => setPos({ x: 0, y: 0 });

  const Component = href ? "a" : "button";

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 150, damping: 12, mass: 0.2 }}
      className="inline-block"
    >
      <Component
        href={href}
        onClick={onClick}
        className={clsx(
          "inline-flex items-center justify-center gap-2 rounded-full transition-transform duration-300 will-change-transform hover:scale-[1.03] active:scale-[0.97]",
          className
        )}
      >
        {children}
      </Component>
    </motion.div>
  );
}
