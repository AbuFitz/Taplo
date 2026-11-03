"use client";
import { useRef, type ReactNode } from "react";
import { motion, useInView } from "motion/react";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/** A short entrance, never a scroll lock or a prerequisite for reading content. */
export function ScrollReveal({
  children,
  className,
  delay = 0,
  distance = 24,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  distance?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.15 });
  const reduced = useReducedMotion();
  return (
    <motion.div
      ref={ref}
      className={className}
      data-scroll-reveal
      data-revealed={seen || reduced}
      initial={false}
      animate={{ y: seen || reduced ? 0 : distance }}
      transition={{
        duration: reduced ? 0 : 0.65,
        delay: reduced ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
