'use client';

import { motion } from 'framer-motion';
import { useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/effect-fade';

const heroSlides = [
  {
    title: 'IoT Platform',
    description:
      'With scalable, secure, and intelligent IoT systems designed specifically for your company, you can monitor, update, and operate thousands of devices worldwide from a single, secure dashboard, streamlining operations and lowering management overhead.',
    image: '/slideshow/im1.png',
  },
  {
    title: 'Custom Hardware',
    description:
      'From custom PCB design to full prototyping, we build custom-made hardware that eliminates the limitations of giving you a distinct competitive edge and significantly reducing manufacturing costs at scale.',
    image: '/slideshow/im2.png',
  },
  {
    title: 'Firmware Development',
    description:
      'We build high-performance, optimized firmware that maximizes hardware efficiency and reliability, significantly protecting your devices to reduce field maintenance and extend battery lifecycles.',
    image: '/slideshow/im3.png',
  },
  {
    title: 'Cloud Integration',
    description:
      'Connect your devices seamlessly to the cloud for real-time tracking and easy remote updates, helping you future-proof your business and add new features with less interventions with physical hardware.',
    image: '/slideshow/im4.png',
  },
  {
    title: 'Data Analytics',
    description:
      'Turn your raw sensor data into clear, real-time dashboards that help you predict maintenance needs and make smart, proactive choices to prevent expensive operational fires before they even start.',
    image: '/slideshow/im5.png',
  },
  {
    title: 'Edge Computing',
    description:
      'Process critical data directly on the device to achieve near-zero latency and local decision-making, significantly slashing cloud bandwidth and storage fees while keeping your system fully functional offline.',
    image: '/slideshow/im6.png',
  },
];

export default function Hero() {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring' as const, stiffness: 100 },
    },
  };

  const textVariant = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
        duration: 0.8,
      },
    },
    exit: {
      y: -20,
      opacity: 0,
      transition: { duration: 0.5 },
    },
  };

  const activeSlide = heroSlides[activeSlideIndex];

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
            onSlideChange={(swiper) => {
              setActiveSlideIndex(swiper.realIndex);
            }}
            className="w-full h-full"
          >
            {heroSlides.map((slide) => (
              <SwiperSlide key={slide.title}>
                <div className="relative w-full h-full">
                  <img
                    src={slide.image}
                    alt={slide.title}
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
            className="max-w-3xl text-left"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
              <motion.span
                key={activeSlideIndex}
                variants={textVariant}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="block"
              >
                {activeSlide.title}
              </motion.span>
            </h1>

            <motion.p
              key={`desc-${activeSlideIndex}`}
              className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl leading-relaxed"
              variants={textVariant}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {activeSlide.description}
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

        {/* Slide indicators */}
        <div className="absolute bottom-10 left-4 sm:left-8 z-20 flex gap-2">
          {heroSlides.map((slide, index) => (
            <button
              key={slide.title}
              onClick={() => swiperRef.current?.slideToLoop(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === activeSlideIndex ? 'w-8 bg-yellow-500' : 'w-4 bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Go to ${slide.title} slide`}
            />
          ))}
        </div>
      </section>
    </>
  );
}
