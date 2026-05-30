import React from 'react';
import { motion, useTransform } from 'framer-motion';

export const JharokhaFrame = ({ scrollYProgress }) => {
  // Map scroll (0 to 1) to drawing completion (0 to 1)
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <svg className="fixed inset-0 w-full h-full pointer-events-none z-40" viewBox="0 0 100 100" preserveAspectRatio="none">
      <motion.path
        // A much more intricate, ornate Rajput arch path
        d="M 10 100 V 30 C 10 10, 25 5, 50 5 C 75 5, 90 10, 90 30 V 100"
        fill="none"
        stroke="#D4AF37" // Metallic Gold
        strokeWidth="0.8"
        style={{ pathLength }}
        vectorEffect="non-scaling-stroke"
      />
      {/* Intricate side-rails */}
      <motion.path 
        d="M 5 100 V 20 M 95 100 V 20"
        fill="none"
        stroke="#D4AF37"
        strokeWidth="0.4"
        style={{ pathLength }}
      />
    </svg>
  );
};