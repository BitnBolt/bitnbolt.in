'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function Hero() {
  const categories = [
    { name: "Smart Home", icon: "🏠", count: "50+ Products" },
    { name: "Industrial IoT", icon: "🏭", count: "30+ Solutions" },
    { name: "Custom Made", icon: "⚙️", count: "100+ Projects" },
    { name: "Healthcare IoT", icon: "🏥", count: "25+ Systems" }
  ];

  const heroTexts = [
    "IoT Products",
    "Custom Solutions",
    "Smart Automation",
    "Digital Transformation"
  ];

  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % heroTexts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [heroTexts.length]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring" as const, stiffness: 100 }
    }
  };

  const textVariant = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { 
        type: "spring" as const, 
        stiffness: 100, 
        duration: 0.8 
      }
    },
    exit: {
      y: -20,
      opacity: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section id="home" className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-white overflow-hidden py-16 lg:py-24">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/3 right-1/3 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left column: Hero content */}
          <motion.div variants={itemVariants} className="text-center lg:text-left">
            <motion.div
              className="inline-block bg-blue-100 text-blue-600 px-4 py-2 rounded-full mb-6 font-medium text-sm"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              The Future of IoT Technology
            </motion.div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-6">
              Revolutionary{" "}
              <div className="relative h-[70px] md:h-[80px] overflow-hidden inline-block">
                <motion.div
                  key={currentTextIndex}
                  variants={textVariant}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
                >
                  {heroTexts[currentTextIndex]}
                </motion.div>
              </div>
            </h1>
            
            <motion.p 
              className="text-xl text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0"
              variants={itemVariants}
            >
              Revolutionize your business with our cutting-edge IoT solutions designed for the modern enterprise. Fast delivery and 24/7 technical support included.
            </motion.p>
            
            {/* CTA buttons */}
            <motion.div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start" variants={itemVariants}>
              <a 
                href="#products" 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-full font-semibold hover:shadow-xl transform hover:translate-y-[-2px] transition-all duration-300 flex items-center justify-center"
              >
                Explore Products
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              
              <a 
                href="#contact" 
                className="bg-white text-gray-800 border-2 border-gray-200 px-8 py-4 rounded-full font-semibold hover:border-gray-400 hover:shadow-lg transform hover:translate-y-[-2px] transition-all duration-300 flex items-center justify-center"
              >
                Contact Us
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </a>
            </motion.div>

            {/* Quick Stats */}
            <motion.div 
              className="mt-10 grid grid-cols-2 gap-4 md:flex md:justify-start md:space-x-8 text-sm text-gray-600"
              variants={itemVariants}
            >
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>500+ Products</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Free Shipping</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>30-Day Returns</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>24/7 Support</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right column: Hero image or illustration */}
          <motion.div 
            variants={itemVariants}
            className="relative flex justify-center lg:justify-end"
          >
            <motion.div 
              className="relative w-full max-w-lg aspect-square"
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ 
                duration: 0.8,
                type: "spring",
                bounce: 0.4
              }}
            >
              <div className="absolute inset-0 bg-blue-100 rounded-3xl transform rotate-6 scale-95 z-0"></div>
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-3xl transform -rotate-6 scale-95 opacity-30 z-0"></div>
              <div className="relative z-10 bg-white rounded-3xl shadow-xl p-8 h-full w-full overflow-hidden">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="text-xs text-gray-500">IoT Smart Hub</div>
                  </div>
                  
                  {/* Mock IoT dashboard */}
                  <div className="flex-1 flex flex-col space-y-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="text-center">
                        <div className="text-blue-600 text-5xl mb-2 font-light animate-pulse">23°C</div>
                        <div className="text-xs text-gray-600">Living Room Temperature</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 rounded-xl p-4 flex flex-col items-center justify-center">
                        <div className="text-2xl mb-1">💡</div>
                        <div className="text-xs text-gray-700 font-medium">Lights</div>
                        <div className="text-xs text-gray-500">ON</div>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4 flex flex-col items-center justify-center">
                        <div className="text-2xl mb-1">🔒</div>
                        <div className="text-xs text-gray-700 font-medium">Security</div>
                        <div className="text-xs text-gray-500">ARMED</div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-4 text-white flex items-center justify-between">
                      <div>
                        <div className="text-xs opacity-80">Energy Usage</div>
                        <div className="font-medium">Optimized</div>
                      </div>
                      <div className="text-2xl">⚡</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Category Grid */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16" 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {categories.map((category, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 group"
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full transform group-hover:scale-[2.5] transition-transform duration-500 opacity-0 group-hover:opacity-30"></div>
                <div className="text-4xl mb-3 relative z-10">{category.icon}</div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1 relative z-10">{category.name}</h3>
              <p className="text-sm text-gray-600 relative z-10">{category.count}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
} 