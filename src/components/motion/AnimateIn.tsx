import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

type AnimateInProps = {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
  y?: number;
  durationMs?: number;
};

const AnimateIn: React.FC<AnimateInProps> = ({
  children,
  className,
  delayMs = 0,
  y = 14,
  durationMs = 550,
}) => {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: durationMs / 1000, delay: delayMs / 1000, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
};

export default AnimateIn;

