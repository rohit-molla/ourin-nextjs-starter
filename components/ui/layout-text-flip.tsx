"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export const LayoutTextFlip = ({
  text = "Build Amazing",
  words = ["Landing Pages", "Component Blocks", "Page Sections", "3D Shaders"],
  duration = 3000,
  className = "",
}: {
  text?: string;
  words: string[];
  duration?: number;
  className?: string;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, duration);

    return () => clearInterval(interval);
  }, [words.length, duration]);

  return (
    <span className={cn("inline-flex items-baseline gap-2", className)}>
      {text && (
        <span className="font-bold tracking-tight drop-shadow-lg">
          {text}
        </span>
      )}

      <span className="relative inline-flex overflow-hidden rounded-lg bg-zinc-950 dark:bg-zinc-950 px-3 py-1 border border-neutral-700/50 shadow-lg">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={currentIndex}
            initial={{ y: -30, filter: "blur(8px)", opacity: 0 }}
            animate={{
              y: 0,
              filter: "blur(0px)",
              opacity: 1,
            }}
            exit={{ y: 30, filter: "blur(8px)", opacity: 0 }}
            transition={{
              duration: 0.4,
              ease: "easeOut",
            }}
            className={cn(
              "inline-block whitespace-nowrap font-bold",
              "bg-gradient-to-r from-violet-700 via-fuchsia-500 to-amber-300 bg-clip-text text-transparent"
            )}
          >
            {words[currentIndex]}
          </motion.span>
        </AnimatePresence>
      </span>
    </span>
  );
};
