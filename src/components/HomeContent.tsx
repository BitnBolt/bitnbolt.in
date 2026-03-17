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
      {childrenArray.map((child, index) => {
        // Skip animating the Header (index 0) so its position: fixed works properly
        if (index === 0) return <React.Fragment key={index}>{child}</React.Fragment>;
        
        return (
          <motion.div 
            key={index} 
            variants={fadeInUp}
          >
            {child}
          </motion.div>
        );
      })}
    </motion.div>
  );
} 