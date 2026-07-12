'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { PAGE_TOP } from '@/lib/layout';
import { companyInfo } from '@/lib/company';

const processSteps = [
  {
    step: '01',
    title: 'Discovery call',
    detail:
      'We listen to the idea—product goal, constraints, budget band, and timeline. No polished deck required. A voice note or rough sketch is enough to start.',
    youGet: 'Written scope summary and a clear “yes / not yet / better path” recommendation.',
  },
  {
    step: '02',
    title: 'Architecture & schematic',
    detail:
      'We choose the MCU/parts approach and draw a full schematic you can review—power tree, interfaces, and part availability considered up front.',
    youGet: 'Schematic drafts, BOM candidates, and design decisions documented with you.',
  },
  {
    step: '03',
    title: 'PCB layout & review',
    detail:
      'We lay out the board for your size, connectors, and signal needs. You see previews and can request changes before the design is locked.',
    youGet: 'Layout files, Gerbers, BOM, and a design package ready for your fab or ours.',
  },
  {
    step: '04',
    title: 'Validate & iterate',
    detail:
      'Optional prototype bring-up: power-on, checks, and a revision if something needs fixing. Design stays the product—boards are just how we prove it.',
    youGet: 'A stable revision, change log, and notes for the next build or production handoff.',
  },
];

const whoItsFor = [
  {
    title: 'Founders & product teams',
    text: 'You have a product idea but no in-house hardware designer. We turn the concept into a custom PCB you own and can manufacture anywhere.',
  },
  {
    title: 'Students & makers',
    text: 'Thesis, competition, or personal project—we design the board when a hobby kit is not enough.',
  },
  {
    title: 'Companies upgrading a product',
    text: 'Cost-down, size-down, new sensors, or a redesign of an aging board—without restarting from a blank company.',
  },
  {
    title: 'Teams that already have files',
    text: 'Bring Altium, KiCad, EasyEDA, or a reference board. We review, fix DRC/DFM issues, or redesign the parts that are wrong.',
  },
];

const scopeBlocks = [
  {
    code: '01',
    label: 'Requirement capture',
    text: 'Functional goals, I/O list, power source, size limits, certifications to aim for later, and “nice to have” vs must-have.',
  },
  {
    code: '02',
    label: 'Schematic & part selection',
    text: 'MCU, power, sensors, connectors, and passives chosen for availability in India / import lead times—not only datasheet ideals.',
  },
  {
    code: '03',
    label: 'Custom PCB layout',
    text: 'Layer stack, routing, footprints, silkscreen, and clearances tuned to your constraints—clean files you can send to any manufacturer.',
  },
  {
    code: '04',
    label: 'Design review & DFM',
    text: 'We catch footprint mistakes, clearance issues, and assembly risks before you spend on boards.',
  },
  {
    code: '05',
    label: 'Bring-up support (optional)',
    text: 'Help powering the first boards, checking rails and buses, and planning the next revision if needed.',
  },
  {
    code: '06',
    label: 'Manufacturing handoff',
    text: 'Gerber, BOM, CPL, and notes so your fab house—or an optional BitnBolt-assisted build—can run without guessing.',
  },
];

const deliverables = [
  { item: 'Schematic PDF / source', note: 'Core of the engagement' },
  { item: 'PCB layout files', note: 'KiCad / agreed toolchain' },
  { item: 'Gerbers & drill files', note: 'Ready for any fab house' },
  { item: 'BOM with alternates', note: 'Where parts are scarce' },
  { item: 'Pick-and-place / CPL', note: 'For assembly houses' },
  { item: 'Assembly drawing', note: 'Where parts go and how' },
  { item: 'Design notes', note: 'Why key choices were made' },
  { item: 'Revision history', note: 'What changed and why' },
];

const engagementNotes = [
  {
    q: 'How pricing usually works',
    a: 'We quote custom PCB design as the main line item. Optional prototype boards or assembly are listed separately if you want them—so you are not forced into a fabrication package. Complexity (layers, RF, high-speed, enclosure fit) drives the estimate.',
  },
  {
    q: 'Typical design timing',
    a: 'Simple 2-layer designs can move from brief to reviewable layout in a couple of weeks once scope is locked. Dense multilayer, RF, or scarce parts take longer. We give a dated plan in the quote—not a vague “soon.”',
  },
  {
    q: 'What you must bring vs what we invent',
    a: 'You need a goal (“sense X, talk to Y, fit in Z”). We invent the circuit and layout. If you already have constraints (exact MCU, connector, battery), we design around them.',
  },
  {
    q: 'IP and files',
    a: 'Project files for work you paid for are handed over as agreed. Your custom PCB design is yours—we do not reuse proprietary work for another client.',
  },
];

const faqs = [
  {
    q: 'I only have a vague idea. Is that enough?',
    a: 'Yes. Many projects start with “I need a board that does X.” We turn that into requirements, then design. The brief form on this page is intentionally open—perfection is not required.',
  },
  {
    q: 'Is this mostly a fabrication service?',
    a: 'No. Custom PCB design is the main service—schematic, layout, and production-ready files. We can help arrange prototypes if useful, but you can take our files to any fab house you prefer.',
  },
  {
    q: 'Do you only do IoT boards?',
    a: 'No. IoT is one of our strengths, but this service is open-ended: industrial control, sensor hubs, power boards, educational kits, wearables, and one-off research hardware are all in scope.',
  },
  {
    q: 'Can you work from my existing KiCad / EasyEDA / Altium files?',
    a: 'Yes. Send what you have. We review for errors and manufacturability, fix issues, or redesign the sections that need it.',
  },
  {
    q: 'Will you also write firmware?',
    a: 'We can. Hardware and firmware often move together. Use the brief to mention firmware needs, or see our firmware page—same team, one conversation.',
  },
  {
    q: 'What if the first board build has issues?',
    a: 'That is why design review and optional bring-up matter. We diagnose, document the root cause, and spin a design revision. Design work and board cost are quoted separately so surprises stay visible.',
  },
  {
    q: 'Do I need a company or GST to start?',
    a: 'Individuals, students, and companies can all inquire. Commercial terms (invoice, GST) are sorted when you decide to proceed—not before you ask a question.',
  },
  {
    q: 'How do I start without committing money today?',
    a: 'Send the brief or email info@bitnbolt.in. Discovery is a conversation. A paid engagement begins only after you accept a written scope and quote.',
  },
];

const briefHints = [
  'What should the board do in one sentence?',
  'Power source (USB, battery, mains, PoE…)?',
  'Must-have interfaces (Wi-Fi, BLE, UART, relays…)?',
  'Size / enclosure limits, if any?',
  'Design only, or do you also want a first prototype?',
  'Deadline or event you are aiming for?',
];

export default function PcbClient() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    quantity: 'Not sure yet',
    stage: 'Just an idea',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent('Custom PCB design — BitnBolt');
    const body = encodeURIComponent(
      [
        `Name: ${formData.name}`,
        `Email: ${formData.email}`,
        `Phone: ${formData.phone || '—'}`,
        `Company: ${formData.company || '—'}`,
        `Quantity: ${formData.quantity}`,
        `Current stage: ${formData.stage}`,
        '',
        'Idea / requirements:',
        formData.message,
      ].join('\n'),
    );
    window.location.href = `mailto:${companyInfo.emails.info}?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  return (
    <>
      <Header forceWhite />
      <main className="min-h-screen bg-white text-[#0B1C2D]">
        <section className={`relative overflow-hidden bg-[#0B1C2D] text-white ${PAGE_TOP} pb-0`}>
          <div className="absolute inset-0">
            <Image
              src="/slideshow/im2.png"
              alt=""
              fill
              priority
              className="object-cover object-center opacity-40"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-linear-to-r from-[#0B1C2D] via-[#0B1C2D]/90 to-[#0B1C2D]/40" />
            <div className="absolute inset-0 bg-linear-to-t from-[#0B1C2D] via-transparent to-[#0B1C2D]/30" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-20 pt-2 sm:pt-8">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[10px] sm:text-sm tracking-[0.28em] uppercase text-[#FFD166] mb-3 sm:mb-8 font-semibold"
            >
              Custom PCB design · BitnBolt
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 }}
              className="max-w-[14ch] text-3xl sm:text-6xl lg:text-7xl font-extrabold leading-[0.95] tracking-tight"
            >
              Your idea.
              <br />
              <span className="text-[#1E88E5]">A custom PCB.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.14 }}
              className="mt-3 sm:mt-7 max-w-xl text-sm sm:text-lg text-gray-300 font-light leading-snug sm:leading-relaxed"
            >
              Schematic, layout, and production-ready files designed around your product—not a
              catalog board. Fabrication is optional; the design is the service.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22 }}
              className="mt-5 sm:mt-10 flex flex-wrap items-center gap-3 sm:gap-4"
            >
              <a
                href="#brief"
                className="bg-[#FFD166] hover:bg-[#FFC033] text-[#0B1C2D] px-5 py-2.5 sm:px-8 sm:py-3.5 text-sm sm:text-base font-semibold rounded-full transition-colors"
              >
                Start a brief
              </a>
              <a
                href="#doubts"
                className="text-sm sm:text-base text-gray-300 hover:text-white underline underline-offset-4 decoration-white/30"
              >
                Clear common doubts
              </a>
            </motion.div>
          </div>
        </section>

        {/* Who it's for */}
        <section className="border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
            <p className="text-[10px] sm:text-xs tracking-[0.2em] uppercase text-[#1E88E5] font-semibold mb-1.5 sm:mb-2">
              Who this is for
            </p>
            <h2 className="text-xl sm:text-4xl font-extrabold tracking-tight mb-5 sm:mb-10 max-w-2xl leading-tight">
              Built for people who need a custom design—not a catalog SKU.
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4 sm:gap-y-8">
              {whoItsFor.map((row, i) => (
                <motion.div
                  key={row.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="border-t border-gray-200 pt-3 sm:pt-5"
                >
                  <h3 className="text-base sm:text-lg font-bold mb-1 sm:mb-2">{row.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-500 font-light leading-relaxed">{row.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Process — detailed */}
        <section id="flow" className="bg-[#f8fafd] border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
            <div className="mb-5 sm:mb-12 max-w-2xl">
              <p className="text-[10px] sm:text-xs tracking-[0.2em] uppercase text-[#1E88E5] font-semibold mb-1.5 sm:mb-2">
                Process
              </p>
              <h2 className="text-xl sm:text-4xl font-extrabold tracking-tight mb-2 sm:mb-3 leading-tight">
                Idea in. Design out—with checkpoints.
              </h2>
              <p className="text-xs sm:text-base text-gray-500 font-light leading-relaxed">
                You always know what step you are on and what files you will own. Boards are only
                ordered when you choose to validate the design in hardware.
              </p>
            </div>

            <div className="space-y-0">
              {processSteps.map((step, i) => (
                <motion.article
                  key={step.step}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-6 py-4 sm:py-8 border-t border-gray-200"
                >
                  <div className="sm:col-span-2 flex sm:block items-baseline gap-2">
                    <span className="text-[10px] sm:text-xs font-bold text-[#1E88E5] tracking-wide">
                      {step.step}
                    </span>
                    <h3 className="mt-0 sm:mt-1 text-base sm:text-xl font-bold leading-snug">{step.title}</h3>
                  </div>
                  <p className="sm:col-span-6 text-xs sm:text-base text-gray-600 font-light leading-relaxed">
                    {step.detail}
                  </p>
                  <p className="sm:col-span-4 text-xs sm:text-sm leading-relaxed bg-white/70 sm:bg-transparent rounded-lg sm:rounded-none px-3 py-2 sm:p-0 border border-gray-100 sm:border-0">
                    <span className="block text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-[#1E88E5] mb-0.5 sm:mb-1">
                      You get
                    </span>
                    <span className="text-gray-700">{step.youGet}</span>
                  </p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* Scope detailed */}
        <section className="border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-12">
            <div className="lg:col-span-4">
              <p className="text-[10px] sm:text-xs tracking-[0.2em] uppercase text-[#1E88E5] font-semibold mb-1.5 sm:mb-2">
                What we cover
              </p>
              <h2 className="text-xl sm:text-4xl font-extrabold tracking-tight leading-tight mb-2 sm:mb-3">
                Custom PCB design, end to end—or the slice you need.
              </h2>
              <p className="text-xs sm:text-base text-gray-500 font-light leading-relaxed">
                Most clients come for schematic and layout. Some only need a review or redesign.
                Prototype builds are available if you want them—never required to get a design.
              </p>
            </div>

            <ul className="lg:col-span-8 divide-y divide-gray-200">
              {scopeBlocks.map((row, i) => (
                <motion.li
                  key={row.code}
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className="flex gap-3 sm:gap-6 py-3.5 sm:py-6"
                >
                  <span className="w-6 sm:w-8 shrink-0 text-[10px] sm:text-xs font-bold text-[#1E88E5] tabular-nums pt-0.5 sm:pt-1">
                    {row.code}
                  </span>
                  <div>
                    <h3 className="text-sm sm:text-xl font-semibold mb-1 sm:mb-1.5">{row.label}</h3>
                    <p className="text-xs sm:text-sm text-gray-500 font-light leading-relaxed">{row.text}</p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>
        </section>

        {/* Deliverables */}
        <section className="bg-[#0B1C2D] text-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
            <p className="text-[10px] sm:text-xs tracking-[0.2em] uppercase text-[#FFD166] font-semibold mb-1.5 sm:mb-2">
              Deliverables
            </p>
            <h2 className="text-xl sm:text-4xl font-extrabold tracking-tight mb-2 sm:mb-3 max-w-xl leading-tight">
              The design package you walk away with.
            </h2>
            <p className="text-xs sm:text-base text-gray-400 font-light max-w-2xl mb-5 sm:mb-10">
              Exact package is set in the quote. These are the usual design deliverables—so “done”
              means files you own, not just a conversation.
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/10">
              {deliverables.map((d, i) => (
                <motion.div
                  key={d.item}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.03 }}
                  className="bg-[#0B1C2D] p-3 sm:p-6 border border-white/10"
                >
                  <p className="font-semibold text-xs sm:text-base mb-0.5 sm:mb-1 leading-snug">{d.item}</p>
                  <p className="text-[10px] sm:text-sm text-gray-400 font-light">{d.note}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Engagement / how money & time work */}
        <section className="border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
            <p className="text-[10px] sm:text-xs tracking-[0.2em] uppercase text-[#1E88E5] font-semibold mb-1.5 sm:mb-2">
              Before you commit
            </p>
            <h2 className="text-xl sm:text-4xl font-extrabold tracking-tight mb-5 sm:mb-10 max-w-2xl leading-tight">
              Pricing, timing, and ownership—spelled out.
            </h2>
            <div className="space-y-0">
              {engagementNotes.map((row, i) => (
                <motion.div
                  key={row.q}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className="grid grid-cols-1 sm:grid-cols-12 gap-1.5 sm:gap-8 py-4 sm:py-6 border-t border-gray-200"
                >
                  <h3 className="sm:col-span-4 text-sm sm:text-lg font-bold">{row.q}</h3>
                  <p className="sm:col-span-8 text-xs sm:text-base text-gray-500 font-light leading-relaxed">
                    {row.a}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ — clear doubts */}
        <section id="doubts" className="bg-[#f8fafd] border-b border-gray-100">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
            <p className="text-[10px] sm:text-xs tracking-[0.2em] uppercase text-[#1E88E5] font-semibold mb-1.5 sm:mb-2">
              Common doubts
            </p>
            <h2 className="text-xl sm:text-4xl font-extrabold tracking-tight mb-5 sm:mb-8 leading-tight">
              Answers before you write to us.
            </h2>
            <ul className="divide-y divide-gray-200 border-t border-b border-gray-200">
              {faqs.map((faq, i) => {
                const open = openFaq === i;
                return (
                  <li key={faq.q}>
                    <button
                      type="button"
                      onClick={() => setOpenFaq(open ? null : i)}
                      className="w-full flex items-start justify-between gap-3 sm:gap-4 py-3.5 sm:py-5 text-left"
                      aria-expanded={open}
                    >
                      <span className="text-sm sm:text-base font-semibold pr-2 leading-snug">{faq.q}</span>
                      <span
                        className={`shrink-0 text-[#1E88E5] text-lg sm:text-xl leading-none mt-0.5 transition-transform ${open ? 'rotate-45' : ''}`}
                        aria-hidden
                      >
                        +
                      </span>
                    </button>
                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <p className="pb-3.5 sm:pb-5 text-xs sm:text-sm text-gray-500 font-light leading-relaxed pr-6 sm:pr-8">
                            {faq.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* Brief */}
        <section id="brief" className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-12">
            <div className="lg:col-span-5">
              <p className="text-[10px] sm:text-xs tracking-[0.2em] uppercase text-[#1E88E5] font-semibold mb-1.5 sm:mb-2">
                Project brief
              </p>
              <h2 className="text-xl sm:text-4xl font-extrabold tracking-tight leading-tight mb-2 sm:mb-3">
                Tell us what the board should do.
              </h2>
              <p className="text-xs sm:text-base text-gray-500 font-light leading-relaxed mb-4 sm:mb-6">
                Submitting opens your email with a draft to {companyInfo.emails.info}. No account,
                no payment—we reply about the custom PCB design first.
              </p>

              <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-[#0B1C2D] mb-2 sm:mb-3">
                Helpful to include
              </p>
              <ul className="space-y-1.5 sm:space-y-2 mb-5 sm:mb-8">
                {briefHints.map((hint) => (
                  <li key={hint} className="flex gap-2 text-xs sm:text-sm text-gray-500 font-light">
                    <span className="text-[#1E88E5] font-bold shrink-0">·</span>
                    {hint}
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-3 sm:gap-4 text-sm">
                <Link href="/firmware" className="text-[#1E88E5] font-semibold hover:underline">
                  Need firmware too →
                </Link>
                <Link href="/contact" className="text-gray-500 hover:text-[#0B1C2D]">
                  Prefer a call →
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7">
              {submitted ? (
                <div className="border border-gray-200 bg-[#f8fafd] p-5 sm:p-10 rounded-xl sm:rounded-2xl">
                  <p className="text-lg sm:text-xl font-bold mb-2">Draft ready.</p>
                  <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
                    If mail did not open, write to{' '}
                    <a className="text-[#1E88E5] underline" href={`mailto:${companyInfo.emails.info}`}>
                      {companyInfo.emails.info}
                    </a>
                    . We typically reply with clarifying questions and a recommended next step.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="text-sm font-semibold text-[#0B1C2D] underline underline-offset-4"
                  >
                    Send another
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-8 space-y-3 sm:space-y-5 bg-[#f8fafd]"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <input
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Name *"
                      className="w-full bg-white border border-gray-200 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                    <input
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email *"
                      className="w-full bg-white border border-gray-200 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Phone / WhatsApp"
                      className="w-full bg-white border border-gray-200 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                    <input
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Company / college (optional)"
                      className="w-full bg-white border border-gray-200 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <select
                      name="stage"
                      value={formData.stage}
                      onChange={handleChange}
                      className="w-full bg-white border border-gray-200 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    >
                      <option>Just an idea</option>
                      <option>Have a sketch / block diagram</option>
                      <option>Have schematic / PCB files</option>
                      <option>Need design review / fix</option>
                      <option>Need redesign / cost-down</option>
                    </select>
                    <select
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      className="w-full bg-white border border-gray-200 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    >
                      <option>Not sure yet</option>
                      <option>Design files only</option>
                      <option>Design + first prototype</option>
                      <option>Design for small batch later</option>
                      <option>Design for production later</option>
                    </select>
                  </div>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Describe the board: what it should do, power, interfaces, size limits, deadline, and anything you already have (files, reference product, old PCB)…"
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-y min-h-[100px] sm:min-h-[140px]"
                  />
                  <button
                    type="submit"
                    className="w-full sm:w-auto bg-[#0B1C2D] hover:bg-[#163554] text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-sm font-semibold transition-colors"
                  >
                    Send brief to BitnBolt
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
