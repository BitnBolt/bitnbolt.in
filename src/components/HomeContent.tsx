'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface HomeContentProps {
  children: React.ReactNode;
}

export default function HomeContent({ children }: HomeContentProps) {
  // Animation variants for staggered children
  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  // Convert children to array to manipulate them
  const childrenArray = React.Children.toArray(children);

  return (
    <motion.div 
      className="relative z-10"
      initial="hidden"
      animate="show"
      variants={staggerContainer}
    >
      {childrenArray.map((child, index) => (
        <motion.div 
          key={index} 
          variants={fadeInUp}
          className={index === 2 ? "py-10" : ""} // Add py-10 to the Features component (index 2)
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
} 