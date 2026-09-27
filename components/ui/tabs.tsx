"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

interface TabsProps {
  tabs: string[];
  defaultActive?: number;
  onChange?: (index: number) => void;
  className?: string;
}

export default function Tabs({
  tabs,
  defaultActive = 0,
  onChange,
  className,
}: TabsProps) {
  const [active, setActive] = useState(defaultActive);

  const handleClick = (i: number) => {
    setActive(i);
    onChange?.(i);
  };

  return (
    <div
      className={clsx(
        "inline-flex items-center gap-1 rounded-full border border-border-subtle bg-white/60 p-1",
        className
      )}
    >
      {tabs.map((tab, i) => (
        <button
          key={tab}
          onClick={() => handleClick(i)}
          className={clsx(
            "relative rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300",
            active === i ? "text-white" : "text-text-primary hover:text-text-muted"
          )}
        >
          {active === i && (
            <motion.span
              layoutId={`tab-pill-${tabs.join("-")}`}
              className="absolute inset-0 rounded-full bg-text-primary"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10">{tab}</span>
        </button>
      ))}
    </div>
  );
}
