'use client';

import { motion } from 'framer-motion';

export default function Features() {
  const stats = [
    {
      number: '102+',
      subtitle: 'IoT & hardware specialists',
      description: "who've deployed sensors in production—not just prototypes"
    },
    {
      number: '148+',
      subtitle: 'Proven IoT architectures',
      description: 'for manufacturing, semiconductors, and enterprise systems'
    },
    {
      number: '291+',
      subtitle: 'Operational dashboards',
      description: 'that turned data into decisions line operators actually use'
    },
    {
      number: '1374+',
      subtitle: 'Transformations that',
      description: 'started when fragmented systems became too costly to ignore'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
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

  return (
    <section className="py-12 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#0B1C2D] mb-4 tracking-tight">
            Why choose BitnBolt
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto font-light">
            Over 20 years, we've deployed IoT solutions where reliability isn't optional—it's operational.
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center text-center group"
              variants={itemVariants}
            >
              <div className="text-5xl md:text-6xl font-bold text-[#1E88E5] mb-6 tracking-tight group-hover:text-[#0B1C2D] transition-colors duration-300">
                {stat.number}
              </div>
              
              <div className="w-full h-px bg-blue-100 mb-6 group-hover:bg-blue-300 transition-colors duration-300"></div>
              
              <h3 className="text-[17px] font-bold text-[#0B1C2D] mb-2 leading-snug">
                {stat.subtitle}
              </h3>
              
              <p className="text-[15px] text-gray-500 leading-relaxed font-light">
                {stat.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}