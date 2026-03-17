'use client';

import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { useRef } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';

const stories = [
  {
    id: 1,
    image: "/slideshow/im1.png",
    logo: "/logos/company1.png",
    tag: "Data Analytics (Energy)",
    title: "Curated data engineering solution for EV charging provider"
  },
  {
    id: 2,
    image: "/slideshow/im2.png",
    logo: "/logos/company2.png",
    tag: "Generative AI (Legal)",
    title: "Patent data intelligence system powered by GenAI framework"
  },
  {
    id: 3,
    image: "/slideshow/im3.png",
    logo: "/logos/company3.png",
    tag: "DevOps (Finance)",
    title: "Accelerating product development with DevOps"
  },
  {
    id: 4,
    image: "/slideshow/im1.png",
    logo: "/logos/company4.png",
    tag: "Enterprise Application (Manufacturing)",
    title: "Mobile and desktop solutions for Management"
  },
  {
    id: 5,
    image: "/slideshow/im2.png",
    logo: "/logos/company5.png",
    tag: "Cloud Infrastructure",
    title: "Scalable cloud architecture for real-time processing"
  }
];

export default function SuccessStories() {
  const swiperRef = useRef<SwiperType | null>(null);

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className="py-12 bg-white relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Header section with title and navigation buttons */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
            <div>
              <motion.h2 variants={itemVariants} className="text-3xl md:text-3xl lg:text-4xl font-extrabold text-[#0B1C2D] mb-2 tracking-tight">
                Success stories from companies like yours
              </motion.h2>
              <motion.p variants={itemVariants} className="text-lg text-gray-500 font-light">
                Explore our transformative solutions in action
              </motion.p>
            </div>
            
            <motion.div variants={itemVariants} className="flex gap-2">
              <button 
                onClick={() => swiperRef.current?.slidePrev()}
                className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-gray-50 hover:bg-[#0B1C2D] hover:text-white rounded-md text-gray-600 transition-colors border border-transparent shadow-sm"
                aria-label="Previous slide"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button 
                onClick={() => swiperRef.current?.slideNext()}
                className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-gray-50 hover:bg-[#0B1C2D] hover:text-white rounded-md text-gray-600 transition-colors border border-transparent shadow-sm"
                aria-label="Next slide"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </motion.div>
          </div>

          {/* Carousel */}
          <motion.div variants={itemVariants}>
            <Swiper
              modules={[Navigation]}
              onBeforeInit={(swiper) => {
                swiperRef.current = swiper;
              }}
              spaceBetween={20}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
                1280: { slidesPerView: 4 }
              }}
              className="pb-4!"
            >
              {stories.map((story) => (
                <SwiperSlide key={story.id} className="h-full">
                  <div className="group relative h-[380px] rounded-lg overflow-hidden cursor-pointer border border-transparent hover:border-blue-300 transition-all duration-300">
                    {/* Background Image */}
                    <img 
                      src={story.image} 
                      alt={story.title} 
                      className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-90"
                    />
                    
                    {/* Dark gradient overlay (bottom to top for text readability) */}
                    <div className="absolute inset-0 bg-linear-to-t from-[#1A2530] via-[#1A2530]/70 to-transparent"></div>

                    {/* Logo at top left */}
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-sm">
                      <div className="h-4 flex items-center justify-center min-w-[60px] max-w-[90px]">
                         {/* Fallback to text if image is not actually available */}
                         <img 
                           src={story.logo} 
                           alt="Company Logo" 
                           className="h-full w-full object-contain"
                           onError={(e) => {
                             (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="20"><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="10" font-weight="bold" fill="%23333">LOGO</text></svg>';
                           }}
                         />
                      </div>
                    </div>

                    {/* Text content at bottom */}
                    <div className="absolute bottom-0 left-0 w-full p-6 text-white flex flex-col justify-end h-1/2">
                      <h3 className="text-sm md:text-base font-bold mb-2 tracking-wide leading-tight">{story.tag}</h3>
                      <p className="text-sm text-gray-200 leading-snug group-hover:text-white transition-colors duration-300 pr-4">
                        {story.title}
                      </p>
                      
                      {/* Interactive Arrow icon (top right arrow like image) */}
                      <div className="absolute bottom-6 right-6 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 text-white">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19L19 5M19 5H8M19 5v11" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
