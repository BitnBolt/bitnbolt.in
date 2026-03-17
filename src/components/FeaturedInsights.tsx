'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

// Sample data
const insightsData = [
  {
    id: 1,
    type: "Blog",
    title: "AI in semiconductor industry: From design to fab, here's what you need to know",
    category: "Artificial Intelligence",
    image: "/slideshow/im1.png",
  },
  {
    id: 2,
    type: "Blog",
    title: "What is the role of predictive analytics in supply chain optimization?",
    category: "Predictive Analytics",
    image: "/slideshow/im2.png",
  },
  {
    id: 3,
    type: "Blog",
    title: "Data analytics in semiconductor: Transforming manufacturing with actionable insights",
    category: "Data Analytics",
    image: "/slideshow/im3.png",
  },
  {
    id: 4,
    type: "Blog",
    title: "AI in supply chain: Benefits, steps, use cases, and AI implementations",
    category: "Artificial Intelligence",
    image: "/slideshow/im1.png",
  },
  {
    id: 5,
    type: "Whitepaper",
    title: "Building next-gen hardware for intelligent edge computing",
    category: "Edge Computing",
    image: "/slideshow/im2.png",
  },
  {
    id: 6,
    type: "Portfolio",
    title: "Case Study: Modernizing a legacy manufacturing plant with IoT",
    category: "Industrial IoT",
    image: "/slideshow/im3.png",
  }
];

const categories = ["All", "Blog", "Whitepaper", "Portfolio"];

export default function FeaturedInsights() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(0);

  const filteredInsights = activeCategory === "All" 
    ? insightsData 
    : insightsData.filter(item => item.type === activeCategory);

  const itemsPerPage = 4;
  const totalPages = Math.ceil(filteredInsights.length / itemsPerPage);
  
  const paginatedInsights = filteredInsights.slice(
    currentPage * itemsPerPage, 
    (currentPage + 1) * itemsPerPage
  );

  const next = () => {
    if (currentPage < totalPages - 1) setCurrentPage(prev => prev + 1);
  };

  const prev = () => {
    if (currentPage > 0) setCurrentPage(prev => prev - 1);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section id="insights" className="py-12 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header and Filter Tabs */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-3xl md:text-3xl lg:text-4xl font-extrabold text-[#0B1C2D] mb-2 tracking-tight">
              Featured insights
            </h2>
            <p className="text-lg text-gray-500 font-light">
              Our thoughts and perspectives on new-age technology.
            </p>
          </motion.div>

          <motion.div 
            className="flex space-x-6 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto hide-scrollbar"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setCurrentPage(0); }}
                className={`text-[15px] font-medium transition-colors relative whitespace-nowrap pb-1 ${
                  activeCategory === cat ? 'text-[#0B1C2D]' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {cat}
                {activeCategory === cat && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-yellow-400 rounded-t"></span>
                )}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Grid of Insights */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          key={`${activeCategory}-${currentPage}`}
        >
          {paginatedInsights.map((item, index) => (
            <motion.div 
              key={`${item.id}-${index}`}
              variants={itemVariants}
              className="group flex flex-col sm:flex-row bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden h-full"
            >
              {/* Content Side (Left) */}
              <div className="p-6 flex flex-col flex-1 relative order-2 sm:order-1 border-r border-transparent">
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-[#FFD166] text-amber-900 text-xs font-semibold rounded-md">
                    {item.type}
                  </span>
                </div>
                
                <h3 className="text-[17px] font-bold text-[#0B1C2D] mb-8 leading-snug line-clamp-3 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>
                
                <div className="mt-auto flex justify-between items-end">
                  <span className="inline-block px-3 py-1.5 border border-gray-200 text-gray-600 text-[11px] font-medium rounded-full shrink-0 max-w-full truncate">
                    {item.category}
                  </span>
                  
                  {/* Subtle decorative icon */}
                  <div className="text-gray-300 ml-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Image Side (Right) */}
              <div className="sm:w-[45%] p-3 order-1 sm:order-2 shrink-0">
                 <div className="relative w-full h-56 sm:h-full rounded-lg overflow-hidden">
                   <img 
                      src={item.image} 
                      alt={item.title} 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                   />
                 </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty state fallback */}
        {paginatedInsights.length === 0 && (
          <div className="py-20 text-center text-gray-500">
            No insights found for this category.
          </div>
        )}

        {/* Pagination Buttons */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-end gap-3">
            <button 
              onClick={prev}
              disabled={currentPage === 0}
              className={`w-11 h-11 flex items-center justify-center rounded-md transition-all ${
                currentPage === 0 
                  ? 'bg-gray-50 text-gray-300 cursor-not-allowed' 
                  : 'bg-gray-100 hover:bg-[#0B1C2D] text-gray-600 hover:text-white shadow-sm'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              onClick={next}
              disabled={currentPage === totalPages - 1}
              className={`w-11 h-11 flex items-center justify-center rounded-md transition-all ${
                currentPage === totalPages - 1 
                  ? 'bg-gray-50 text-gray-300 cursor-not-allowed' 
                  : 'bg-gray-100 hover:bg-[#0B1C2D] text-gray-600 hover:text-white shadow-sm'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
      
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
