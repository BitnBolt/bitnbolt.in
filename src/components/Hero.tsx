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
      'Monitor and operate devices from one secure dashboard—built for scale without the management overhead.',
    image: '/slideshow/im1.png',
  },
  {
    title: 'Custom Hardware',
    description:
      'Custom PCB design for your product—schematic, layout, and files you own. Built to your requirements, not a catalog template.',
    image: '/slideshow/im2.png',
    href: '/pcb',
  },

  {
    title: 'Firmware Development',
    description:
      'Optimized firmware for reliability, lower field maintenance, and longer battery life.',
    image: '/slideshow/im3.png',
    href: '/firmware',
  },
  {
    title: 'Cloud Integration',
    description:
      'Connect devices to the cloud for real-time tracking and remote updates—without constant site visits.',
    image: '/slideshow/im4.png',
  },
  {
    title: 'Data Analytics',
    description:
      'Turn sensor data into clear dashboards so you can act before costly downtime hits.',
    image: '/slideshow/im5.png',
  },
  {
    title: 'Edge Computing',
    description:
      'Process critical data on-device for near-zero latency—even when the cloud is offline.',
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
        delayChildren: 0.2,
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 16, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring' as const, stiffness: 100 },
    },
  };

  const textVariant = {
    hidden: { y: 16, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
        duration: 0.6,
      },
    },
    exit: {
      y: -12,
      opacity: 0,
      transition: { duration: 0.35 },
    },
  };

  const activeSlide = heroSlides[activeSlideIndex];

  return (
    <section
      id="home"
      className="relative w-full h-[72vh] min-h-[460px] max-h-[560px] sm:h-screen sm:min-h-[600px] sm:max-h-none flex items-end sm:items-center overflow-hidden bg-gray-900"
    >
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/20 sm:bg-linear-to-r sm:from-black/80 sm:via-black/50 sm:to-transparent" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full pb-16 pt-20 sm:pb-0 sm:pt-20">
        <motion.div
          className="max-w-xl sm:max-w-3xl text-left"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-3 sm:mb-6">
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
            className="text-sm sm:text-xl text-gray-300 mb-5 sm:mb-8 max-w-md sm:max-w-2xl leading-snug sm:leading-relaxed line-clamp-3 sm:line-clamp-none"
            variants={textVariant}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {activeSlide.description}
          </motion.p>

          <motion.div className="flex flex-row gap-3" variants={itemVariants}>
            <a
              href={'href' in activeSlide && activeSlide.href ? activeSlide.href : '#products'}
              className="bg-yellow-500 text-gray-900 px-5 py-2.5 sm:px-8 sm:py-4 rounded-full text-sm sm:text-base font-semibold hover:bg-yellow-400 hover:shadow-lg transition-all duration-300 inline-flex items-center justify-center"
            >
              {'href' in activeSlide && activeSlide.href === '/pcb'
                ? 'Custom PCB service'
                : 'href' in activeSlide && activeSlide.href === '/firmware'
                  ? 'Explore firmware'
                  : 'See our IoT approach'}
            </a>
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute bottom-4 right-4 sm:bottom-10 sm:right-10 z-20 flex gap-2 sm:gap-3">
        <button
          onClick={() => swiperRef.current?.slidePrev()}
          className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-[#0A2542]/90 hover:bg-[#133256] rounded-lg text-white transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
          aria-label="Previous slide"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={() => swiperRef.current?.slideNext()}
          className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-[#0A2542]/90 hover:bg-[#133256] rounded-lg text-white transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
          aria-label="Next slide"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="absolute bottom-4 left-4 sm:bottom-10 sm:left-8 z-20 flex gap-1.5 sm:gap-2">
        {heroSlides.map((slide, index) => (
          <button
            key={slide.title}
            onClick={() => swiperRef.current?.slideToLoop(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === activeSlideIndex ? 'w-6 sm:w-8 bg-yellow-500' : 'w-2.5 sm:w-4 bg-white/40'
            }`}
            aria-label={`Go to ${slide.title} slide`}
          />
        ))}
      </div>
    </section>
  );
}
