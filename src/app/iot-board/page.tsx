"use client";

import Image from 'next/image';
import { motion, type Variants } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

type Props = {}

export default function Page({}: Props) {
  const container: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.12 } }
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 110 } }
  };

  const variants = [
    {
      name: 'Starter (8+ yrs)',
      price: 2999,
      features: ['Pre-wired sensors', 'Color guide book', '30+ activities', 'USB powered'],
      cta: '#buy-starter'
    },
    {
      name: 'Explorer (10+ yrs)',
      price: 4499,
      features: ['All Starter features', 'Extra sensors pack', 'Bluetooth module', '40+ projects'],
      cta: '#buy-explorer'
    },
    {
      name: 'Maker (Teens)',
      price: 6499,
      features: ['All Explorer features', 'Wi‑Fi module (ESP)', 'Mobile app examples', '60+ projects'],
      cta: '#buy-maker'
    }
  ];

  const features = [
    { title: 'Pre‑installed sensors', desc: 'Temperature, humidity, light, sound, motion and more — neatly mounted and labelled.', icon: '🧩' },
    { title: 'Arduino compatible', desc: 'Works out of the box with Arduino UNO/Nano. Sample sketches included.', icon: '🔌' },
    { title: 'Kid‑friendly guide', desc: 'Beautifully illustrated activity book designed to teach by doing.', icon: '📘' },
    { title: 'Classroom ready', desc: 'Rugged board, short‑circuit protection, and quick reset for school use.', icon: '🏫' },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 overflow-hidden">
      <Header />
      <div className="fixed inset-0 z-0">
        <div className="absolute top-20 right-24 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-24 left-24 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={item}>
            <span className="inline-block bg-blue-100 text-blue-600 px-4 py-2 rounded-full font-medium text-sm mb-4">Product Spotlight</span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
              IoT Starter Board
            </h1>
            <p className="text-gray-700 text-lg leading-relaxed mb-6 max-w-xl">
              A dynamic, kid-friendly electronics board with pre-installed sensors and Arduino compatibility.
              Comes with a guided activity book to help children learn by building. Perfect for schools and first‑time makers.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href="#buy" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md shadow-blue-200 flex items-center justify-center">
                Buy Now
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
              </a>
              <a href="#learn" className="bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-800 px-6 py-3 rounded-xl font-semibold flex items-center justify-center">
                See Features
              </a>
            </div>
            {/* Download app icons */}
            <div className="mt-5">
              <div className="text-sm text-gray-600 mb-2">Download the companion app</div>
              <div className="flex items-center gap-3">
                <a
                  href="/files/iot-board-app.apk"
                  download
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 text-sm"
                  aria-label="Download Android APK"
                >
                  {/* Android icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 text-green-600" fill="currentColor"><path d="M17.6 9c.8 0 1.4.6 1.4 1.4v5.2c0 .8-.6 1.4-1.4 1.4s-1.4-.6-1.4-1.4V10.4c0-.8.6-1.4 1.4-1.4m-11.2 0c.8 0 1.4.6 1.4 1.4v5.2c0 .8-.6 1.4-1.4 1.4S5 16.4 5 15.6V10.4C5 9.6 5.6 9 6.4 9m10.1-3.7l1.2-2.1c.1-.2 0-.5-.2-.6-.2-.1-.5 0-.6.2l-1.3 2.2c-1-.4-2.1-.6-3.3-.6s-2.3.2-3.3.6L7.8 2.8c-.1-.2-.4-.2-.6-.2-.2.1-.3.4-.2.6l1.2 2.1C6.9 8 6 9.6 6 11.5v6.5c0 .8.6 1.5 1.4 1.5h1.2V12h1.9v7.5h2.9V12h1.9v7.5h1.2c.8 0 1.4-.7 1.4-1.5V11.5c0-1.9-.9-3.5-2.3-4.2M9 7.5c-.3 0-.6-.3-.6-.6s.3-.6.6-.6.6.3.6.6-.3.6-.6.6m6 0c-.3 0-.6-.3-.6-.6s.3-.6.6-.6.6.3.6.6-.3.6-.6.6"/></svg>
                  <span>Android</span>
                </a>
                <a
                  href="/files/iot-board-app.ipa"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 text-sm"
                  aria-label="Download iOS app"
                >
                  {/* Apple icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 text-gray-900" fill="currentColor"><path d="M17.6 13.4c0 3.5 3.1 4.6 3.1 4.6s-2.4 6.9-5.6 6.9c-1.5 0-2.7-1-4.4-1-1.7 0-3.5 1-4.5 1C4 25.9 1 19 1 15.1c0-3.6 2.5-5.5 4.9-5.5 1.6 0 3 1.1 4.4 1.1 1.4 0 2.9-1.2 4.9-1.2 4 0 5.4 2.9 5.4 2.9s-3.7 1.4-3.7 5m-3.3-9.6c.8-.9 1.3-2.1 1.2-3.3-1.1.1-2.3.6-3 1.5-.7.8-1.3 2-1.1 3.1 1.2.1 2.3-.5 2.9-1.3z"/></svg>
                  <span>iOS</span>
                </a>
                <a
                  href="/files/iot-board-app.exe"
                  download
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 text-sm"
                  aria-label="Download Windows app"
                >
                  {/* Windows icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 text-sky-600" fill="currentColor"><path d="M3 4.5 11 3v8H3m0 1h8v8l-8-1.5m10-14L21 2v9h-8m0 1h8v9l-8-1.5"/></svg>
                  <span>Windows</span>
                </a>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="flex items-center"><span className="text-green-600 mr-2">✓</span> Beginner friendly</div>
              <div className="flex items-center"><span className="text-green-600 mr-2">✓</span> Classroom ready</div>
              <div className="flex items-center"><span className="text-green-600 mr-2">✓</span> Open source examples</div>
              <div className="flex items-center"><span className="text-green-600 mr-2">✓</span> 1‑year warranty</div>
            </div>
          </motion.div>

          <motion.div variants={item} className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=1200&h=900&fit=crop"
                alt="IoT Starter Board"
                width={1200}
                height={900}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
          </motion.div>
        </motion.div>
      </section>

      <section id="learn" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">What makes it special?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div key={i} variants={item} className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-1">{f.title}</h3>
                <p className="text-sm text-gray-600">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <section id="variants" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
          <div className="flex items-end justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900">Choose your variant</h2>
            <span className="text-sm text-gray-600">Starter kit for kids • Maker kit for teens</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {variants.map((v, idx) => (
              <motion.div key={idx} variants={item} className={`rounded-2xl p-6 border shadow-sm bg-white ${idx === 1 ? 'border-blue-300 shadow-blue-100' : 'border-gray-100'}`}>
                <div className="flex items-baseline justify-between mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">{v.name}</h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-600">Popular</span>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-4">₹{v.price}</div>
                <ul className="space-y-2 text-sm text-gray-700 mb-6">
                  {v.features.map((f, i) => (
                    <li key={i} className="flex items-start"><span className="text-green-600 mr-2 mt-0.5">•</span>{f}</li>
                  ))}
                </ul>
                <a href={`#buy`} className="w-full inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-semibold">
                  Buy {v.name}
                </a>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">What’s in the box</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
              <li>Arduino‑compatible controller (UNO/Nano)</li>
              <li>Mounted sensor array (Temp, Humidity, LDR, Mic, PIR)</li>
              <li>Plug‑and‑play jumper harness</li>
              <li>USB cable and quick reset</li>
              <li>Starter workbook with 30+ activities</li>
              <li>Access to sample codes and mobile app demos</li>
            </ul>
          </div>
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Technical specs</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
              <div><span className="text-gray-500">Power:</span> 5V USB</div>
              <div><span className="text-gray-500">Connectivity:</span> USB, optional BT/Wi‑Fi</div>
              <div><span className="text-gray-500">Board size:</span> 200 x 150 mm</div>
              <div><span className="text-gray-500">Protection:</span> Polyfuse + reverse‑polarity</div>
              <div><span className="text-gray-500">Compatibility:</span> Arduino IDE</div>
              <div><span className="text-gray-500">Examples:</span> 30–60 guided projects</div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Gallery</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {["photo-1581091226825-a6a2a5aee158","photo-1580894908360-9243200b4b9b","photo-1518779578993-ec3579fee39f","photo-1519389950473-47ba0277781c"].map((id, i) => (
            <div key={i} className="relative rounded-xl overflow-hidden shadow">
              <Image
                src={`https://images.unsplash.com/${id}?w=600&h=400&fit=crop`}
                alt="IoT board gallery"
                width={600}
                height={400}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </section>

      <section id="buy" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 lg:p-10 text-white flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-xl">
          <div>
            <h3 className="text-2xl font-bold mb-2">Ready to build something amazing?</h3>
            <p className="opacity-90">Order the IoT Starter Board today and get the illustrated guide book free.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <a href="/checkout" className="bg-white text-blue-700 hover:text-blue-800 px-6 py-3 rounded-xl font-semibold text-center">
              Buy Now
            </a>
            <a href="/contact" className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl font-semibold text-center">
              Talk to Us
            </a>
          </div>
        </div>
      </section>

      <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">FAQ</h3>
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 divide-y">
          {[{
            q: 'Is it safe for kids?', a: 'Yes. The board uses low voltage (5V) and includes basic protection. Adult supervision is recommended for ages under 10.'
          }, {
            q: 'Do I need prior coding experience?', a: 'No. The guide starts with plug‑and‑play experiments and gradually introduces simple Arduino code.'
          }, {
            q: 'Which Arduino is included?', a: 'The Starter variant includes an Arduino‑compatible board. Explorer and Maker add Bluetooth/Wi‑Fi options.'
          }].map((f, i) => (
            <div key={i} className="p-5">
              <div className="font-medium text-gray-900 mb-1">{f.q}</div>
              <div className="text-sm text-gray-700">{f.a}</div>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  )
}