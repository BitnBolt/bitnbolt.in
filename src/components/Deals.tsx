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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 100 }
    }
  };

  const formatTime = (value: number) => value.toString().padStart(2, '0');

  return (
    <section id="deals" className="py-8 sm:py-12 bg-[#f8fafd] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-12"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1C2D] mb-1 sm:mb-2 tracking-tight">
              Flash Deals
            </h2>
            <p className="text-sm sm:text-lg text-gray-500 font-light">
              Exclusive discounts on popular IoT products — act fast
            </p>
          </div>

          <div className="shrink-0">
            <div className="text-xs sm:text-sm text-gray-600 mb-1">Ends in</div>
            <div className="flex space-x-1.5 sm:space-x-2 items-center">
              <div className="bg-[#0A2542] text-white px-2 py-1.5 sm:px-3 sm:py-2 rounded-md sm:rounded-lg">
                <span className="text-lg sm:text-2xl font-bold tabular-nums">{formatTime(timeLeft.hours)}</span>
              </div>
              <span className="text-lg sm:text-2xl font-bold text-gray-900">:</span>
              <div className="bg-[#0A2542] text-white px-2 py-1.5 sm:px-3 sm:py-2 rounded-md sm:rounded-lg">
                <span className="text-lg sm:text-2xl font-bold tabular-nums">{formatTime(timeLeft.minutes)}</span>
              </div>
              <span className="text-lg sm:text-2xl font-bold text-gray-900">:</span>
              <div className="bg-[#0A2542] text-white px-2 py-1.5 sm:px-3 sm:py-2 rounded-md sm:rounded-lg">
                <span className="text-lg sm:text-2xl font-bold tabular-nums">{formatTime(timeLeft.seconds)}</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory sm:mx-0 sm:px-0 sm:pb-0 sm:overflow-visible sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ scrollbarWidth: 'none' }}
        >
          {deals.map((deal) => (
            <motion.div
              key={deal.id}
              variants={itemVariants}
              className="bg-white rounded-xl sm:rounded-lg overflow-hidden shadow-sm border border-gray-100 hover:border-red-200 transition-all duration-300 relative group shrink-0 w-[68vw] max-w-[260px] sm:w-auto sm:max-w-none snap-start"
            >
              <div className="absolute top-2.5 left-2.5 sm:top-4 sm:left-4 bg-red-600 text-white text-[11px] sm:text-sm font-bold px-2 py-1 sm:px-3 sm:py-1.5 rounded-full z-10">
                {deal.discount}% OFF
              </div>

              <div className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 bg-black/75 text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-xs z-10">
                {deal.endTime}
              </div>

              <div className="relative h-32 sm:h-48 overflow-hidden">
                <Image
                  src={deal.image}
                  alt={deal.name}
                  width={400}
                  height={300}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-3.5 sm:p-6">
                <h3 className="font-bold text-sm sm:text-lg text-gray-900 mb-1.5 sm:mb-2 line-clamp-2">
                  {deal.name}
                </h3>

                <div className="mb-2.5 sm:mb-4 flex items-baseline gap-1.5">
                  <span className="text-lg sm:text-2xl font-bold text-red-600">${deal.salePrice}</span>
                  <span className="text-sm sm:text-lg text-gray-500 line-through">${deal.originalPrice}</span>
                </div>

                <div className="mb-3 sm:mb-5">
                  <div className="flex justify-between text-[10px] sm:text-xs text-gray-500 mb-1">
                    <span className="font-medium">{deal.sold} claimed</span>
                    <span>{deal.total - deal.sold} left</span>
                  </div>
                  <div className="w-full h-1.5 sm:h-2 bg-gray-100 rounded-full">
                    <div
                      className="h-full bg-linear-to-r from-red-600 to-orange-500 rounded-full"
                      style={{ width: `${deal.sold}%` }}
                    />
                  </div>
                </div>

                <button className="w-full bg-[#0B1C2D] hover:bg-[#163554] text-white py-2.5 sm:py-3 px-3 rounded-md text-sm sm:text-base font-semibold flex items-center justify-center gap-1.5 transition-colors">
                  <span>Claim Deal</span>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="text-center mt-8 sm:mt-12"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <a
            href="#all-deals"
            className="inline-flex items-center justify-center bg-white border border-gray-300 text-gray-700 px-5 py-2.5 sm:px-8 sm:py-3 rounded-full text-sm sm:text-base font-semibold hover:bg-gray-50 transition-all"
          >
            <span>View All Deals</span>
            <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
