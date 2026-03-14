"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function SoftwarePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<{
    title: string;
    description: string;
  } | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  // IoT software solutions data
  const softwareSolutions = [
    {
      title: "Enterprise IoT Dashboard",
      description:
        "A comprehensive dashboard for monitoring all your IoT devices in real-time. Features include custom alerts, data visualization, and predictive maintenance.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
      features: [
        "Real-time device monitoring",
        "Custom alerts and notifications",
        "Data visualization and analytics",
        "User role management",
        "API integration capabilities",
        "Predictive maintenance algorithms",
      ],
      technologies: ["React", "Node.js", "MongoDB", "WebSockets", "TensorFlow"],
    },
    {
      title: "Mobile Device Control",
      description:
        "Control all your IoT devices from anywhere with our mobile application. Secure, reliable, and user-friendly interface for both iOS and Android.",
      image: "https://images.unsplash.com/photo-1520333789090-1afc82db536a?w=800&h=600&fit=crop",
      features: [
        "Cross-platform (iOS/Android)",
        "Secure authentication",
        "Voice commands",
        "Geolocation-based automation",
        "Offline functionality",
        "Energy usage monitoring",
      ],
      technologies: ["React Native", "Firebase", "GraphQL", "OAuth 2.0", "AWS"],
    },
    {
      title: "Industrial Monitoring System",
      description:
        "Designed for manufacturing environments, this system monitors equipment health, production metrics, and environmental conditions with military-grade security.",
      image: "https://images.unsplash.com/photo-1581092921461-7a0267b89941?w=800&h=600&fit=crop",
      features: [
        "Equipment health monitoring",
        "Production metrics tracking",
        "Environmental condition alerts",
        "Compliance reporting",
        "Maintenance scheduling",
        "Digital twin visualization",
      ],
      technologies: ["Angular", "Python", ".NET Core", "SQL Server", "Docker"],
    },
    {
      title: "Smart Agriculture Platform",
      description:
        "Optimize crop yields with our AI-powered agriculture platform that integrates with soil sensors, weather data, and irrigation systems for precision farming.",
      image: "https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?w=800&h=600&fit=crop",
      features: [
        "Soil condition monitoring",
        "Weather data integration",
        "Irrigation automation",
        "Crop disease detection",
        "Yield prediction",
        "Resource optimization",
      ],
      technologies: ["Vue.js", "Django", "PostgreSQL", "TensorFlow", "MQTT"],
    },
  ];

  // Custom software services
  const customServices = [
    {
      icon: "🖥️",
      title: "Custom Dashboard Development",
      description: "Tailored web dashboards that provide real-time monitoring and control for your specific IoT devices and business needs.",
    },
    {
      icon: "📱",
      title: "Mobile Applications",
      description: "Native and cross-platform mobile applications that allow secure control of IoT devices from anywhere in the world.",
    },
    {
      icon: "🔌",
      title: "API Development",
      description: "Robust and secure APIs that enable seamless communication between your devices, applications, and third-party services.",
    },
    {
      icon: "🤖",
      title: "AI & Machine Learning",
      description: "Intelligent algorithms that learn from your IoT data to provide predictive insights and automated decision-making.",
    },
    {
      icon: "🔐",
      title: "Security Solutions",
      description: "End-to-end encryption and security protocols to protect your IoT ecosystem from vulnerabilities and threats.",
    },
    {
      icon: "📊",
      title: "Data Analytics & Visualization",
      description: "Transform complex IoT data into understandable insights through advanced analytics and visualization tools.",
    },
  ];

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Here you can add your logic to send the form data to your backend
    console.log("Form submitted:", {
      service: selectedService,
      ...formData,
    });

    // TODO: Add API call to submit quotation request
    // For now, just show an alert and close the modal
    alert(`Thank you for your interest in ${selectedService?.title}! We will contact you soon.`);
    closeModal();
  };

  // Close modal and reset form
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      company: "",
      message: "",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Custom IoT Software Solutions
            </h1>
            <p className="text-xl text-gray-600 mb-10">
              Powerful, secure, and intuitive software to control, monitor, and optimize your IoT ecosystem.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="#contact"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-full font-semibold hover:shadow-xl transform hover:translate-y-[-2px] transition-all duration-300 flex items-center justify-center"
              >
                Request Consultation
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="#software-solutions"
                className="bg-white text-gray-800 border-2 border-gray-200 px-8 py-4 rounded-full font-semibold hover:border-gray-400 hover:shadow-lg transform hover:translate-y-[-2px] transition-all duration-300 flex items-center justify-center"
              >
                Explore Solutions
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Software Solutions Section */}
      <section id="software-solutions" className="py-20 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Our IoT Software Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From enterprise dashboards to mobile control applications, we create custom software that makes managing IoT devices simple and efficient.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {softwareSolutions.map((solution, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl shadow-lg overflow-hidden border border-gray-100 group hover:shadow-xl transition-shadow duration-300">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={solution.image}
                    alt={solution.title}
                    width={800}
                    height={600}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-6 w-full">
                      <div className="flex flex-wrap gap-2">
                        {solution.technologies.map((tech, techIndex) => (
                          <span key={techIndex} className="text-xs font-medium text-white bg-blue-600/80 px-2.5 py-1 rounded-full">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {solution.title}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {solution.description}
                  </p>

                  <div className="mb-6">
                    <h4 className="text-sm uppercase font-semibold text-gray-500 mb-3">Key Features</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {solution.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center">
                          <svg className="w-5 h-5 text-green-500 mr-2 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedService({
                        title: solution.title,
                        description: solution.description,
                      });
                      setIsModalOpen(true);
                    }}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl hover:shadow-lg transition-shadow font-medium flex items-center justify-center"
                  >
                    Get Quotation
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Custom Software Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our team of expert developers creates tailor-made software solutions to fit your unique IoT requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {customServices.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 relative overflow-hidden group"
              >
                <div className="absolute right-0 top-0 w-32 h-32 rounded-full bg-blue-100 opacity-10 -mr-10 -mt-10 transform group-hover:scale-150 transition-transform duration-500"></div>

                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-2xl mb-4 transform transition-transform group-hover:scale-110 duration-300">
                    <span className="text-3xl">{service.icon}</span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                    {service.title}
                  </h3>

                  <p className="text-gray-600 group-hover:text-gray-900 transition-colors duration-300">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Development Process */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Our Development Process
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We follow a proven methodology to deliver high-quality software that meets your exact specifications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                number: "01",
                title: "Discovery & Analysis",
                description: "We start by understanding your business needs, IoT infrastructure, and software requirements."
              },
              {
                number: "02",
                title: "Design & Architecture",
                description: "Our team designs intuitive interfaces and robust software architecture tailored to your needs."
              },
              {
                number: "03",
                title: "Development & Testing",
                description: "We build and thoroughly test your software to ensure it functions flawlessly with your IoT devices."
              },
              {
                number: "04",
                title: "Deployment & Support",
                description: "We deploy your solution and provide ongoing maintenance and support to ensure optimal performance."
              }
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-blue-50 rounded-2xl p-6 h-full border border-blue-100">
                  <div className="text-4xl font-bold text-blue-600/30 mb-4">{step.number}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>

                {/* Connect lines between steps (only for middle items) */}
                {index < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-blue-200 z-10"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="lg:w-2/3">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your IoT Experience?</h2>
              <p className="text-blue-100 text-lg">
                Let&apos;s discuss how our custom software solutions can help you maximize the potential of your IoT devices and streamline your operations.
              </p>
            </div>
            <div className="lg:w-1/3 flex flex-col sm:flex-row lg:flex-col gap-4">
              <Link
                href="#contact"
                className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-blue-50 transition-colors text-center"
              >
                Schedule Consultation
              </Link>
              <Link
                href="/contact"
                className="bg-transparent text-white border-2 border-white px-8 py-4 rounded-full font-semibold hover:bg-white/10 transition-colors text-center"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quotation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          {/* Background backdrop */}
          <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-[#00000022] backdrop-blur-sm transition-opacity"
              aria-hidden="true"
              onClick={closeModal}
            ></div>

            {/* Center modal */}
            <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>

            <div className="relative inline-block transform overflow-hidden rounded-2xl bg-white text-left align-bottom shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:align-middle border border-gray-200">
              {/* Close button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-10 rounded-full bg-gray-100 p-2 text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 sm:px-8">
                <h3 className="text-2xl font-bold text-white" id="modal-title">
                  Request Quotation
                </h3>
                {selectedService && (
                  <div className="mt-3 bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                    <p className="text-sm font-medium text-blue-100 mb-1">Selected Service:</p>
                    <p className="text-lg font-bold text-white">{selectedService.title}</p>
                    <p className="text-sm text-blue-50 mt-2">{selectedService.description}</p>
                  </div>
                )}
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmit} className="px-6 py-6 sm:px-8">
                <p className="text-gray-600 mb-6">
                  Fill in your details below and our team will get back to you with a custom quotation within 24 hours.
                </p>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {/* Name */}
                  <div className="sm:col-span-2">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                      placeholder="John Doe"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                      placeholder="john@example.com"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>

                  {/* Company */}
                  <div className="sm:col-span-2">
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                      placeholder="Your Company Ltd."
                    />
                  </div>

                  {/* Message */}
                  <div className="sm:col-span-2">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Requirements
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none"
                      placeholder="Tell us more about your project requirements..."
                    />
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="mt-8 flex flex-col-reverse sm:flex-row gap-3 sm:gap-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="w-full sm:w-auto px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-full sm:flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all transform hover:translate-y-[-1px] flex items-center justify-center"
                  >
                    Submit Request
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
