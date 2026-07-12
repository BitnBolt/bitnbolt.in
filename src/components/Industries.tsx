'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const industries = [
  {
    id: 1,
    title: "Smart Agriculture (Agri-Tech)",
    description:
      "We automate farming environments with smart sensors and control systems that improve yield and resource efficiency.",
    bullets: [
      "Nutrient dosing, pH/TDS monitoring for hydroponics",
      "Soil sensors for precision irrigation",
      "Greenhouse climate and lighting control",
      "Edge analytics for crop health in remote areas",
    ],
    image: "industries/im1.png",
  },
  {
    id: 2,
    title: "Industrial IoT & Manufacturing",
    description:
      "Bring legacy machinery online with custom logging hardware and edge analytics that prevent downtime.",
    bullets: [
      "Vibration and temperature predictive alerts",
      "Industrial gateways: Modbus, LoRa, ESP-NOW",
      "Asset and inventory tracking on the floor",
      "Smart meters to cut energy overhead",
    ],
    image: "industries/im2.png",
  },
  {
    id: 3,
    title: "EV & Charging Infrastructure",
    description:
      "Electronics and firmware that make charging stations and vehicle sub-systems reliable and smart.",
    bullets: [
      "Custom PCBs for AC/DC charging piles",
      "Cloud booking, auth, and billing analytics",
      "BMS firmware for voltage and SoC monitoring",
      "Edge power distribution at charging hubs",
    ],
    image: "industries/im3.png",
  },
  {
    id: 4,
    title: "Smart Home & Buildings",
    description:
      "Power-efficient hardware for lighting, water automation, and real-time building dashboards.",
    bullets: [
      "Boards for climate, lighting, and tank automation",
      "Low-power firmware for locks and occupancy",
      "Local edge gateways before cloud sync",
      "Secure OTA updates across device fleets",
    ],
    image: "industries/im4.png",
  },
  {
    id: 5,
    title: "Renewable Energy & Smart Grid",
    description:
      "Control electronics and cloud telemetry for efficient power conversion and grid sync.",
    bullets: [
      "PCBs for solar and wind converters",
      "Low-latency MPPT and PWM firmware",
      "Edge fault detection and load balancing",
      "Dashboards for generation and maintenance",
    ],
    image: "industries/im5.png",
  },
];

export default function Industries() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => setCurrentIndex((prev) => (prev + 1) % industries.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + industries.length) % industries.length);

  return (
    <section className="bg-[#05111A] text-white overflow-hidden w-full">
      <div className="flex flex-col lg:flex-row items-stretch w-full lg:min-h-[650px]">

        <div className="w-full lg:w-[28%] relative flex flex-col justify-center pt-8 pb-4 lg:py-0 z-20">
          <div className="bg-[#0B1C2D] py-3 px-4 sm:py-5 sm:px-8 lg:pl-16 lg:-mr-32 mb-4 sm:mb-8 relative z-20 shadow-xl">
            <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
              Industries we serve
            </h2>
          </div>
          <p className="text-sm sm:text-lg md:text-xl font-light text-gray-300 max-w-sm px-4 sm:px-8 lg:pl-16 leading-snug sm:leading-relaxed">
            New-age tech for real-world impact
          </p>
        </div>

        <div className="w-full lg:w-[32%] relative z-10 flex items-center justify-center px-4 py-3 sm:p-8 lg:p-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.4 }}
              className="w-full h-[200px] sm:h-[400px] lg:h-[85%] relative shadow-xl overflow-hidden rounded-lg lg:rounded-none"
            >
              <img
                src={industries[currentIndex].image}
                alt={industries[currentIndex].title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="w-full lg:w-[40%] bg-[#0B1C2D] relative py-6 px-4 sm:py-16 sm:px-8 lg:pl-16 lg:pr-24 flex flex-col justify-center">
          <div className="flex lg:absolute lg:right-6 lg:top-1/2 lg:-translate-y-1/2 lg:flex-col gap-2 sm:gap-3 z-30 mb-4 lg:mb-0 justify-end">
            <button
              onClick={prev}
              className="w-9 h-9 sm:w-10 sm:h-10 bg-[#163554] hover:bg-[#1E88E5] rounded-md flex items-center justify-center text-white transition-colors"
              aria-label="Previous Industry"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </button>
            <button
              onClick={next}
              className="w-9 h-9 sm:w-10 sm:h-10 bg-[#163554] hover:bg-[#1E88E5] rounded-md flex items-center justify-center text-white transition-colors"
              aria-label="Next Industry"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          <div className="max-w-lg">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35 }}
              >
                <h3 className="text-base sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3">
                  {industries[currentIndex].title}
                </h3>
                <p className="text-gray-300 text-sm sm:text-[15px] mb-4 sm:mb-6 leading-snug sm:leading-relaxed">
                  {industries[currentIndex].description}
                </p>

                <ul className="space-y-2 sm:space-y-4 mb-6 sm:mb-10">
                  {industries[currentIndex].bullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-start text-xs sm:text-[14px] text-gray-300">
                      <span className="w-1 h-1 rounded-full bg-white mt-1.5 sm:mt-2 mr-2.5 sm:mr-3 shrink-0" />
                      <span className="leading-snug sm:leading-relaxed">{bullet}</span>
                    </li>
                  ))}
                </ul>

                <button className="bg-[#FFD166] text-amber-900 px-5 py-2.5 sm:px-7 sm:py-3 rounded-full font-bold text-xs sm:text-sm hover:bg-[#FFC033] transition-all">
                  Read more
                </button>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
