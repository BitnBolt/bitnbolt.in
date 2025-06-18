import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function AboutPage() {
  const reasons = [
    {
      icon: "🎯",
      title: "Custom Solutions",
      description: "We don't believe in one-size-fits-all. Every IoT solution we create is tailored to your specific business needs and requirements."
    },
    {
      icon: "⚡",
      title: "Cutting-Edge Technology",
      description: "We stay ahead of the curve with the latest IoT technologies, ensuring your solutions are future-proof and scalable."
    },
    {
      icon: "🛡️",
      title: "Enterprise Security",
      description: "Security is our top priority. All our solutions come with enterprise-grade security protocols and compliance standards."
    },
    {
      icon: "🚀",
      title: "Rapid Deployment",
      description: "Our streamlined development process ensures quick deployment without compromising on quality or functionality."
    },
    {
      icon: "📊",
      title: "Data-Driven Insights",
      description: "Transform raw data into actionable insights with our advanced analytics and reporting capabilities."
    },
    {
      icon: "🔧",
      title: "24/7 Support",
      description: "Our dedicated support team is available round-the-clock to ensure your IoT solutions run smoothly."
    }
  ];

  const stats = [
    { number: "500+", label: "Projects Completed" },
    { number: "98%", label: "Client Satisfaction" },
    { number: "50+", label: "Team Experts" },
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
              Why Choose <span className="text-blue-600">BitnBolt</span>?
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're not just another IoT company. We're your innovation partners, 
              transforming ideas into powerful, scalable solutions that drive real business results.
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

      {/* Reasons Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Makes Us Different
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our unique approach combines technical expertise with business acumen 
              to deliver IoT solutions that truly make a difference.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reasons.map((reason, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-shadow duration-300">
                <div className="text-4xl mb-4">{reason.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{reason.title}</h3>
                <p className="text-gray-600 leading-relaxed">{reason.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                BitnBolt was founded with a simple mission: to make IoT technology accessible 
                and beneficial for businesses of all sizes. We believe that every company, 
                regardless of industry or scale, deserves access to cutting-edge IoT solutions.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Our name "BitnBolt" represents the combination of digital bits (technology) 
                and mechanical bolts (industrial applications) - symbolizing our expertise 
                in bridging the gap between digital innovation and real-world implementation.
              </p>
              <p className="text-lg text-gray-600">
                Today, we're proud to serve hundreds of clients across various industries, 
                helping them leverage IoT technology to improve efficiency, reduce costs, 
                and gain competitive advantages.
              </p>
            </div>
            <div className="bg-gray-100 rounded-xl p-8">
              <div className="text-center">
                <div className="text-6xl mb-4">🏭</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Industrial IoT Experts</h3>
                <p className="text-gray-600">
                  From smart factories to connected cities, we've been at the forefront 
                  of industrial IoT innovation for over a decade.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of satisfied clients who have already experienced 
            the BitnBolt difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Get Started Today
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              Schedule Consultation
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
} 