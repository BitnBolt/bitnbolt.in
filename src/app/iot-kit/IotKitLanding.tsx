'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { companyInfo, formatCompanyAddress } from '@/lib/company';

const EARLY_BIRD_SEATS = 20;
const MRP = 2499;
const EARLY_BIRD = 499;

const learnItems = [
  {
    title: 'C programming on hardware',
    body: 'Write firmware, blink LEDs, read sensors, and drive displays — the fundamentals of embedded C, on a real ESP32 board.',
  },
  {
    title: 'Python for IoT prototypes',
    body: 'Script logic, log sensor data, and move from classroom Python to hardware that responds in the physical world.',
  },
  {
    title: 'Sensors, actuators & displays',
    body: 'OLED, 7-segment, RGB LEDs, potentiometer, IR/TSOP, ultrasonic, relay, and buzzer — all onboard to practise with.',
  },
  {
    title: 'Wi-Fi & Bluetooth projects',
    body: 'Connect the kit to networks, push telemetry, and build the connected apps that turn a board into an IoT product.',
  },
];

const benefits = [
  'Everything you need in one box — no hunting for modules separately.',
  'Easy-to-follow guides to get you coding on day one.',
  'Works with Arduino IDE and common ESP32 toolchains.',
  'Reusable components for endless project ideas.',
  'Built for students, hobbyists, educators, and MVP builders.',
];

const academicYears = [
  { year: '1st Year', focus: 'Learn basic programming through visualization on real hardware.' },
  { year: '2nd Year', focus: 'Interface sensors and actuators to build IoT projects.' },
  { year: '3rd Year', focus: 'Spin up web servers and connect databases for hands-on web/app work.' },
  { year: '4th Year', focus: 'Ship advanced projects with IoT, analytics, and ML/DL ideas.' },
];

const audience = [
  'Students learning IoT, ML/DL, or web/app development',
  'Hobbyists prototyping real-world solutions',
  'Educators & trainers running lab sessions',
  'Hackathon teams & early MVP builders',
];

const components = [
  { name: '4-bit LED / RGB LED', detail: 'Multi-colour indication and visual output for status and effects.' },
  { name: '4-bit Seven Segment', detail: 'Show numbers, timers, and status information clearly.' },
  { name: 'Push buttons / TSOP', detail: 'User input and IR interaction for interactive projects.' },
  { name: 'Potentiometer', detail: 'Analog control input for tuning thresholds and UI values.' },
  { name: 'Pinout peripherals', detail: 'Breakouts to wire external modules without redesigning the board.' },
  { name: 'Power LED', detail: 'Instant visual cue that the kit is powered and ready.' },
  { name: 'ESP32 controller', detail: 'Runs your C/Python firmware and manages onboard peripherals.' },
  { name: 'Slider switch', detail: 'Simple power/control switching during demos and labs.' },
  { name: 'Power jack', detail: 'External power input for stable bench and classroom use.' },
  { name: 'OLED display', detail: 'Real-time data, messages, and project dashboards on-device.' },
  { name: '5V relay', detail: 'Switch higher-power loads safely from low-voltage logic.' },
  { name: 'Power section', detail: '5V, 3.3V, GND, and 12V* rails for expanding your circuit.' },
  { name: 'Mini breadboard', detail: 'Solder-free prototyping right beside the controller.' },
  { name: 'Base studs', detail: 'Secure mounting so the kit stays stable while you work.' },
];

const specs = [
  { label: 'Microcontroller', value: 'ESP32' },
  { label: 'Display modules', value: '7-segment + OLED / LCD*' },
  { label: 'Connectivity', value: 'Wi-Fi & Bluetooth®' },
  { label: 'Power outputs', value: '5V, 3.3V, GND, 12V*' },
  { label: 'Prototyping', value: 'Mini breadboard' },
  { label: 'Board size', value: '180 × 120 mm (approx.)' },
];

const features = [
  { title: 'IoT ready', body: 'Connect, control, and monitor from anywhere over Wi-Fi & Bluetooth.' },
  { title: 'Step-by-step guides', body: 'Sample projects included so you start building, not guessing.' },
  { title: 'Reliable & safe', body: 'Quality components with proper isolation for classroom and lab use.' },
  { title: 'Modular design', body: 'Extend easily with extra sensors and breakout modules.' },
  { title: 'Educational focus', body: 'Made for students, hobbyists, and innovators who learn by shipping.' },
];

const faqs = [
  {
    q: 'Who is this kit for?',
    a: 'Engineering students, hobbyists, educators, and anyone who wants to learn C or Python on real IoT hardware — not just slides.',
  },
  {
    q: 'Do I need prior embedded experience?',
    a: 'No. Start with basic LED and sensor labs, then level up to Wi-Fi projects and full prototypes as you grow.',
  },
  {
    q: 'What programming languages can I use?',
    a: 'The kit is built around the ESP32, so you can work in C/C++ (Arduino-style) and Python-based workflows for IoT prototyping.',
  },
  {
    q: 'How does early-bird pricing work?',
    a: `The first ${EARLY_BIRD_SEATS} student seats get the early-bird price. After that, standard kit pricing applies. GST is applied at checkout as applicable.`,
  },
  {
    q: 'What happens after I pay?',
    a: 'Complete payment for your kit, then fill the registration Google Form shared in your confirmation so we can process your order and onboarding.',
  },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

type Props = {
  productHref: string;
  formUrl?: string;
};

export default function IotKitLanding({ productHref, formUrl }: Props) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowSticky(window.scrollY > 520);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const primaryHref = formUrl || productHref;
  const primaryLabel = formUrl ? 'Register your seat' : 'Get the kit';

  return (
    <div className="relative min-h-screen bg-[#F4F7FB] text-[#0B1C2D] overflow-x-hidden">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 10% -10%, rgba(30,136,229,0.18), transparent 55%), radial-gradient(ellipse 60% 40% at 90% 10%, rgba(255,209,102,0.22), transparent 50%), linear-gradient(180deg, #E8EEF6 0%, #F4F7FB 35%, #F4F7FB 100%)',
        }}
      />

      {/* Slim campaign nav */}
      <header className="sticky top-0 z-40 border-b border-[#0B1C2D]/8 bg-[#F4F7FB]/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5 min-w-0">
            <Image src="/icon.png" alt="BitnBolt" width={36} height={36} className="h-9 w-9 object-contain" />
            <div className="min-w-0 leading-tight">
              <p className="font-[family-name:var(--font-iot-kit-display)] text-sm sm:text-base font-bold tracking-tight truncate">
                BitnBolt
              </p>
              <p className="text-[10px] sm:text-xs text-[#0B1C2D]/55 truncate">Build Smarter. Innovate Faster.</p>
            </div>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/iot-board"
              className="hidden sm:inline text-sm font-medium text-[#0B1C2D]/70 hover:text-[#0B1C2D] transition-colors"
            >
              Full kit page
            </Link>
            <a
              href="#offer"
              className="rounded-full bg-[#0B1C2D] px-4 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-[#163554] transition-colors"
            >
              Early-bird offer
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* Hero — brand + one headline + one line + CTAs + full-bleed board */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[#0B1C2D]" />
          <div
            aria-hidden
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                'linear-gradient(115deg, transparent 40%, rgba(30,136,229,0.35) 100%), radial-gradient(circle at 70% 40%, rgba(255,209,102,0.18), transparent 45%)',
            }}
          />
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            }}
          />

          <div className="relative mx-auto max-w-6xl px-4 pt-10 pb-8 sm:px-6 sm:pt-14 sm:pb-12">
            <motion.div initial="hidden" animate="show" variants={stagger} className="max-w-2xl">
              <motion.p
                variants={fadeUp}
                className="font-[family-name:var(--font-iot-kit-display)] text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white"
              >
                BitnBolt
              </motion.p>
              <motion.h1
                variants={fadeUp}
                className="mt-3 sm:mt-4 font-[family-name:var(--font-iot-kit-display)] text-xl sm:text-3xl md:text-4xl font-semibold leading-snug text-white/95"
              >
                Learn <span className="text-[#FFD166]">C &amp; Python</span> on a real IoT Development Kit
              </motion.h1>
              <motion.p variants={fadeUp} className="mt-3 sm:mt-4 max-w-xl text-sm sm:text-base text-white/70 leading-relaxed">
                One ESP32 board. Onboard modules. Hands-on labs — from blinking LEDs to connected IoT projects.
              </motion.p>
              <motion.div variants={fadeUp} className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3">
                <a
                  href="#offer"
                  className="inline-flex items-center justify-center rounded-full bg-[#FFD166] px-6 py-3 text-sm sm:text-base font-bold text-[#0B1C2D] hover:bg-[#FFC033] transition-colors"
                >
                  Claim early-bird seat
                </a>
                <a
                  href="#parts"
                  className="inline-flex items-center justify-center rounded-full border border-white/25 px-6 py-3 text-sm sm:text-base font-semibold text-white hover:bg-white/10 transition-colors"
                >
                  See what&apos;s inside
                </a>
              </motion.div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full"
          >
            <div className="relative mx-auto max-w-6xl px-0 sm:px-6">
              <div className="relative aspect-[16/9] sm:aspect-[21/9] overflow-hidden sm:rounded-t-2xl">
                <Image
                  src="/iot-board/im4.png"
                  alt="BitnBolt IoT Development Kit"
                  fill
                  priority
                  className="object-cover object-center"
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1C2D] via-transparent to-transparent" />
              </div>
            </div>
          </motion.div>
        </section>

        {/* Impact strip — be10x style */}
        <section className="border-y border-[#0B1C2D]/8 bg-white">
          <div className="mx-auto grid max-w-6xl grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-[#0B1C2D]/8">
            {[
              { k: 'ESP32', v: 'Wi-Fi + Bluetooth' },
              { k: '14+', v: 'Onboard modules' },
              { k: `${EARLY_BIRD_SEATS}`, v: 'Early-bird seats' },
              { k: 'C + Py', v: 'Programming paths' },
            ].map((stat) => (
              <div key={stat.k} className="px-4 py-5 sm:px-6 sm:py-7 text-center">
                <p className="font-[family-name:var(--font-iot-kit-display)] text-2xl sm:text-3xl font-extrabold text-[#1E88E5]">
                  {stat.k}
                </p>
                <p className="mt-1 text-xs sm:text-sm text-[#0B1C2D]/60">{stat.v}</p>
              </div>
            ))}
          </div>
        </section>

        {/* What you'll learn */}
        <section className="py-14 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              variants={stagger}
              className="max-w-2xl"
            >
              <motion.p variants={fadeUp} className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1E88E5]">
                What you&apos;ll learn
              </motion.p>
              <motion.h2
                variants={fadeUp}
                className="mt-2 font-[family-name:var(--font-iot-kit-display)] text-2xl sm:text-4xl font-extrabold tracking-tight"
              >
                Not theory — build on the board
              </motion.h2>
              <motion.p variants={fadeUp} className="mt-3 text-sm sm:text-base text-[#0B1C2D]/65 leading-relaxed">
                The kit is a one-stop path for IoT, ML/DL, and web/app learners who want practical, hands-on experience.
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.15 }}
              variants={stagger}
              className="mt-10 grid gap-6 sm:grid-cols-2"
            >
              {learnItems.map((item, i) => (
                <motion.div
                  key={item.title}
                  variants={fadeUp}
                  className="relative border-l-2 border-[#1E88E5] pl-5 py-1"
                >
                  <span className="font-[family-name:var(--font-iot-kit-display)] text-4xl font-extrabold text-[#1E88E5]/15 absolute -left-1 -top-2 select-none">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="font-[family-name:var(--font-iot-kit-display)] text-lg sm:text-xl font-bold relative">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-[#0B1C2D]/65 leading-relaxed">{item.body}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Benefits + who it's for */}
        <section className="bg-[#0B1C2D] text-white py-14 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 grid lg:grid-cols-2 gap-12 lg:gap-16">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#FFD166]">Kit overview</p>
              <h2 className="mt-2 font-[family-name:var(--font-iot-kit-display)] text-2xl sm:text-4xl font-extrabold tracking-tight">
                Why builders pick this kit
              </h2>
              <ul className="mt-8 space-y-4">
                {benefits.map((b) => (
                  <li key={b} className="flex gap-3 text-sm sm:text-base text-white/80 leading-relaxed">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FFD166]" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#FFD166]">Who it&apos;s for</p>
              <h2 className="mt-2 font-[family-name:var(--font-iot-kit-display)] text-2xl sm:text-4xl font-extrabold tracking-tight">
                Built for makers at every stage
              </h2>
              <div className="mt-8 grid sm:grid-cols-2 gap-3">
                {audience.map((a) => (
                  <p
                    key={a}
                    className="border border-white/15 bg-white/5 px-4 py-4 text-sm text-white/85 leading-snug"
                  >
                    {a}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Academic years */}
        <section className="py-14 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1E88E5]">Across every year</p>
              <h2 className="mt-2 font-[family-name:var(--font-iot-kit-display)] text-2xl sm:text-4xl font-extrabold tracking-tight">
                One board that grows with your degree
              </h2>
              <p className="mt-3 text-sm sm:text-base text-[#0B1C2D]/65">
                IoT, machine learning, web development, and server-side skills — the building blocks of modern solutions.
              </p>
            </div>
            <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-px bg-[#0B1C2D]/10 border border-[#0B1C2D]/10">
              {academicYears.map((y) => (
                <div key={y.year} className="bg-[#F4F7FB] p-4 sm:p-6">
                  <p className="font-[family-name:var(--font-iot-kit-display)] text-base sm:text-xl font-bold text-[#1E88E5]">
                    {y.year}
                  </p>
                  <p className="mt-2 text-xs sm:text-sm text-[#0B1C2D]/65 leading-relaxed">{y.focus}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Parts & components — flyer image */}
        <section id="parts" className="bg-white py-14 sm:py-20 scroll-mt-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="max-w-2xl mx-auto text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1E88E5]">Parts &amp; components</p>
              <h2 className="mt-2 font-[family-name:var(--font-iot-kit-display)] text-2xl sm:text-4xl font-extrabold tracking-tight">
                Explore every piece of the kit
              </h2>
              <p className="mt-3 text-sm sm:text-base text-[#0B1C2D]/65">
                Annotated board layout — know exactly what you&apos;re programming.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mt-10 relative w-full overflow-hidden border border-[#0B1C2D]/10 bg-[#0B1C2D]"
            >
              <Image
                src="/iot-board/parts-components.jpg"
                alt="BitnBolt IoT Development Kit parts and components diagram"
                width={1600}
                height={2000}
                className="w-full h-auto"
                sizes="(max-width: 1152px) 100vw, 1152px"
              />
            </motion.div>

            <div className="mt-12 grid sm:grid-cols-2 gap-x-10 gap-y-5">
              {components.map((c, i) => (
                <div key={c.name} className="flex gap-3 border-b border-[#0B1C2D]/8 pb-4">
                  <span className="font-[family-name:var(--font-iot-kit-display)] text-sm font-bold text-[#1E88E5] w-7 shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <p className="font-semibold text-sm sm:text-base">{c.name}</p>
                    <p className="mt-0.5 text-xs sm:text-sm text-[#0B1C2D]/60 leading-relaxed">{c.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Specs + features */}
        <section className="py-14 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 grid lg:grid-cols-2 gap-12">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1E88E5]">Technical specs</p>
              <h2 className="mt-2 font-[family-name:var(--font-iot-kit-display)] text-2xl sm:text-3xl font-extrabold">
                Built to teach. Specced to ship.
              </h2>
              <dl className="mt-8 divide-y divide-[#0B1C2D]/10 border-y border-[#0B1C2D]/10">
                {specs.map((s) => (
                  <div key={s.label} className="flex items-baseline justify-between gap-4 py-3.5">
                    <dt className="text-sm text-[#0B1C2D]/55">{s.label}</dt>
                    <dd className="text-sm sm:text-base font-semibold text-right">{s.value}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-3 text-[11px] text-[#0B1C2D]/45">*Availability may vary by kit revision.</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1E88E5]">Key features</p>
              <h2 className="mt-2 font-[family-name:var(--font-iot-kit-display)] text-2xl sm:text-3xl font-extrabold">
                Ready for classroom &amp; lab
              </h2>
              <ul className="mt-8 space-y-5">
                {features.map((f) => (
                  <li key={f.title}>
                    <p className="font-[family-name:var(--font-iot-kit-display)] font-bold text-lg">{f.title}</p>
                    <p className="mt-1 text-sm text-[#0B1C2D]/65 leading-relaxed">{f.body}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Offer — be10x price block */}
        <section id="offer" className="relative scroll-mt-20 py-14 sm:py-20 overflow-hidden">
          <div className="absolute inset-0 bg-[#0B1C2D]" />
          <div
            aria-hidden
            className="absolute inset-0 opacity-30"
            style={{
              background:
                'radial-gradient(circle at 20% 50%, rgba(30,136,229,0.45), transparent 45%), radial-gradient(circle at 85% 30%, rgba(255,209,102,0.25), transparent 40%)',
            }}
          />
          <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
            <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-14 items-center">
              <div className="text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#FFD166]">Student early-bird</p>
                <h2 className="mt-2 font-[family-name:var(--font-iot-kit-display)] text-2xl sm:text-4xl font-extrabold tracking-tight">
                  First {EARLY_BIRD_SEATS} seats. Then the window closes.
                </h2>
                <p className="mt-4 text-sm sm:text-base text-white/70 leading-relaxed max-w-lg">
                  Pay for your kit, then complete the registration form so we can confirm your seat and shipping. GST
                  applied at checkout as applicable.
                </p>
                <ul className="mt-6 space-y-2 text-sm text-white/80">
                  <li className="flex gap-2">
                    <span className="text-[#FFD166]">✓</span> Full IoT Development Kit with onboard modules
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#FFD166]">✓</span> C &amp; Python learning path on ESP32
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#FFD166]">✓</span> Guides &amp; sample projects included
                  </li>
                </ul>
              </div>

              <div className="bg-white p-6 sm:p-8 shadow-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1E88E5]">IoT Development Kit</p>
                <div className="mt-4 flex items-end gap-3">
                  <span className="text-lg text-[#0B1C2D]/40 line-through font-medium">₹{MRP.toLocaleString('en-IN')}</span>
                  <span className="font-[family-name:var(--font-iot-kit-display)] text-5xl sm:text-6xl font-extrabold text-[#0B1C2D] leading-none">
                    ₹{EARLY_BIRD}
                  </span>
                </div>
                <p className="mt-2 text-xs text-[#0B1C2D]/55">
                  Early-bird for first {EARLY_BIRD_SEATS} students · + GST as applicable
                </p>
                <a
                  href={primaryHref}
                  target={formUrl ? '_blank' : undefined}
                  rel={formUrl ? 'noopener noreferrer' : undefined}
                  className="mt-6 flex w-full items-center justify-center rounded-full bg-[#FFD166] px-6 py-3.5 text-base font-bold text-[#0B1C2D] hover:bg-[#FFC033] transition-colors"
                >
                  {primaryLabel}
                </a>
                {!formUrl && (
                  <Link
                    href="/iot-board"
                    className="mt-3 flex w-full items-center justify-center rounded-full border border-[#0B1C2D]/15 px-6 py-3 text-sm font-semibold text-[#0B1C2D] hover:bg-[#F4F7FB] transition-colors"
                  >
                    View full product details
                  </Link>
                )}
                <p className="mt-4 text-center text-[11px] text-[#0B1C2D]/45">
                  After payment, fill the registration Google Form shared with your confirmation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery */}
        <section className="py-14 sm:py-16 bg-white">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="font-[family-name:var(--font-iot-kit-display)] text-2xl sm:text-3xl font-extrabold tracking-tight">
              Gallery
            </h2>
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
              {['/iot-board/im1.png', '/iot-board/im2.png', '/iot-board/im3.png', '/iot-board/im5.png'].map((src) => (
                <div key={src} className="relative aspect-[4/3] overflow-hidden bg-[#0B1C2D]/5">
                  <Image src={src} alt="IoT kit gallery" fill className="object-cover" sizes="25vw" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-14 sm:py-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <h2 className="font-[family-name:var(--font-iot-kit-display)] text-2xl sm:text-4xl font-extrabold tracking-tight text-center">
              Frequently asked questions
            </h2>
            <div className="mt-10 divide-y divide-[#0B1C2D]/10 border-y border-[#0B1C2D]/10">
              {faqs.map((faq, i) => {
                const open = openFaq === i;
                return (
                  <div key={faq.q}>
                    <button
                      type="button"
                      onClick={() => setOpenFaq(open ? null : i)}
                      className="flex w-full items-center justify-between gap-4 py-4 text-left"
                      aria-expanded={open}
                    >
                      <span className="font-semibold text-sm sm:text-base">{faq.q}</span>
                      <span className="text-[#1E88E5] text-xl leading-none shrink-0">{open ? '−' : '+'}</span>
                    </button>
                    {open && (
                      <p className="pb-4 text-sm text-[#0B1C2D]/65 leading-relaxed">{faq.a}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="pb-24 sm:pb-28">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="relative overflow-hidden bg-[#1E88E5] px-6 py-10 sm:px-12 sm:py-14 text-white">
              <div
                aria-hidden
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    'radial-gradient(circle at 90% 20%, #FFD166, transparent 35%), linear-gradient(135deg, transparent, rgba(11,28,45,0.35))',
                }}
              />
              <div className="relative max-w-xl">
                <p className="font-[family-name:var(--font-iot-kit-display)] text-2xl sm:text-4xl font-extrabold tracking-tight">
                  Your IoT advantage starts on the bench.
                </p>
                <p className="mt-3 text-sm sm:text-base text-white/85">
                  Reserve an early-bird seat, get the kit, then register — and start coding C &amp; Python on hardware.
                </p>
                <a
                  href="#offer"
                  className="mt-6 inline-flex rounded-full bg-[#FFD166] px-6 py-3 text-sm font-bold text-[#0B1C2D] hover:bg-[#FFC033] transition-colors"
                >
                  Go to early-bird offer
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Contact footer strip */}
      <footer className="border-t border-[#0B1C2D]/10 bg-[#0B1C2D] text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 grid sm:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center gap-2.5">
              <Image src="/icon.png" alt="" width={32} height={32} className="h-8 w-8 object-contain" />
              <p className="font-[family-name:var(--font-iot-kit-display)] font-bold">{companyInfo.tradeName}</p>
            </div>
            <p className="mt-3 text-sm text-white/60">Empowering Ideas · Building the Future</p>
            <p className="mt-4 text-xs text-white/50 whitespace-pre-line">{formatCompanyAddress(true)}</p>
          </div>
          <div className="text-sm space-y-2 text-white/75">
            <p>
              <a className="hover:text-white" href={`mailto:${companyInfo.emails.info}`}>
                {companyInfo.emails.info}
              </a>
            </p>
            <p>
              <a className="hover:text-white" href={`mailto:${companyInfo.emails.support}`}>
                {companyInfo.emails.support}
              </a>
            </p>
            <p>
              <Link href="/" className="hover:text-white">
                www.bitnbolt.in
              </Link>
            </p>
            <p className="pt-2">
              <Link href="/iot-board" className="text-[#FFD166] hover:underline">
                Back to IoT DIY Kit →
              </Link>
            </p>
          </div>
        </div>
        <div className="border-t border-white/10 py-4 text-center text-[11px] text-white/40">
          © {new Date().getFullYear()} {companyInfo.legalName}. All rights reserved.
        </div>
      </footer>

      {/* Sticky CTA */}
      <div
        className={`fixed inset-x-0 bottom-0 z-50 border-t border-[#0B1C2D]/10 bg-white/95 backdrop-blur-md transition-transform duration-300 ${
          showSticky ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="min-w-0">
            <p className="text-xs text-[#0B1C2D]/55 truncate">Early-bird · first {EARLY_BIRD_SEATS}</p>
            <p className="font-[family-name:var(--font-iot-kit-display)] font-bold">
              <span className="text-[#0B1C2D]/35 line-through mr-2 text-sm">₹{MRP.toLocaleString('en-IN')}</span>
              ₹{EARLY_BIRD}
            </p>
          </div>
          <a
            href={primaryHref}
            target={formUrl ? '_blank' : undefined}
            rel={formUrl ? 'noopener noreferrer' : undefined}
            className="shrink-0 rounded-full bg-[#0B1C2D] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#163554] transition-colors"
          >
            {primaryLabel}
          </a>
        </div>
      </div>
    </div>
  );
}
