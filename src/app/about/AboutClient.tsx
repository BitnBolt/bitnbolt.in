"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HomeContent from "@/components/HomeContent";
import CompanyContactDetails from "@/components/CompanyContactDetails";
import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { PAGE_TOP } from "@/lib/layout";

const stats = [
  {
    number: "102+",
    subtitle: "IoT & hardware specialists",
    description: "who've deployed sensors in production—not just prototypes",
  },
  {
    number: "148+",
    subtitle: "Proven IoT architectures",
    description: "for manufacturing, semiconductors, and enterprise systems",
  },
  {
    number: "291+",
    subtitle: "Operational dashboards",
    description: "that turned data into decisions line operators actually use",
  },
  {
    number: "1374+",
    subtitle: "Transformations that",
    description: "started when fragmented systems became too costly to ignore",
  },
];

const coreValues = [
  {
    title: "Accessibility",
    description: "Every industry and scale deserves access to cutting-edge IoT technology.",
  },
  {
    title: "Synergy",
    description: "We blend digital software with hardware prototypes for real-world impact.",
  },
  {
    title: "Impact",
    description: "We deliver results that improve efficiency and lower operational costs.",
  },
  {
    title: "Empowerment",
    description: "We support learning while giving businesses a true competitive edge.",
  },
];

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 110 } },
};

export default function AboutClient() {
  return (
    <main className="min-h-screen bg-white overflow-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-32 right-0 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40" />
        <div className="absolute bottom-40 left-0 w-80 h-80 bg-amber-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30" />
      </div>

      <Header forceWhite />
      <HomeContent>
        {/* Hero */}
        <section className={`relative z-10 ${PAGE_TOP} pb-14 lg:pb-16`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="inline-block text-[#1E88E5] font-semibold text-sm uppercase tracking-wider mb-4">
                  About BitnBolt
                </span>
                <h1 className="text-4xl md:text-5xl font-extrabold text-[#0B1C2D] leading-tight tracking-tight mb-5">
                  Bridging digital innovation with{" "}
                  <span className="text-[#1E88E5]">real-world engineering</span>
                </h1>
                <p className="text-lg text-gray-500 font-light leading-relaxed mb-8">
                  We unite software and hardware so businesses of every size can deploy IoT that
                  works in the field—not just on a slide deck.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/contact"
                    className="bg-[#FFD166] hover:bg-[#FFC033] text-[#0B1C2D] px-8 py-3.5 rounded-full font-semibold text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                  >
                    Get in touch
                  </Link>
                  <Link
                    href="/product"
                    className="border-2 border-gray-200 hover:border-[#1E88E5] text-[#0B1C2D] px-8 py-3.5 rounded-full font-semibold text-center transition-colors"
                  >
                    Explore products
                  </Link>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="flex justify-center lg:justify-end"
              >
                <div className="relative bg-[#f8fafd] rounded-2xl border border-gray-100 p-10 sm:p-14 lg:p-16 shadow-sm">
                  <div className="absolute -top-3 -right-3 w-24 h-24 bg-[#FFD166]/20 rounded-full blur-2xl pointer-events-none" />
                  <div className="absolute -bottom-4 -left-4 w-28 h-28 bg-[#1E88E5]/15 rounded-full blur-2xl pointer-events-none" />
                  <Image
                    src="/icon.png"
                    alt="BitnBolt logo"
                    width={320}
                    height={320}
                    className="relative w-44 h-44 sm:w-56 sm:h-56 lg:w-64 lg:h-64 object-contain"
                    priority
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="relative z-10 py-14 bg-white border-y border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12"
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
            >
              {stats.map((stat) => (
                <motion.div key={stat.subtitle} variants={item} className="text-center group">
                  <div className="text-4xl md:text-5xl font-bold text-[#1E88E5] mb-4 tracking-tight group-hover:text-[#0B1C2D] transition-colors">
                    {stat.number}
                  </div>
                  <div className="w-full h-px bg-blue-100 mb-4 group-hover:bg-blue-200 transition-colors" />
                  <h3 className="text-base font-bold text-[#0B1C2D] mb-1">{stat.subtitle}</h3>
                  <p className="text-sm text-gray-500 font-light leading-relaxed">{stat.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* About story */}
        <section className="relative z-10 py-16 bg-[#f8fafd]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl md:text-4xl font-extrabold text-[#0B1C2D] tracking-tight mb-5">
                  Bits + bolts, built for industry
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  BitnBolt bridges the gap between digital innovation and real-world implementation.
                  Our name reflects the combination of digital bits and mechanical bolts for
                  industrial applications.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  From custom hardware and firmware to cloud dashboards and analytics—we help
                  hundreds of clients across agriculture, manufacturing, energy, and smart
                  infrastructure ship connected products that last.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="relative rounded-lg overflow-hidden shadow-xl aspect-video"
              >
                <Image
                  src="/slideshow/im2.png"
                  alt="BitnBolt custom hardware and IoT engineering"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1C2D]/75 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-[#FFD166] text-xs font-bold uppercase tracking-wider mb-1">
                    Bits + Bolts
                  </p>
                  <p className="text-white text-lg font-semibold">
                    Digital intelligence, built for the physical world
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="relative z-10 py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-[#f8fafd] rounded-lg border border-gray-100 p-8 lg:p-10 border-l-4 border-l-[#1E88E5]"
              >
                <span className="text-xs font-bold uppercase tracking-wider text-[#1E88E5] mb-3 block">
                  Mission
                </span>
                <h2 className="text-2xl font-bold text-[#0B1C2D] mb-4">Make IoT accessible</h2>
                <p className="text-gray-600 leading-relaxed">
                  We make IoT technology easy to learn and highly beneficial for businesses of all
                  sizes—so every company can access cutting-edge solutions, regardless of industry
                  or scale.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-[#f8fafd] rounded-lg border border-gray-100 p-8 lg:p-10 border-l-4 border-l-[#FFD166]"
              >
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-3 block">
                  Vision
                </span>
                <h2 className="text-2xl font-bold text-[#0B1C2D] mb-4">Automate what matters</h2>
                <p className="text-gray-600 leading-relaxed">
                  We see a future where every operational challenge can be addressed through
                  intelligent automation—accelerating growth and efficiency through the convergence
                  of digital software and hardware engineering.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Why us */}
        <section className="relative z-10 py-16 bg-[#f8fafd]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="bg-white rounded-lg border border-gray-100 p-8 shadow-sm">
                <h2 className="text-2xl md:text-3xl font-extrabold text-[#0B1C2D] tracking-tight mb-4">
                  Why choose BitnBolt
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  Businesses choose us because we help them leverage modern IoT to improve daily
                  efficiency and reduce costs. Partnering with BitnBolt gives companies of any scale
                  a strong competitive edge in their market.
                </p>
              </div>
              <div className="bg-white rounded-lg border border-gray-100 p-8 shadow-sm">
                <h2 className="text-2xl md:text-3xl font-extrabold text-[#0B1C2D] tracking-tight mb-4">
                  What makes us different
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  We truly unite the digital world with physical engineering—just like the bits
                  and bolts in our name. We bring advanced IoT to fields and businesses that
                  usually find them hard to reach.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Core values */}
        <section className="relative z-10 py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#0B1C2D] tracking-tight mb-3">
                Our core values
              </h2>
              <p className="text-lg text-gray-500 font-light">
                The principles that guide how we build, partner, and deliver.
              </p>
            </div>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.15 }}
            >
              {coreValues.map((value) => (
                <motion.div
                  key={value.title}
                  variants={item}
                  className="bg-[#f8fafd] rounded-lg p-6 border border-transparent hover:border-blue-200 hover:shadow-md transition-all duration-300 h-full"
                >
                  <h3 className="text-lg font-bold text-[#1E88E5] mb-2">{value.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{value.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Company details */}
        <section className="relative z-10 py-16 bg-[#f8fafd]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#0B1C2D] tracking-tight mb-2">
                Registered company details
              </h2>
              <p className="text-gray-500 font-light text-sm">
                Official information for BITNBOLT PRIVATE LIMITED
              </p>
            </div>
            <CompanyContactDetails />
          </div>
        </section>

        {/* CTA */}
        <section className="relative z-10 py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-[#0B1C2D] rounded-lg p-8 lg:p-12 text-white flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 shadow-xl">
              <div className="max-w-2xl">
                <h2 className="text-2xl lg:text-3xl font-bold mb-3 tracking-tight">
                  Ready to transform your business?
                </h2>
                <p className="text-gray-300 font-light leading-relaxed">
                  Join clients who trust BitnBolt to connect digital innovation with real-world
                  results.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto shrink-0">
                <Link
                  href="/contact"
                  className="bg-[#FFD166] hover:bg-[#FFC033] text-[#0B1C2D] px-8 py-3.5 rounded-full font-bold text-center transition-all hover:shadow-lg"
                >
                  Get started today
                </Link>
                <Link
                  href="/firmware"
                  className="border-2 border-white/30 hover:border-white/60 text-white px-8 py-3.5 rounded-full font-semibold text-center transition-colors hover:bg-white/10"
                >
                  Our services
                </Link>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </HomeContent>
    </main>
  );
}
