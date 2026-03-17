'use client';

import { motion } from 'framer-motion';

const services = [
  {
    id: 1,
    title: 'IoT Platform',
    description: 'Drive your connected ecosystem forward with scalable, secure, and intelligent IoT platforms tailored for your business.',
    icon: (
      <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    )
  },
  {
    id: 2,
    title: 'Custom Hardware',
    description: 'Design and manufacture specialized hardware solutions ranging from PCB design to full product prototyping.',
    icon: (
      <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
      </svg>
    )
  },
  {
    id: 3,
    title: 'Firmware Development',
    description: 'Robust and highly optimized firmware architectures ensuring your devices run reliably with ultra-low power consumption.',
    icon: (
      <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )
  },
  {
    id: 4,
    title: 'Cloud Integration',
    description: 'Seamlessly connect your edge devices to Azure, AWS, or custom cloud backends for real-time telemetry and control.',
    icon: (
      <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
      </svg>
    )
  },
  {
    id: 5,
    title: 'Data Analytics',
    description: 'Extract actionable insights from telemetry data to enhance automation, predictive maintenance, and precision-driven outcomes.',
    icon: (
      <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )
  },
  {
    id: 6,
    title: 'Edge Computing',
    description: 'Migrate intelligence to the edge, minimizing latency and bandwidth while empowering devices with local decision-making.',
    icon: (
      <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    )
  }
];

export default function Services() {
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
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <section id="services" className="py-12 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Row 1 */}
          <div className="md:col-span-2 flex flex-col justify-center pr-8 mb-8 md:mb-0">
            <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-4">
              Our IoT & Data <br className="hidden md:block" /> capabilities
            </motion.h2>
            <motion.p variants={itemVariants} className="text-xl text-gray-500 font-light">
              Win with our hardware-first approach
            </motion.p>
          </div>
          
          <motion.div variants={itemVariants} className="bg-[#f8fafd] rounded-lg p-8 hover:shadow-lg transition-shadow duration-300 border border-transparent hover:border-blue-100 flex flex-col h-full">
            <div className="mb-6">{services[0].icon}</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{services[0].title}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{services[0].description}</p>
          </motion.div>

          {/* Row 2 */}
          <div className="hidden md:block md:col-span-1"></div>
          <motion.div variants={itemVariants} className="bg-[#f8fafd] rounded-lg p-8 hover:shadow-lg transition-shadow duration-300 border border-transparent hover:border-blue-100 flex flex-col h-full">
            <div className="mb-6">{services[1].icon}</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{services[1].title}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{services[1].description}</p>
          </motion.div>
          
          <motion.div variants={itemVariants} className="bg-[#f8fafd] rounded-lg p-8 hover:shadow-lg transition-shadow duration-300 border border-transparent hover:border-blue-100 flex flex-col h-full">
            <div className="mb-6">{services[2].icon}</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{services[2].title}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{services[2].description}</p>
          </motion.div>

          {/* Row 3 */}
          <motion.div variants={itemVariants} className="bg-[#f8fafd] rounded-lg p-8 hover:shadow-lg transition-shadow duration-300 border border-transparent hover:border-blue-100 flex flex-col h-full">
            <div className="mb-6">{services[3].icon}</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{services[3].title}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{services[3].description}</p>
          </motion.div>
          
          <motion.div variants={itemVariants} className="bg-[#f8fafd] rounded-lg p-8 hover:shadow-lg transition-shadow duration-300 border border-transparent hover:border-blue-100 flex flex-col h-full">
            <div className="mb-6">{services[4].icon}</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{services[4].title}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{services[4].description}</p>
          </motion.div>
          
          <motion.div variants={itemVariants} className="bg-[#f8fafd] rounded-lg p-8 hover:shadow-lg transition-shadow duration-300 border border-transparent hover:border-blue-100 flex flex-col h-full">
            <div className="mb-6">{services[5].icon}</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{services[5].title}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{services[5].description}</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
