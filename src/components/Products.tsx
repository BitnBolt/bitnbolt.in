'use client';

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";

type ProductsProps = {
  limit?: number;
  showAllLink?: boolean;
};

export default function Products({ limit, showAllLink = false }: ProductsProps) {
  const [activeCategory, setActiveCategory] = useState("All");

  const products = [
    {
      id: 1,
      name: "Smart Home Hub Pro - WiFi Enabled",
      category: "IoT",
      price: 299,
      originalPrice: 399,
      rating: 4.8,
      reviewCount: 1247,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
      description: "Centralized control for all your smart home devices with AI-powered automation.",
      features: ["Voice Control", "Mobile App", "Energy Monitoring", "Security Integration"],
      inStock: true,
      fastDelivery: true,
      prime: true
    },
    {
      id: 2,
      name: "Industrial IoT Gateway - Enterprise Grade",
      category: "Custom Made",
      price: 1299,
      originalPrice: 1599,
      rating: 4.9,
      reviewCount: 856,
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop",
      description: "Custom industrial IoT solution for manufacturing and process automation.",
      features: ["Real-time Monitoring", "Predictive Maintenance", "Cloud Integration", "Scalable"],
      inStock: true,
      fastDelivery: false,
      prime: true
    },
    {
      id: 3,
      name: "Smart Agriculture System - Complete Kit",
      category: "IoT",
      price: 599,
      originalPrice: 799,
      rating: 4.7,
      reviewCount: 2341,
      image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop",
      description: "Complete IoT solution for precision agriculture and crop management.",
      features: ["Soil Monitoring", "Weather Integration", "Automated Irrigation", "Crop Analytics"],
      inStock: true,
      fastDelivery: true,
      prime: true
    },
    {
      id: 4,
      name: "Custom Retail Analytics Platform",
      category: "Custom Made",
      price: 899,
      originalPrice: 1199,
      rating: 4.6,
      reviewCount: 567,
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop",
      description: "Tailored retail analytics system with customer behavior tracking.",
      features: ["Foot Traffic Analysis", "Inventory Management", "Customer Insights", "POS Integration"],
      inStock: false,
      fastDelivery: false,
      prime: false
    },
    {
      id: 5,
      name: "Healthcare IoT Monitor - HIPAA Compliant",
      category: "Healthcare",
      price: 799,
      originalPrice: 999,
      rating: 4.9,
      reviewCount: 1892,
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop",
      description: "Advanced health monitoring system for hospitals and clinics.",
      features: ["Patient Monitoring", "Alert System", "Data Analytics", "HIPAA Compliant"],
      inStock: true,
      fastDelivery: true,
      prime: true
    },
    {
      id: 6,
      name: "Smart Energy Management System",
      category: "Industrial",
      price: 1499,
      originalPrice: 1899,
      rating: 4.8,
      reviewCount: 743,
      image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&h=300&fit=crop",
      description: "Custom energy management solution for commercial buildings.",
      features: ["Load Balancing", "Cost Optimization", "Renewable Integration", "Reporting"],
      inStock: true,
      fastDelivery: false,
      prime: true
    }
  ];

  const categories = ["All", "IoT", "Custom Made", "Smart Home", "Industrial", "Healthcare"];

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

  // Filter products based on active category
  let filteredProducts = activeCategory === "All" 
    ? products 
    : products.filter(product => product.category === activeCategory);

  const limited = typeof limit === 'number' && limit > 0 ? filteredProducts.slice(0, limit) : filteredProducts;

  return (
    <section id="products" className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-blue-50 to-transparent"></div>
      <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header with animations */}
        <motion.div 
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <motion.div 
              className="inline-block bg-blue-100 text-blue-600 px-4 py-2 rounded-full mb-4 font-medium text-sm"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Our Products
            </motion.div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              Shop IoT Solutions
            </h2>
          </div>
        </motion.div>

        {/* Products Grid with staggered animations */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {limited.map((product) => (
            <motion.div
              key={product.id}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              {/* Product Image with hover effect */}
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={400}
                  height={300}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  {product.prime && (
                    <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
                      PRIME
                    </span>
                  )}
                  {product.fastDelivery && (
                    <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
                      FAST DELIVERY
                    </span>
                  )}
                  {!product.inStock && (
                    <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
                      OUT OF STOCK
                    </span>
                  )}
                </div>

                {/* Wishlist Button */}
                <button className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 group">
                  <svg className="w-5 h-5 text-gray-600 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>

              {/* Product Info */}
              <div className="p-5">
                {/* Category Badge */}
                <div className="mb-2">
                  <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2.5 py-1 rounded-full">
                    {product.category}
                  </span>
                </div>
                
                {/* Product Name */}
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center mb-3">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 ml-2">
                    {product.rating} ({product.reviewCount})
                  </span>
                </div>

                {/* Features Pills */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1.5">
                    {product.features.slice(0, 3).map((feature, index) => (
                      <span
                        key={index}
                        className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-baseline mb-4">
                  <span className="text-2xl font-bold text-gray-900">${product.price}</span>
                  {product.originalPrice > product.price && (
                    <>
                      <span className="text-lg text-gray-500 line-through ml-2">${product.originalPrice}</span>
                      <span className="text-sm text-green-600 font-medium ml-2">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off
                      </span>
                    </>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  {product.inStock ? (
                    <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Add to Cart
                    </button>
                  ) : (
                    <button className="w-full bg-gray-400 text-white py-3 px-4 rounded-xl cursor-not-allowed font-medium flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Out of Stock
                    </button>
                  )}
                  <button className="w-full border-2 border-gray-300 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View Details
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer actions */}
        <motion.div 
          className="mt-12 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          {showAllLink && (
            <Link href="/product" className="px-6 py-3 rounded-full bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-800 font-medium">
              Show all products
            </Link>
          )}
        </motion.div>
      </div>
    </section>
  );
} 