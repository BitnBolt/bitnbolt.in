'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const industries = [
  {
    id: 1,
    title: "Smart Agriculture (Agri-Tech)",
    description:
      "We automate and optimize farming environments with smart sensor networks and localized control systems that maximize crop yield and resource efficiency.",
    bullets: [
      "Integrated nutrient dosing, pH/TDS monitoring, and environment regulation for hydroponics and aeroponics",
      "Low-power soil sensors for moisture, temperature, and light-driven precision irrigation",
      "Automated lighting and EMS to maintain optimal greenhouse microclimates",
      "Edge-based crop health analytics for yield prediction in remote rural areas",
    ],
    image: "industries/im1.png",
  },
  {
    id: 2,
    title: "Industrial IoT & Smart Manufacturing (Industry 4.0)",
    description:
      "We bring legacy machinery into the digital age with custom data-logging hardware and edge analytics that prevent costly downtime.",
    bullets: [
      "Vibration, temperature, and acoustic sensors that flag equipment failure before it happens",
      "Industrial gateways using Modbus RS485, LoRa, or ESP-NOW for factory-floor telemetry",
      "Real-time tracking of inventory and heavy machinery location, status, and movement",
      "Smart power meters that analyze factory energy loads to cut utility overhead",
    ],
    image: "industries/im2.png",
  },
  {
    id: 3,
    title: "Electric Vehicles (EV) & Charging Infrastructure",
    description:
      "We design the electronics and connected firmware that make charging stations and vehicle sub-systems reliable, secure, and smart.",
    bullets: [
      "Custom PCBs and BOM architectures for smart AC/DC EV charging piles",
      "AWS/Azure integration for slot booking, user authentication, and billing analytics",
      "Optimized BMS firmware for cell voltage, temperature, and state-of-charge monitoring",
      "Edge intelligence at charging hubs for dynamic power distribution based on grid demand",
    ],
    image: "industries/im3.png",
  },
  {
    id: 4,
    title: "Smart Home & Commercial Building Automation",
    description:
      "We build power-efficient hardware ecosystems for lighting, water automation, and real-time building dashboards.",
    bullets: [
      "Custom embedded boards for climate control, adaptive lighting, and water tank automation",
      "Ultra-low-power firmware for smart locks, security switches, and occupancy sensors",
      "Local edge gateways that process in-building data before syncing relevant telemetry to the cloud",
      "Secure OTA updates to refresh security protocols across thousands of units instantly",
    ],
    image: "industries/im4.png",
  },
  {
    id: 5,
    title: "Renewable Energy & Smart Grid Inverters",
    description:
      "We design advanced control electronics, optimized switching firmware, and cloud-connected telemetry for efficient power conversion and stable grid synchronization.",
    bullets: [
      "Custom PCB designs for solar string inverters, micro-inverters, and wind energy converters",
      "Low-latency firmware for MPPT and Space Vector PWM switching algorithms",
      "Edge algorithms for grid fault detection, load balancing, and phase synchronization",
      "Cloud telemetry dashboards for generation metrics and predictive maintenance alerts",
    ],
    image: "industries/im5.png",
  },
];

export default function Industries() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => setCurrentIndex((prev) => (prev + 1) % industries.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + industries.length) % industries.length);

  return (
    <section className="bg-[#05111A] text-white overflow-hidden w-full m-0 p-0">
      <div className="flex flex-col lg:flex-row items-stretch w-full min-h-[650px]">
        
        {/* Left pane - Text Intro */}
        <div className="w-full lg:w-[28%] relative flex flex-col justify-center py-16 lg:py-0 z-20">
          <div className="bg-[#0B1C2D] py-5 px-8 lg:pl-16 lg:-mr-32 mb-8 relative z-20 shadow-2xl">
            <h2 className="text-3xl md:text-3xl lg:text-4xl font-extrabold tracking-tight">
              Industries we serve
            </h2>
          </div>
          <p className="text-lg md:text-xl font-light text-gray-300 max-w-sm px-8 lg:pl-16 leading-relaxed">
            We use new-age technologies to drive innovation and impact
          </p>
        </div>

        {/* Middle pane - Image */}
        <div className="w-full lg:w-[32%] relative z-10 flex items-center justify-center p-8 lg:p-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="w-full h-[400px] lg:h-[85%] relative shadow-2xl overflow-hidden"
            >
              <img
                src={industries[currentIndex].image}
                alt={industries[currentIndex].title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right pane - Vertical Content and Controls */}
        <div className="w-full lg:w-[40%] bg-[#0B1C2D] relative py-16 px-8 lg:pl-16 lg:pr-24 flex flex-col justify-center">
          
          {/* External nav controls on right edge visible mostly on desktop */}
          <div className="lg:absolute lg:right-6 lg:top-1/2 lg:-translate-y-1/2 flex lg:flex-col gap-3 z-30 mb-8 lg:mb-0 justify-end">
            <button 
              onClick={prev}
              className="w-10 h-10 bg-[#163554] hover:bg-[#1E88E5] rounded-md flex items-center justify-center text-white transition-colors shadow-lg group"
              aria-label="Previous Industry"
            >
              <svg className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </button>
            <button 
              onClick={next}
              className="w-10 h-10 bg-[#163554] hover:bg-[#1E88E5] rounded-md flex items-center justify-center text-white transition-colors shadow-lg group"
              aria-label="Next Industry"
            >
              <svg className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          <div className="max-w-lg">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
              >
                <h3 className="text-xl md:text-2xl font-bold mb-3">
                  {industries[currentIndex].title}
                </h3>
                <p className="text-gray-300 text-[15px] mb-6 leading-relaxed">
                  {industries[currentIndex].description}
                </p>
                
                <ul className="space-y-4 mb-10">
                  {industries[currentIndex].bullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-start text-[14px] text-gray-300">
                      <span className="w-1 h-1 rounded-full bg-white mt-2 mr-3 shrink-0"></span>
                      <span className="leading-relaxed hover:text-white transition-colors">{bullet}</span>
                    </li>
                  ))}
                </ul>

                <div>
                  <button className="bg-[#FFD166] text-amber-900 px-7 py-3 rounded-full font-bold text-sm hover:bg-[#FFC033] hover:shadow-lg transition-all">
                    Read more
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
