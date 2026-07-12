'use client';

import { motion } from 'framer-motion';

export default function Features() {
  const stats = [
    {
      number: '1',
      subtitle: 'Year of building',
      description: 'focused on real IoT hardware, firmware, and usable products—not slideware'
    },
    {
      number: '3+',
      subtitle: 'Live product lines',
      description: 'IoT learning kits, hydroponics systems, and smart monitoring solutions'
    },
    {
      number: '14+',
      subtitle: 'Kit modules shipped',
      description: 'in one development board so students and builders start without hunting parts'
    },
    {
      number: '100%',
      subtitle: 'In-house stack',
      description: 'from sensors and ESP32 firmware to dashboards your team can actually run'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 }
    }
  };

  const itemVariants = {
    hidden: { y: 16, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring" as const, stiffness: 100 }
    }
  };

  return (
    <section className="py-8 sm:py-12 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center mb-8 sm:mb-16"
          initial={{ opacity: 0, y: -16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#0B1C2D] mb-2 sm:mb-4 tracking-tight">
            Why choose BitnBolt
          </h2>
          <p className="text-sm sm:text-lg text-gray-600 max-w-2xl mx-auto font-light px-1">
            One year in—shipping real IoT hardware, firmware, and dashboards that work together.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-start sm:items-center text-left sm:text-center group rounded-xl bg-[#f8fafd] sm:bg-transparent p-3.5 sm:p-0"
              variants={itemVariants}
            >
              <div className="text-3xl sm:text-5xl md:text-6xl font-bold text-[#1E88E5] mb-2 sm:mb-6 tracking-tight group-hover:text-[#0B1C2D] transition-colors duration-300">
                {stat.number}
              </div>

              <div className="hidden sm:block w-full h-px bg-blue-100 mb-6 group-hover:bg-blue-300 transition-colors duration-300" />

              <h3 className="text-sm sm:text-[17px] font-bold text-[#0B1C2D] mb-1 sm:mb-2 leading-snug">
                {stat.subtitle}
              </h3>

              <p className="text-xs sm:text-[15px] text-gray-500 leading-snug sm:leading-relaxed font-light line-clamp-3 sm:line-clamp-none">
                {stat.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
