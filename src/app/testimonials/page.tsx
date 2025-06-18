import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Image from 'next/image';

export default function TestimonialsPage() {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      position: "CTO",
      company: "TechFlow Industries",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      content: "BitnBolt transformed our manufacturing process with their custom IoT solution. The real-time monitoring and predictive maintenance features have reduced downtime by 40% and saved us millions in operational costs.",
      rating: 5,
      industry: "Manufacturing"
    },
    {
      id: 2,
      name: "Michael Chen",
      position: "Operations Director",
      company: "GreenFarm Co.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      content: "The smart agriculture system from BitnBolt has revolutionized our farming operations. We've increased crop yields by 25% while reducing water usage by 30%. Their support team is exceptional.",
      rating: 5,
      industry: "Agriculture"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      position: "CEO",
      company: "SmartRetail Solutions",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      content: "BitnBolt's custom retail analytics solution provided insights we never had before. Customer behavior tracking and inventory management have improved our efficiency dramatically. Highly recommended!",
      rating: 5,
      industry: "Retail"
    },
    {
      id: 4,
      name: "David Thompson",
      position: "Facility Manager",
      company: "Metro Hospitals",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      content: "The healthcare IoT monitoring system from BitnBolt has enhanced our patient care significantly. The alert system and data analytics help us provide better, more proactive healthcare services.",
      rating: 5,
      industry: "Healthcare"
    },
    {
      id: 5,
      name: "Lisa Wang",
      position: "VP of Engineering",
      company: "EnergyCorp",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      content: "BitnBolt's energy management system has been a game-changer for our facilities. We've achieved 35% energy savings and improved our sustainability metrics significantly.",
      rating: 5,
      industry: "Energy"
    },
    {
      id: 6,
      name: "Robert Kim",
      position: "IT Director",
      company: "LogiTech Solutions",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      content: "The logistics IoT solution from BitnBolt has streamlined our supply chain operations. Real-time tracking and automated routing have reduced delivery times by 20%.",
      rating: 5,
      industry: "Logistics"
    }
  ];

  const stats = [
    { number: "500+", label: "Happy Clients" },
    { number: "1000+", label: "Projects Delivered" },
    { number: "98%", label: "Satisfaction Rate" },
    { number: "24/7", label: "Support Available" }
  ];

  return (
    <main className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              What Our <span className="text-blue-600">Clients Say</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Don&apos;t just take our word for it. Here&apos;s what our clients have to say about 
              their experience with BitnBolt&apos;s IoT solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Client Success Stories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real results from real clients across various industries
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-shadow duration-300"
              >
                {/* Rating */}
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Industry Badge */}
                <div className="mb-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                    {testimonial.industry}
                  </span>
                </div>

                {/* Content */}
                <blockquote className="text-gray-700 mb-6 leading-relaxed">
                  &quot;{testimonial.content}&quot;
                </blockquote>

                {/* Author */}
                <div className="flex items-center">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">
                      {testimonial.position} at {testimonial.company}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Case Study */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 md:p-12 text-white">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Featured Success Story
                </h2>
                <h3 className="text-xl font-semibold mb-4">TechFlow Industries</h3>
                <p className="text-blue-100 text-lg mb-6">
                &quot;BitnBolt&apos;s IoT solution transformed our manufacturing process, 
                  reducing downtime by 40% and saving millions in operational costs. 
                  Their expertise and support have been invaluable to our success.&quot;
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                    Read Full Case Study
                  </button>
                  <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                    Watch Video
                  </button>
                </div>
              </div>
              <div className="text-center">
                <div className="text-6xl mb-4">🏭</div>
                <div className="text-2xl font-bold mb-2">40% Reduction</div>
                <div className="text-blue-100">in Manufacturing Downtime</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Join Our Success Stories
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Ready to transform your business with cutting-edge IoT solutions? 
            Let&apos;s discuss how we can help you achieve similar results.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Start Your Project
            </button>
            <button className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
              Schedule Consultation
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
} 