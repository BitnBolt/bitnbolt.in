"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HomeContent from "@/components/HomeContent";
import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { useState, useEffect } from "react";
import { PAGE_TOP } from "@/lib/layout";

const firmwareCapabilities = [
  {
    title: "RTOS & bare-metal",
    description: "FreeRTOS, Zephyr, and custom schedulers tuned for deterministic real-time response.",
    accent: "bg-[#1E88E5]/10 text-[#1E88E5]",
  },
  {
    title: "Wireless stacks",
    description: "BLE, Wi-Fi, LoRa, and MQTT firmware with secure pairing and reconnect logic.",
    accent: "bg-amber-50 text-amber-700",
  },
  {
    title: "Low-power design",
    description: "Sleep modes, wake sources, and power profiling to extend battery life in the field.",
    accent: "bg-green-50 text-green-700",
  },
  {
    title: "OTA & bootloaders",
    description: "Signed firmware updates, rollback safety, and factory flashing workflows.",
    accent: "bg-purple-50 text-purple-700",
  },
  {
    title: "BSP & drivers",
    description: "Board support packages and peripheral drivers for sensors, displays, and motor control.",
    accent: "bg-blue-50 text-blue-700",
  },
  {
    title: "Security & encryption",
    description: "Secure boot, flash encryption, TLS stacks, and key provisioning for production devices.",
    accent: "bg-rose-50 text-rose-700",
  },
];

const softwareSolutions = [
  {
    title: "Enterprise IoT Dashboard",
    description:
      "A comprehensive dashboard for monitoring all your IoT devices in real-time. Custom alerts, data visualization, and predictive maintenance.",
    image: "/slideshow/im5.png",
    technologies: ["React", "Node.js", "MongoDB", "WebSockets", "TensorFlow"],
    features: [
      "Real-time device monitoring",
      "Custom alerts and notifications",
      "Data visualization and analytics",
      "User role management",
      "API integration capabilities",
      "Predictive maintenance algorithms",
    ],
  },
  {
    title: "Mobile Device Control",
    description:
      "Control all your IoT devices from anywhere with our mobile application. Secure, reliable interface for iOS and Android.",
    image: "/slideshow/im4.png",
    technologies: ["React Native", "Firebase", "GraphQL", "OAuth 2.0", "AWS"],
    features: [
      "Cross-platform (iOS/Android)",
      "Secure authentication",
      "Voice commands",
      "Geolocation-based automation",
      "Offline functionality",
      "Energy usage monitoring",
    ],
  },
  {
    title: "Industrial Monitoring System",
    description:
      "Designed for manufacturing environments — monitors equipment health, production metrics, and environmental conditions.",
    image: "/industries/im2.png",
    technologies: ["Angular", "Python", ".NET Core", "SQL Server", "Docker"],
    features: [
      "Equipment health monitoring",
      "Production metrics tracking",
      "Environmental condition alerts",
      "Compliance reporting",
      "Maintenance scheduling",
      "Digital twin visualization",
    ],
  },
  {
    title: "Smart Agriculture Platform",
    description:
      "AI-powered agriculture platform integrating soil sensors, weather data, and irrigation systems for precision farming.",
    image: "/industries/im1.png",
    technologies: ["Vue.js", "Django", "PostgreSQL", "TensorFlow", "MQTT"],
    features: [
      "Soil condition monitoring",
      "Weather data integration",
      "Irrigation automation",
      "Crop disease detection",
      "Yield prediction",
      "Resource optimization",
    ],
  },
];

const customServices = [
  {
    title: "Custom Dashboard Development",
    description:
      "Tailored web dashboards that provide real-time monitoring and control for your specific IoT devices and business needs.",
    icon: (
      <svg className="w-6 h-6 sm:w-8 sm:h-8 text-[#1E88E5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: "Mobile Applications",
    description:
      "Native and cross-platform mobile applications that allow secure control of IoT devices from anywhere in the world.",
    icon: (
      <svg className="w-6 h-6 sm:w-8 sm:h-8 text-[#1E88E5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: "API Development",
    description:
      "Robust and secure APIs that enable seamless communication between your devices, applications, and third-party services.",
    icon: (
      <svg className="w-6 h-6 sm:w-8 sm:h-8 text-[#1E88E5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    ),
  },
  {
    title: "AI & Machine Learning",
    description:
      "Intelligent algorithms that learn from your IoT data to provide predictive insights and automated decision-making.",
    icon: (
      <svg className="w-6 h-6 sm:w-8 sm:h-8 text-[#1E88E5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    title: "Security Solutions",
    description:
      "End-to-end encryption and security protocols to protect your IoT ecosystem from vulnerabilities and threats.",
    icon: (
      <svg className="w-6 h-6 sm:w-8 sm:h-8 text-[#1E88E5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
  },
  {
    title: "Data Analytics & Visualization",
    description:
      "Transform complex IoT data into understandable insights through advanced analytics and visualization tools.",
    icon: (
      <svg className="w-6 h-6 sm:w-8 sm:h-8 text-[#1E88E5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
];

const embeddedUseCases = [
  {
    title: "Industrial controllers",
    subtitle: "Factory-floor reliability",
    description:
      "Modbus, CAN, and GPIO-driven control loops with watchdog timers and fault-safe states for 24/7 operation.",
    image: "/industries/im2.png",
    tags: ["Modbus", "CAN bus", "Watchdog"],
  },
  {
    title: "Smart home & building",
    subtitle: "Connected edge devices",
    description:
      "Ultra-low-power firmware for locks, sensors, and gateways with secure OTA across thousands of units.",
    image: "/industries/im4.png",
    tags: ["BLE mesh", "OTA", "Deep sleep"],
  },
  {
    title: "EV & energy systems",
    subtitle: "High-stakes embedded",
    description:
      "BMS monitoring, MPPT control, and grid-sync algorithms with low-latency PWM and safety interlocks.",
    image: "/industries/im3.png",
    tags: ["BMS", "MPPT", "PWM"],
  },
];

const techStack = [
  "ESP32",
  "STM32",
  "FreeRTOS",
  "React",
  "Node.js",
  "React Native",
  "MQTT",
  "Python",
  "TensorFlow",
  "Docker",
  "AWS",
  "PostgreSQL",
];

const processSteps = [
  {
    step: "01",
    title: "Discovery & analysis",
    detail: "We understand your hardware, business needs, IoT infrastructure, and software requirements.",
  },
  {
    step: "02",
    title: "Design & architecture",
    detail: "Intuitive interfaces, firmware modules, APIs, and system architecture tailored to your product.",
  },
  {
    step: "03",
    title: "Development & testing",
    detail: "Iterative builds with on-target firmware testing and full-stack software QA on real devices.",
  },
  {
    step: "04",
    title: "Deployment & support",
    detail: "Production releases, flashing guides, cloud deployment, and ongoing maintenance.",
  },
];

type SelectedService = { title: string; description: string };

export default function FirmwareClient() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<SelectedService | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  const container: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 110 } },
  };

  const openQuotation = (service: SelectedService) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
    setFormData({ name: "", email: "", phone: "", company: "", message: "" });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Thank you for your interest in ${selectedService?.title}! We will contact you soon.`);
    closeModal();
  };

  return (
    <>
      <Header forceWhite />
      <main className="min-h-screen bg-white">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-32 right-0 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40" />
        <div className="absolute bottom-40 left-0 w-80 h-80 bg-amber-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30" />
      </div>

      <HomeContent>
        {/* Hero */}
        <section className={`relative z-10 ${PAGE_TOP} pb-8 sm:pb-16 lg:pb-20`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12 lg:gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="inline-block text-[#1E88E5] font-semibold text-xs sm:text-sm uppercase tracking-wider mb-3 sm:mb-4">
                  Firmware & IoT Software
                </span>
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-[#0B1C2D] leading-tight tracking-tight mb-3 sm:mb-5">
                  The logic your devices run on —{" "}
                  <span className="text-[#1E88E5]">chip to cloud</span>
                </h1>
                <p className="text-sm sm:text-lg text-gray-500 font-light leading-snug sm:leading-relaxed mb-5 sm:mb-8 max-w-xl">
                  Powerful, secure software at every layer: embedded firmware on ESP32 and STM32,
                  plus dashboards, mobile apps, and APIs to control and optimize your IoT ecosystem.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <button
                    type="button"
                    onClick={() =>
                      openQuotation({
                        title: "Firmware & Software Development",
                        description: "Custom embedded firmware and IoT software solutions.",
                      })
                    }
                    className="bg-[#FFD166] hover:bg-[#FFC033] text-[#0B1C2D] px-5 py-2.5 sm:px-8 sm:py-3.5 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                  >
                    Request consultation
                  </button>
                  <Link
                    href="#software-solutions"
                    className="border-2 border-gray-200 hover:border-[#1E88E5] text-[#0B1C2D] px-5 py-2.5 sm:px-8 sm:py-3.5 rounded-full font-semibold text-sm sm:text-base text-center transition-colors"
                  >
                    Explore solutions
                  </Link>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="relative"
              >
                <div className="relative rounded-lg overflow-hidden shadow-2xl aspect-video max-h-52 sm:max-h-none">
                  <Image
                    src="/slideshow/im3.png"
                    alt="Firmware and embedded software development"
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1C2D]/90 via-[#0B1C2D]/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-5">
                    <div className="rounded-lg bg-[#0B1C2D]/95 border border-white/10 backdrop-blur-sm overflow-hidden">
                      <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-[#163554] border-b border-white/10">
                        <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-red-400" />
                        <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-amber-400" />
                        <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-green-400" />
                        <span className="ml-2 text-[10px] sm:text-xs text-gray-400 font-mono">firmware + api</span>
                      </div>
                      <pre className="p-2.5 sm:p-4 text-[9px] sm:text-xs font-mono leading-relaxed text-gray-300 overflow-x-auto">
                        <code>
                          <span className="text-gray-500">// Device firmware</span>
                          {"\n"}
                          <span className="text-[#1E88E5]">sensor_publish</span>
                          <span className="text-gray-400">();</span>
                          {"\n"}
                          <span className="text-gray-500">// Cloud dashboard</span>
                          {"\n"}
                          <span className="text-[#FFD166]">dashboard</span>
                          <span className="text-gray-400">.</span>
                          <span className="text-[#1E88E5]">render</span>
                          <span className="text-gray-400">(telemetry);</span>
                        </code>
                      </pre>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Tech stack strip */}
        <section className="relative z-10 py-5 sm:py-8 border-y border-gray-100 bg-[#f8fafd]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 sm:mb-4">
              Embedded & application stack
            </p>
            <div className="flex flex-wrap justify-center gap-1.5 sm:gap-3">
              {techStack.map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-1 sm:px-4 sm:py-1.5 bg-white border border-gray-200 rounded-full text-xs sm:text-sm text-[#0B1C2D] font-medium"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Firmware capabilities */}
        <section id="capabilities" className="relative z-10 py-8 sm:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-6 sm:mb-12 max-w-2xl">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0B1C2D] tracking-tight mb-2 sm:mb-3">
                Embedded firmware capabilities
              </h2>
              <p className="text-sm sm:text-lg text-gray-500 font-light">
                Modular, testable code on the device — RTOS, drivers, wireless, and OTA.
              </p>
            </div>
            <motion.div
              className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.1 }}
            >
              {firmwareCapabilities.map((cap) => (
                <motion.div
                  key={cap.title}
                  variants={item}
                  className="rounded-lg border border-gray-100 p-3.5 sm:p-6 hover:border-blue-200 hover:shadow-md transition-all duration-300 bg-[#f8fafd] h-full"
                >
                  <span className={`inline-block text-[10px] sm:text-xs font-semibold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full mb-2 sm:mb-4 ${cap.accent}`}>
                    Firmware
                  </span>
                  <h3 className="text-sm sm:text-lg font-bold text-[#0B1C2D] mb-1.5 sm:mb-2 leading-snug">{cap.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-snug sm:leading-relaxed line-clamp-3 sm:line-clamp-none">{cap.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* IoT Software Solutions */}
        <section id="software-solutions" className="relative z-10 py-8 sm:py-16 bg-[#f8fafd]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-6 sm:mb-14 max-w-3xl mx-auto">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0B1C2D] tracking-tight mb-2 sm:mb-3">
                Our IoT software solutions
              </h2>
              <p className="text-sm sm:text-lg text-gray-500 font-light">
                From enterprise dashboards to mobile control apps — software that makes managing IoT devices simple.
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
              {softwareSolutions.map((solution) => (
                <motion.div
                  key={solution.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  className="bg-white rounded-lg border border-gray-100 overflow-hidden shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300 group"
                >
                  <div className="relative h-36 sm:h-auto sm:aspect-video overflow-hidden">
                    <Image
                      src={solution.image}
                      alt={solution.title}
                      fill
                      className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-[#0B1C2D]/80 to-transparent">
                      <div className="flex flex-wrap gap-1 sm:gap-1.5">
                        {solution.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="text-[9px] sm:text-[10px] font-medium text-white bg-white/20 backdrop-blur-sm px-1.5 sm:px-2 py-0.5 rounded-full"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="p-3.5 sm:p-6">
                    <h3 className="text-base sm:text-xl font-bold text-[#0B1C2D] mb-1.5 sm:mb-2 group-hover:text-[#1E88E5] transition-colors leading-snug">
                      {solution.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 leading-snug sm:leading-relaxed line-clamp-2 sm:line-clamp-none">{solution.description}</p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2 mb-4 sm:mb-5">
                      {solution.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-xs sm:text-sm text-gray-700">
                          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#1E88E5] shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <button
                      type="button"
                      onClick={() =>
                        openQuotation({ title: solution.title, description: solution.description })
                      }
                      className="w-full bg-[#0B1C2D] hover:bg-[#163554] text-white py-2.5 sm:py-3 px-4 rounded-lg font-medium text-sm sm:text-base transition-colors"
                    >
                      Get quotation
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Custom software services */}
        <section className="relative z-10 py-8 sm:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-6 sm:mb-14 max-w-3xl mx-auto">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0B1C2D] tracking-tight mb-2 sm:mb-3">
                Custom software services
              </h2>
              <p className="text-sm sm:text-lg text-gray-500 font-light">
                Tailor-made software to fit your unique IoT requirements.
              </p>
            </div>
            <motion.div
              className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6"
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.1 }}
            >
              {customServices.map((service) => (
                <motion.div
                  key={service.title}
                  variants={item}
                  className="bg-[#f8fafd] rounded-lg p-3.5 sm:p-6 border border-transparent hover:border-blue-100 hover:shadow-lg transition-all duration-300"
                >
                  <div className="mb-2 sm:mb-4">{service.icon}</div>
                  <h3 className="text-sm sm:text-lg font-bold text-[#0B1C2D] mb-1.5 sm:mb-2 leading-snug">{service.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-snug sm:leading-relaxed line-clamp-3 sm:line-clamp-none">{service.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Embedded use cases */}
        <section className="relative z-10 py-8 sm:py-16 bg-[#f8fafd]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-6 sm:mb-14 max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0B1C2D] tracking-tight mb-2 sm:mb-3">
                Where our firmware ships
              </h2>
              <p className="text-sm sm:text-lg text-gray-500 font-light">
                Production-grade embedded code across industrial, consumer, and energy products.
              </p>
            </div>
            <div className="space-y-8 sm:space-y-16">
              {embeddedUseCases.map((uc, i) => (
                <motion.div
                  key={uc.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-10 items-center"
                >
                  <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                    <p className="text-[#1E88E5] text-xs sm:text-sm font-semibold uppercase tracking-wide mb-1.5 sm:mb-2">
                      {uc.subtitle}
                    </p>
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#0B1C2D] mb-2 sm:mb-4">{uc.title}</h3>
                    <p className="text-sm sm:text-base text-gray-600 leading-snug sm:leading-relaxed mb-3 sm:mb-5">{uc.description}</p>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6">
                      {uc.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] sm:text-xs font-medium bg-white border border-gray-200 text-[#0B1C2D] px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => openQuotation({ title: uc.title, description: uc.description })}
                      className="text-[#1E88E5] hover:text-[#0B1C2D] font-semibold text-sm inline-flex items-center gap-1 transition-colors"
                    >
                      Discuss this use case
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </button>
                  </div>
                  <div className={`relative rounded-lg overflow-hidden shadow-lg aspect-video w-full max-h-48 sm:max-h-none ${i % 2 === 1 ? "lg:order-1" : ""}`}>
                    <Image src={uc.image} alt={uc.title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Development process */}
        <section className="relative z-10 py-8 sm:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-6 sm:mb-12 text-center max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0B1C2D] tracking-tight mb-2 sm:mb-3">
                Our development process
              </h2>
              <p className="text-sm sm:text-lg text-gray-500 font-light">
                A proven methodology for firmware and software that meets your exact specifications.
              </p>
            </div>
            <div className="relative">
              <div className="hidden lg:block absolute top-8 left-[12%] right-[12%] h-0.5 bg-gray-200" />
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
                {processSteps.map((step) => (
                  <div key={step.step} className="relative text-center lg:text-left">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto lg:mx-0 rounded-full bg-[#0B1C2D] text-[#FFD166] flex items-center justify-center text-sm sm:text-lg font-bold mb-3 sm:mb-4 relative z-10 ring-4 ring-white">
                      {step.step}
                    </div>
                    <h3 className="text-sm sm:text-lg font-bold text-[#0B1C2D] mb-1.5 sm:mb-2 leading-snug">{step.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 leading-snug sm:leading-relaxed line-clamp-3 sm:line-clamp-none">{step.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative z-10 py-8 sm:py-16 bg-[#f8fafd]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-[#0B1C2D] rounded-lg p-5 sm:p-8 lg:p-12 text-white flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 sm:gap-8 shadow-xl">
              <div className="max-w-2xl">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 sm:mb-3 tracking-tight">
                  Ready to transform your IoT experience?
                </h3>
                <p className="text-sm sm:text-base text-gray-300 font-light leading-snug sm:leading-relaxed">
                  Let&apos;s discuss how our firmware and custom software solutions can maximize your
                  devices and streamline operations.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full lg:w-auto shrink-0">
                <button
                  type="button"
                  onClick={() =>
                    openQuotation({
                      title: "Firmware & Software Development",
                      description: "End-to-end IoT firmware and software solutions.",
                    })
                  }
                  className="bg-[#FFD166] hover:bg-[#FFC033] text-[#0B1C2D] px-5 py-2.5 sm:px-8 sm:py-3.5 rounded-full font-bold text-sm sm:text-base transition-all hover:shadow-lg"
                >
                  Schedule consultation
                </button>
                <Link
                  href="/contact"
                  className="border-2 border-white/30 hover:border-white/60 text-white px-5 py-2.5 sm:px-8 sm:py-3.5 rounded-full font-semibold text-sm sm:text-base text-center transition-colors hover:bg-white/10"
                >
                  Contact us
                </Link>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </HomeContent>

      {/* Quotation modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
          <div className="flex min-h-screen items-center justify-center px-4 py-6 sm:py-8">
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={closeModal} aria-hidden />
            <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden">
              <button
                type="button"
                onClick={closeModal}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 rounded-full bg-gray-100 p-2 text-gray-600 hover:bg-gray-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="bg-[#0B1C2D] px-5 sm:px-8 py-4 sm:py-6 text-white">
                <h3 className="text-lg sm:text-xl font-bold">Request a quote</h3>
                {selectedService && (
                  <p className="text-gray-300 text-sm mt-1.5 sm:mt-2">{selectedService.title}</p>
                )}
              </div>
              <form onSubmit={handleSubmit} className="p-5 sm:p-8 space-y-3 sm:space-y-4">
                <p className="text-gray-600 text-sm mb-2">
                  Tell us about your project — we typically respond within one business day.
                </p>
                {(
                  [
                    { id: "name", label: "Full name", type: "text", required: true },
                    { id: "email", label: "Email", type: "email", required: true },
                    { id: "phone", label: "Phone", type: "tel", required: true },
                    { id: "company", label: "Company", type: "text", required: false },
                  ] as const
                ).map((field) => (
                  <div key={field.id}>
                    <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 mb-1">
                      {field.label}
                      {field.required && <span className="text-red-500"> *</span>}
                    </label>
                    <input
                      id={field.id}
                      name={field.id}
                      type={field.type}
                      required={field.required}
                      value={formData[field.id as keyof typeof formData]}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent outline-none text-sm sm:text-base"
                    />
                  </div>
                ))}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Project details
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Firmware, dashboards, mobile apps, timeline..."
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent outline-none resize-none text-sm sm:text-base"
                  />
                </div>
                <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-5 py-2.5 sm:px-6 border border-gray-300 rounded-lg text-gray-700 font-medium text-sm sm:text-base hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-[#0B1C2D] text-white px-5 py-2.5 sm:px-6 rounded-lg font-semibold text-sm sm:text-base hover:bg-[#163554] transition-colors"
                  >
                    Submit request
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </main>
    </>
  );
}
