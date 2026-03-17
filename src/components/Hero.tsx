'use client';

import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/effect-fade';

export default function Hero() {

  const heroTexts = [
    "IoT Products",
    "Custom Solutions",
    "Smart Automation",
    "Digital Transformation"
  ];

  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % heroTexts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [heroTexts.length]);

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
    <>
      <section id="home" className="relative w-full h-screen min-h-[600px] flex items-center overflow-hidden bg-gray-900">
        {/* Background Carousel */}
        <div className="absolute inset-0 z-0">
          <Swiper
            modules={[Autoplay, EffectFade, Navigation]}
            effect="fade"
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            loop={true}
            onBeforeInit={(swiper) => {
              swiperRef.current = swiper;
            }}
            className="w-full h-full"
          >
            {[1, 2, 3].map((num) => (
              <SwiperSlide key={num}>
                <div className="relative w-full h-full">
                  <img
                    src={`/slideshow/im${num}.png`}
                    alt={`Slide ${num}`}
                    className="w-full h-full object-cover object-center"
                  />
                  {/* Dark gradient overlay to make text readable */}
                  <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/50 to-transparent"></div>
                  <div className="absolute inset-0 bg-black/20"></div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full pt-20">
          <motion.div
            className="max-w-2xl text-left"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
              Your{" "}
              <div className="relative h-[50px] sm:h-[60px] md:h-[80px] overflow-hidden inline-flex items-center align-bottom">
                <motion.div
                  key={currentTextIndex}
                  variants={textVariant}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute text-white"
                >
                  {heroTexts[currentTextIndex]}
                </motion.div>
              </div>
              <br />
              Partner
            </h1>

            <motion.p
              className="text-lg sm:text-xl text-gray-300 mb-8 max-w-xl leading-relaxed"
              variants={itemVariants}
            >
              Trusted by 1000+ clients. We bring decades of engineering excellence into today's IoT initiatives. With a strong foundation, we design, build, and scale enterprise-grade automation software and custom solutions across industries.
            </motion.p>

            {/* CTA button matching reference */}
            <motion.div className="flex flex-col sm:flex-row gap-4" variants={itemVariants}>
              <a
                href="#products"
                className="bg-yellow-500 text-gray-900 px-8 py-4 rounded-full font-semibold hover:bg-yellow-400 hover:shadow-lg transform hover:translate-y-[-2px] transition-all duration-300 flex items-center justify-center w-max"
              >
                See our approach with IoT
              </a>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Custom Navigation Container */}
        <div className="absolute bottom-10 right-10 z-20 flex gap-3">
          <button 
            onClick={() => swiperRef.current?.slidePrev()}
            className="w-12 h-12 flex items-center justify-center bg-[#0A2542] hover:bg-[#133256] rounded-[10px] text-white transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
            aria-label="Previous slide"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            onClick={() => swiperRef.current?.slideNext()}
            className="w-12 h-12 flex items-center justify-center bg-[#0A2542] hover:bg-[#133256] rounded-[10px] text-white transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
            aria-label="Next slide"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </section>

    </>
  );
} 