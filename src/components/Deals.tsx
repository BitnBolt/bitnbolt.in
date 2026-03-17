'use client';

import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function Deals() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: 45,
    seconds: 30
  });

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        let { hours, minutes, seconds } = prevTime;
        
        if (seconds > 0) {
          seconds -= 1;
        } else {
          seconds = 59;
          if (minutes > 0) {
            minutes -= 1;
          } else {
            minutes = 59;
            if (hours > 0) {
              hours -= 1;
            } else {
              // Reset to starting time when countdown reaches zero
              hours = 2;
              minutes = 45;
              seconds = 30;
            }
          }
        }
        
        return { hours, minutes, seconds };
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const deals = [
    {
      id: 1,
      name: "Smart Home Starter Kit",
      originalPrice: 599,
      salePrice: 399,
      discount: 33,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
      endTime: "2 days left",
      sold: 85,
      total: 100
    },
    {
      id: 2,
      name: "Industrial IoT Bundle",
      originalPrice: 2499,
      salePrice: 1899,
      discount: 24,
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop",
      endTime: "1 day left",
      sold: 23,
      total: 50
    },
    {
      id: 3,
      name: "Healthcare Monitoring System",
      originalPrice: 1299,
      salePrice: 899,
      discount: 31,
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop",
      endTime: "3 days left",
      sold: 67,
      total: 100
    },
    {
      id: 4,
      name: "Agriculture IoT Package",
      originalPrice: 899,
      salePrice: 649,
      discount: 28,
      image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop",
      endTime: "5 days left",
      sold: 42,
      total: 75
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100
      }
    }
  };

  // Format time with leading zeros
  const formatTime = (value: number) => value.toString().padStart(2, '0');

  return (
    <section id="deals" className="py-12 bg-[#f8fafd] relative overflow-hidden">
      {/* Background Elements removed for cleaner look matching Services */}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div 
          className="flex flex-col md:flex-row md:items-center justify-between mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h2 className="text-3xl md:text-3xl lg:text-4xl font-extrabold text-[#0B1C2D] mb-2 tracking-tight">
              Flash Deals
            </h2>
            <p className="text-lg text-gray-500 font-light">
              Exclusive discounts on our most popular IoT products • Act fast before they&apos;re gone
            </p>
          </div>
          
          <div className="mt-6 md:mt-0">
            <div className="text-sm text-gray-600">Next deal starts in:</div>
            <div className="flex space-x-2 items-center">
              <div className="bg-[#0A2542] text-white px-3 py-2 rounded-lg">
                <span className="text-2xl font-bold tabular-nums">{formatTime(timeLeft.hours)}</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">:</span>
              <div className="bg-[#0A2542] text-white px-3 py-2 rounded-lg">
                <span className="text-2xl font-bold tabular-nums">{formatTime(timeLeft.minutes)}</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">:</span>
              <div className="bg-[#0A2542] text-white px-3 py-2 rounded-lg">
                <span className="text-2xl font-bold tabular-nums">{formatTime(timeLeft.seconds)}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Deals Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {deals.map((deal) => (
            <motion.div
              key={deal.id}
              variants={itemVariants}
              whileHover={{ scale: 1 }}
              className="bg-white rounded-lg overflow-hidden shadow-sm border border-transparent hover:border-red-200 transition-all duration-300 relative group"
            >
              {/* Deal Badge */}
              <div className="absolute top-4 left-4 bg-red-600 text-white text-sm font-bold px-3 py-1.5 rounded-full z-10 transform -rotate-2">
                {deal.discount}% OFF
              </div>
              
              {/* Timer Badge */}
              <div className="absolute top-4 right-4 bg-black bg-opacity-75 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs z-10">
                {deal.endTime}
              </div>

              {/* Product Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={deal.image}
                  alt={deal.name}
                  width={400}
                  height={300}
                  className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-90"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors duration-300">
                  {deal.name}
                </h3>

                {/* Pricing */}
                <div className="mb-4 flex items-baseline">
                  <span className="text-2xl font-bold text-red-600">${deal.salePrice}</span>
                  <span className="text-lg text-gray-500 line-through ml-2">${deal.originalPrice}</span>
                </div>

                {/* Progress Bar */}
                <div className="mb-5">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span className="font-medium">{deal.sold} claimed</span>
                    <span>Only {deal.total - deal.sold} left</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full">
                    <motion.div 
                      className="h-2 bg-linear-to-r from-red-600 to-orange-500 rounded-full"
                      style={{ width: `${deal.sold}%` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${deal.sold}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                    ></motion.div>
                  </div>
                </div>

                {/* Action Button */}
                <button className="w-full bg-[#0B1C2D] hover:bg-[#163554] text-white py-3 px-4 rounded-md font-semibold flex items-center justify-center transition-colors duration-300">
                  <span>Claim Deal</span>
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Deals */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <a 
            href="#all-deals" 
            className="inline-flex items-center justify-center bg-white border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-full font-semibold hover:bg-gray-50 hover:border-gray-400 hover:shadow-md transition-all duration-300 group"
          >
            <span>View All Deals</span>
            <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
} 