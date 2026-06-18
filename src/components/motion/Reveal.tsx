import React, { forwardRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
  y?: number;
  durationMs?: number;
};

const Reveal = forwardRef<HTMLDivElement, RevealProps>(
  ({ children, className, delayMs = 0, y = 14, durationMs = 550 }, ref) => {
    const prefersReducedMotion = useReducedMotion();

    if (prefersReducedMotion) {
      return (
        <div className={className} ref={ref}>
          {children}
        </div>
      );
    }

    return (
      <motion.div
        ref={ref}
        className={className}
        initial={{ opacity: 0, y }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: durationMs / 1000, delay: delayMs / 1000, ease: 'easeOut' }}
      >
        {children}
      </motion.div>
    );
  }
);

Reveal.displayName = 'Reveal';

export default Reveal;

