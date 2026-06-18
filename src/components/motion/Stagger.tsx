import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

type StaggerProps = {
  children: React.ReactNode;
  className?: string;
  delayMsPerItem?: number;
};

const Stagger: React.FC<StaggerProps> = ({ children, className, delayMsPerItem = 90 }) => {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const arrayChildren = React.Children.toArray(children);

  return (
    <motion.div
      className={className}
      initial={false}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.15 }}
    >
      <div>
        {arrayChildren.map((child, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.55,
              delay: (idx * delayMsPerItem) / 1000,
              ease: 'easeOut',
            }}
          >
            {child}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Stagger;

