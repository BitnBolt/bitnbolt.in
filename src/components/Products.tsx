'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

type ProductsProps = {
  limit?: number;
  showAllLink?: boolean;
};

const upcomingProducts = [
  {
    id: 1,
    name: 'Smart Water Tank',
    category: 'IoT',
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=600&fit=crop',
    description:
      'Monitor tank levels, detect leaks, and automate refill—live alerts on your phone.',
    features: ['Level Monitoring', 'Leak Alerts', 'Auto Pump Control', 'Mobile App'],
    reference: 'https://www.flosenso.com/',
  },
  {
    id: 2,
    name: 'Smart Solar Inverter',
    category: 'Energy',
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&h=600&fit=crop',
    description:
      'Track generation, optimize load, and manage solar power with cloud-connected controls.',
    features: ['Live Generation Data', 'Load Management', 'Remote Control', 'Efficiency Insights'],
    reference: 'https://eastmansolar.in/',
  },
  {
    id: 3,
    name: 'SMPS',
    category: 'Power',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop',
    description:
      'Reliable switched-mode power supplies engineered for industrial and IoT deployments.',
    features: ['Stable Output', 'Compact Design', 'Industrial Grade', 'Wide Input Range'],
    reference: 'https://www.smpsindia.com/',
  },
  {
    id: 4,
    name: 'Smart Farming',
    category: 'Agriculture',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop',
    description:
      'Soil, weather, and irrigation in one system—precision farming for higher yields.',
    features: ['Soil Sensors', 'Irrigation Control', 'Weather Sync', 'Crop Analytics'],
    reference: 'https://www.smartfarmingindia.com/index.html',
  },
];

export default function Products({ limit, showAllLink = false }: ProductsProps) {
  const limited =
    typeof limit === 'number' && limit > 0
      ? upcomingProducts.slice(0, limit)
      : upcomingProducts;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring' as const, stiffness: 100 },
    },
  };

  return (
    <section id="products" className="py-8 sm:py-12 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="mb-6 sm:mb-12"
          initial={{ opacity: 0, y: -16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1C2D] mb-1 sm:mb-2 tracking-tight">
            Shop IoT Solutions
          </h2>
          <p className="text-sm sm:text-lg text-gray-500 font-light">
            Four upcoming products—built in-house and launching soon
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
        >
          {limited.map((product) => (
            <motion.article
              key={product.id}
              variants={itemVariants}
              className="bg-white rounded-xl sm:rounded-lg shadow-sm border border-gray-100 overflow-hidden group flex flex-col"
            >
              <div className="relative h-36 sm:h-48 overflow-hidden bg-gray-100">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={400}
                  height={300}
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                />
              </div>

              <div className="p-3 sm:p-5 flex flex-col flex-1">
                <span className="text-[10px] sm:text-xs font-medium text-[#1E88E5] bg-blue-50 px-2 py-0.5 rounded-full w-fit mb-2">
                  {product.category}
                </span>

                <h3 className="text-sm sm:text-lg font-bold text-[#0B1C2D] mb-1.5 sm:mb-2 line-clamp-2">
                  {product.name}
                </h3>

                <p className="hidden sm:block text-sm text-gray-500 font-light leading-relaxed mb-3 line-clamp-2">
                  {product.description}
                </p>

                <div className="hidden sm:flex flex-wrap gap-1.5 mb-4">
                  {product.features.slice(0, 3).map((feature) => (
                    <span
                      key={feature}
                      className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[11px] rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                <div className="mt-auto pt-2">
                  <Link
                    href="/contact"
                    className="w-full border border-gray-200 text-[#0B1C2D] py-2 sm:py-2.5 px-2 rounded-md hover:bg-gray-50 text-xs sm:text-sm font-medium flex items-center justify-center transition-colors"
                  >
                    Notify me · Coming soon
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>

        {/* {showAllLink && (
          <motion.div
            className="mt-8 sm:mt-12 flex justify-center"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <Link
              href="/product"
              className="px-5 py-2.5 sm:px-6 sm:py-3 rounded-full bg-white border border-gray-200 text-sm sm:text-base hover:border-gray-300 text-gray-800 font-medium"
            >
              Browse live products
            </Link>
          </motion.div>
        )} */}
      </div>
    </section>
  );
}
