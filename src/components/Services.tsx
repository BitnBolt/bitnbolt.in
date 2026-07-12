'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const services = [
  {
    id: 1,
    title: 'IoT Platform',
    description: 'Drive your connected ecosystem with scalable, secure IoT platforms tailored for your business.',
    icon: (
      <svg className="w-7 h-7 sm:w-10 sm:h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    )
  },
  {
    id: 2,
    title: 'Custom Hardware',
    description: 'Custom PCB design—schematic, layout, and production-ready files tailored to your product.',
    href: '/pcb',
    icon: (
      <svg className="w-7 h-7 sm:w-10 sm:h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
      </svg>
    )
  },
  {
    id: 3,
    title: 'Firmware Development',
    description: 'Optimized firmware architectures so devices run reliably with ultra-low power use.',
    href: '/firmware',
    icon: (
      <svg className="w-7 h-7 sm:w-10 sm:h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )
  },
  {
    id: 4,
    title: 'Cloud Integration',
    description: 'Connect edge devices to Azure, AWS, or custom backends for real-time control.',
    icon: (
      <svg className="w-7 h-7 sm:w-10 sm:h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
      </svg>
    )
  },
  {
    id: 5,
    title: 'Data Analytics',
    description: 'Extract actionable insights from telemetry for automation and predictive maintenance.',
    icon: (
      <svg className="w-7 h-7 sm:w-10 sm:h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )
  },
  {
    id: 6,
    title: 'Edge Computing',
    description: 'Move intelligence to the edge—lower latency and empower local decision-making.',
    icon: (
      <svg className="w-7 h-7 sm:w-10 sm:h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 100, damping: 15 }
    }
  };

  return (
    <section id="services" className="py-8 sm:py-12 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mb-6 sm:mb-10"
          initial={{ opacity: 0, y: -12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-1 sm:mb-4">
            Our IoT & Data capabilities
          </h2>
          <p className="text-sm sm:text-xl text-gray-500 font-light">
            Win with our hardware-first approach
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {services.map((service) => {
            const card = (
              <>
              <div className="mb-3 sm:mb-6">{service.icon}</div>
              <h3 className="text-sm sm:text-xl font-bold text-gray-900 mb-1.5 sm:mb-3 leading-snug">{service.title}</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-snug sm:leading-relaxed line-clamp-3 sm:line-clamp-none">{service.description}</p>
              {'href' in service && service.href ? (
                <span className="mt-auto pt-3 text-xs sm:text-sm font-semibold text-[#1E88E5]">Learn more →</span>
              ) : null}
              </>
            );

            return (
            <motion.div
              key={service.id}
              variants={itemVariants}
              className="bg-[#f8fafd] rounded-xl sm:rounded-lg p-3.5 sm:p-8 hover:shadow-md transition-shadow duration-300 border border-transparent hover:border-blue-100 flex flex-col"
            >
              {'href' in service && service.href ? (
                <Link href={service.href} className="flex flex-col flex-1 h-full">
                  {card}
                </Link>
              ) : (
                card
              )}
            </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
