import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Link from 'next/link';

const coreValues = [
  {
    title: 'Accessibility',
    description:
      'We believe every industry and scale deserves access to cutting-edge tech.',
  },
  {
    title: 'Synergy',
    description:
      'We blend digital software with hardware prototypes to connect technology with real-world use.',
  },
  {
    title: 'Impact',
    description:
      'We focus on delivering real results that improve efficiency and lower costs.',
  },
  {
    title: 'Empowerment',
    description:
      'We support learning for all while giving businesses a true competitive edge.',
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose <span className="text-blue-600">BitnBolt</span>?
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto font-medium">
              Bridging digital innovation with real-world engineering.
            </p>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mt-4">
              We unite software and hardware so businesses of every size can deploy IoT that
              works in the field—not just on a slide deck.
            </p>
          </div>
        </div>
      </section>

      {/* About BitnBolt */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                About BitnBolt
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                BitnBolt is a technology company that bridges the gap between digital innovation
                and real-world implementation. The name represents the perfect combination of
                digital bits and mechanical bolts for industrial applications. Today, the company
                proudly serves hundreds of clients across various industries to help them succeed.
              </p>
            </div>
            <div className="relative rounded-xl overflow-hidden shadow-lg aspect-[4/3] lg:aspect-auto lg:h-[420px]">
              <img
                src="/slideshow/im1.png"
                alt="BitnBolt IoT and engineering solutions"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1C2D]/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-white text-sm font-medium tracking-wide uppercase opacity-90">
                  Bits + Bolts
                </p>
                <p className="text-white text-lg font-semibold mt-1">
                  Digital intelligence, built for the physical world
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                BitnBolt&apos;s Mission
              </h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                Our mission is to make IoT technology easy to learn for everyone and highly
                beneficial for businesses of all sizes. We work diligently to ensure that every
                company can access cutting-edge IoT solutions, regardless of their industry or
                scale.
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Our Vision</h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                We see a future when every problem can be solved via automated approaches. We aim
                to accelerate growth and efficiency for all through the convergence of digital
                solutions and hardware advancements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose & What Makes Us Different */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Why Choose BitnBolt
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Businesses choose BitnBolt because we help them leverage modern IoT technology to
                improve daily efficiency and reduce operational costs. Partnering with us allows
                companies of any scale to gain strong competitive advantages in their market.
              </p>
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                What Makes Us Different?
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                We stand out because we truly unite the digital world with physical engineering,
                just like the &quot;bits and bolts&quot; in our name. We don&apos;t just offer standard
                tech; we bring advanced IoT solutions to fields and businesses that usually find
                them hard to reach.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide how we build, partner, and deliver for every client.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((value) => (
              <div
                key={value.title}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
              >
                <h3 className="text-xl font-semibold text-blue-600 mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed text-[15px]">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of clients who trust BitnBolt to connect digital innovation with
            real-world results.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Get Started Today
            </Link>
            <Link
              href="/contact"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Schedule Consultation
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
