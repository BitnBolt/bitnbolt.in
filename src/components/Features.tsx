'use client';

import { motion } from 'framer-motion';

export default function Features() {
  const features = [
    {
      title: 'Advanced IoT Ecosystem',
      description: 'Seamlessly connect all devices in a unified, intelligent network that adapts to your needs.',
      icon: '🌐',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'AI-Powered Automation',
      description: 'Machine learning algorithms that continuously improve and automate your processes.',
      icon: '🤖',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      title: 'Enterprise Security',
      description: 'Military-grade encryption and security protocols to keep your data and devices safe.',
      icon: '🔒',
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'Custom Development',
      description: 'Tailor-made IoT solutions designed specifically for your business requirements.',
      icon: '⚙️',
      color: 'bg-amber-100 text-amber-600'
    },
    {
      title: 'Cloud Integration',
      description: 'Seamless connection with leading cloud platforms for unlimited scalability.',
      icon: '☁️',
      color: 'bg-cyan-100 text-cyan-600'
    },
    {
      title: '24/7 Expert Support',
      description: 'Round-the-clock assistance from our team of IoT specialists whenever you need help.',
      icon: '🛠️',
      color: 'bg-red-100 text-red-600'
    }
  ];

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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { 
        type: "spring" as const, 
        stiffness: 100 
      }
    }
  };

  return (
    <section className="py-16 bg-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-50 rounded-full opacity-70"></div>
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-purple-50 rounded-full opacity-70"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Why Choose BitnBolt?
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            We combine cutting-edge technology with industry expertise to deliver IoT solutions that transform businesses.
          </motion.p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 relative overflow-hidden group"
              variants={itemVariants}
            >
              <div className={`absolute right-0 top-0 w-32 h-32 rounded-full ${feature.color} opacity-10 -mr-10 -mt-10 transform group-hover:scale-150 transition-transform duration-500`}></div>
              
              <div className="relative z-10">
                <div className={`w-16 h-16 rounded-lg ${feature.color} flex items-center justify-center text-2xl mb-4 transform transition-transform group-hover:scale-110 duration-300`}>
                  <span className="text-3xl">{feature.icon}</span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 group-hover:text-gray-900 transition-colors duration-300">
                  {feature.description}
                </p>
                
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Call to action */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <a 
            href="#products" 
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 inline-block"
          >
            Explore Our Solutions
          </a>
        </motion.div>
      </div>
    </section>
  );
} 