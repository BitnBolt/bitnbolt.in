import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default async function SoftwarePage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/auth/signin");
  }

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
                  
                  <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl hover:shadow-lg transition-shadow font-medium flex items-center justify-center">
                    Learn More
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

      <Footer />
    </div>
  );
}
