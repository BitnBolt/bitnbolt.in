"use client";

import Image from 'next/image';
import { motion, type Variants } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HomeContent from '@/components/HomeContent';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PAGE_TOP } from '@/lib/layout';

type Props = {
    productId?: string;
};

function SectionHeading({
    title,
    subtitle,
    align = 'center',
}: {
    title: string;
    subtitle?: string;
    align?: 'center' | 'left';
}) {
    return (
        <div className={`mb-10 max-w-3xl ${align === 'center' ? 'mx-auto text-center' : ''}`}>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0B1C2D] mb-3 tracking-tight">
                {title}
            </h2>
            {subtitle && (
                <p className="text-lg text-gray-500 font-light leading-relaxed">{subtitle}</p>
            )}
        </div>
    );
}

export default function IotBoardClient({ productId }: Props) {
    const [adding, setAdding] = useState(false);
    const [inCart, setInCart] = useState(false);

    useEffect(() => {
        if (!productId) return;
        const controller = new AbortController();
        async function checkCart() {
            try {
                const cartRes = await fetch('/api/cart', { signal: controller.signal });
                if (cartRes.ok) {
                    const cart = await cartRes.json();
                    const present = (cart.items || []).some(
                        (it: { productId: string }) => String(it.productId) === String(productId)
                    );
                    setInCart(present);
                }
            } catch {
                // ignore
            }
        }
        checkCart();
        return () => controller.abort();
    }, [productId]);

    const container: Variants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.12 } },
    };

    const item: Variants = {
        hidden: { opacity: 0, y: 16 },
        show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 110 } },
    };

    const benefits = [
        'Everything you need in one box — no hassle of buying components separately.',
        'Easy-to-follow guides to get you started right away.',
        'Compatible with Arduino IDE and other popular micro-controllers.',
        'Reusable components for endless project possibilities.',
        'Great for boosting practical knowledge and innovation.',
    ];

    const academicYears = [
        { year: '1st Year', focus: 'Learn basic programming through visualization.' },
        { year: '2nd Year', focus: 'Interface sensors and actuators to build IoT projects.' },
        { year: '3rd Year', focus: 'Develop web servers and connect to databases for hands-on Web/App development.' },
        { year: '4th Year', focus: 'Build real-time advanced projects integrating IoT, Data Analytics, and ML/DL algorithms.' },
    ];

    const targetAudience = [
        'Students learning IoT, ML/DL, or Web/App development.',
        'Hobbyists building real-world solutions and need a prototype.',
        'Educators & trainers for hands-on teaching.',
        'MVP builders & hackathon participants.',
    ];

    const kitModules = [
        { id: 1, name: 'OLED Display', nature: 'Output Module' },
        { id: 2, name: '5V-Relay', nature: 'Output Module' },
        { id: 3, name: 'Buzzer', nature: 'Output Module' },
        { id: 4, name: '4-bit LED', nature: 'Output Module' },
        { id: 5, name: 'RGB Led', nature: 'Output Module' },
        { id: 6, name: '4-bit Seven Segment Display/Timer', nature: 'Output Module' },
        { id: 7, name: 'Potentiometer', nature: 'Input Modules' },
        { id: 8, name: 'Slider Switch', nature: 'Input Modules' },
        { id: 9, name: 'TSOP', nature: 'Input Modules' },
        { id: 10, name: '4-bit Switch', nature: 'Input Modules' },
        { id: 11, name: 'IR Sensor', nature: 'Input Modules' },
        { id: 12, name: 'Ultrasonic Sensor', nature: 'Input Modules' },
        { id: 13, name: 'ESP32 Microcontroller', nature: 'Controller' },
        { id: 14, name: 'Connectors', nature: 'Accessory' },
    ];

    const blogPosts = [
        {
            title: 'Getting started with the BitnBolt IoT Development Kit',
            category: 'IoT',
            image: '/iot-board/im1.png',
            href: 'https://blog.bitnbolt.in/blog',
        },
        {
            title: 'Build your first sensor project with ESP32',
            category: 'Embedded Systems',
            image: '/iot-board/im2.png',
            href: 'https://blog.bitnbolt.in/blog',
        },
        {
            title: 'From classroom to prototype: IoT projects for students',
            category: 'Learning',
            image: '/iot-board/im3.png',
            href: 'https://blog.bitnbolt.in/learn',
        },
    ];

    const handleBuyNow = async () => {
        if (!productId) {
            console.error('Product ID not found');
            return;
        }
        try {
            setAdding(true);
            const res = await fetch('/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId, quantity: 1 }),
            });
            if (res.ok) {
                setInCart(true);
                if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('cart-updated'));
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
        } finally {
            setAdding(false);
        }
    };

    const BuyButton = ({ className = '' }: { className?: string }) =>
        inCart ? (
            <Link
                href="/cart"
                className={`bg-green-600 hover:bg-green-700 text-white px-8 py-3.5 rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-md ${className}`}
            >
                View Cart
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
            </Link>
        ) : (
            <button
                onClick={handleBuyNow}
                disabled={adding}
                className={`bg-[#FFD166] hover:bg-[#FFC033] text-[#0B1C2D] px-8 py-3.5 rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-70 ${className}`}
            >
                {adding ? 'Adding...' : 'Buy Now'}
                {!adding && (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                )}
            </button>
        );

    const natureBadgeClass = (nature: string) => {
        if (nature.includes('Output')) return 'bg-green-100 text-green-800';
        if (nature.includes('Input')) return 'bg-amber-100 text-amber-800';
        if (nature.includes('Controller')) return 'bg-blue-100 text-blue-800';
        return 'bg-gray-100 text-gray-800';
    };

    return (
        <>
            <Header />
            <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-20 right-20 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
                <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
                <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />
            </div>

            <HomeContent>
                {/* Hero */}
                <section className={`relative bg-[#0B1C2D] text-white ${PAGE_TOP} pb-16 lg:pb-20 overflow-hidden`}>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0B1C2D] via-[#0B1C2D]/95 to-[#163554]/80 pointer-events-none" />
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#1E88E5]/15 to-transparent pointer-events-none" />

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <motion.div
                            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
                            variants={container}
                            initial="hidden"
                            animate="show"
                        >
                            <motion.div variants={item}>
                                <span className="inline-block bg-[#FFD166] text-[#0B1C2D] px-4 py-1.5 rounded-full font-semibold text-xs uppercase tracking-wide mb-5">
                                    IoT Learning Kit
                                </span>
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-5 tracking-tight">
                                    IoT Development{' '}
                                    <span className="text-[#1E88E5]">KIT</span>
                                </h1>
                                <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-xl font-light">
                                    A one-stop solution for IoT, ML/DL, and Web/App enthusiasts — explore connected
                                    technology with practical, hands-on experience.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <BuyButton />
                                    <Link
                                        href="/product/iot-board"
                                        className="border-2 border-white/30 hover:border-white/60 text-white px-8 py-3.5 rounded-full font-semibold flex items-center justify-center transition-all duration-300 hover:bg-white/10"
                                    >
                                        View Product
                                    </Link>
                                </div>
                            </motion.div>

                            <motion.div variants={item} className="relative">
                                <div className="relative rounded-lg overflow-hidden shadow-2xl ring-1 ring-white/10">
                                    <Image
                                        src="/iot-board/im4.png"
                                        alt="IoT Development KIT"
                                        width={1200}
                                        height={900}
                                        className="w-full h-auto object-cover"
                                        priority
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B1C2D]/40 to-transparent pointer-events-none" />
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </section>

                {/* Benefits */}
                <section id="details" className="py-12 bg-white relative">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            variants={container}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, amount: 0.2 }}
                        >
                            <SectionHeading
                                title="Kit overview & benefits"
                                subtitle="Everything a beginner or builder needs to start prototyping without hunting for parts."
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {benefits.map((benefit, i) => (
                                    <motion.div
                                        key={i}
                                        variants={item}
                                        className="bg-[#f8fafd] rounded-lg p-6 border border-transparent hover:border-blue-100 hover:shadow-lg transition-all duration-300 flex items-start gap-3"
                                    >
                                        <span className="text-[#1E88E5] mt-0.5 shrink-0">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </span>
                                        <p className="text-gray-700 text-sm leading-relaxed">{benefit}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Academic Years */}
                <section className="py-12 relative">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            variants={container}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, amount: 0.2 }}
                        >
                            <SectionHeading
                                title="How it helps across all academic years"
                                subtitle="A multidisciplinary board that combines IoT, Machine Learning, Web development, and server-side skills — the building blocks of modern solutions."
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {academicYears.map((academicYear, idx) => (
                                    <motion.div
                                        key={idx}
                                        variants={item}
                                        className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all duration-300"
                                    >
                                        <div className="text-[#1E88E5] font-bold text-xl mb-2">{academicYear.year}</div>
                                        <p className="text-gray-600 text-sm leading-relaxed">{academicYear.focus}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Who It's For */}
                <section className="py-12 bg-white relative">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            variants={container}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, amount: 0.2 }}
                        >
                            <SectionHeading title="Who it's for" />
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {targetAudience.map((audience, i) => (
                                    <motion.div
                                        key={i}
                                        variants={item}
                                        className="bg-[#0B1C2D] text-white rounded-lg p-6 shadow-md flex items-center justify-center min-h-[130px] text-center hover:bg-[#163554] transition-colors duration-300"
                                    >
                                        <p className="font-medium text-sm leading-relaxed">{audience}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* What's in the KIT */}
                <section className="py-12 relative">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            variants={container}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, amount: 0.2 }}
                        >
                            <SectionHeading
                                title="What's in the KIT"
                                subtitle="A curated mix of on-board modules that covers the basics before you move to real problem-solving and prototyping."
                            />
                            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead>
                                            <tr className="bg-[#0B1C2D]">
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider"
                                                >
                                                    Sr No.
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider"
                                                >
                                                    Module [On-Board]
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider"
                                                >
                                                    Nature
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {kitModules.map((mod) => (
                                                <tr key={mod.id} className="hover:bg-[#f8fafd] transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {mod.id}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#0B1C2D]">
                                                        {mod.name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                        <span
                                                            className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${natureBadgeClass(mod.nature)}`}
                                                        >
                                                            {mod.nature}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Gallery */}
                <section className="py-12 bg-white relative">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <SectionHeading title="Gallery" align="left" />
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {['/iot-board/im1.png', '/iot-board/im2.png', '/iot-board/im3.png', '/iot-board/im4.png'].map(
                                (src, i) => (
                                    <div
                                        key={i}
                                        className="relative rounded-lg overflow-hidden shadow-sm border border-gray-100 group aspect-[4/3]"
                                    >
                                        <Image
                                            src={src}
                                            alt="IoT Development Kit gallery"
                                            width={600}
                                            height={400}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </section>

                {/* Blog */}
                <section className="py-12 relative">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            variants={container}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, amount: 0.2 }}
                        >
                            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
                                <div>
                                    <h2 className="text-3xl md:text-4xl font-extrabold text-[#0B1C2D] mb-2 tracking-tight">
                                        Blog
                                    </h2>
                                    <p className="text-lg text-gray-500 font-light max-w-2xl">
                                        Guides, tutorials, and project ideas to get the most out of your IoT kit.
                                    </p>
                                </div>
                                <a
                                    href="https://blog.bitnbolt.in/blog"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#1E88E5] hover:text-[#0B1C2D] font-semibold text-sm whitespace-nowrap transition-colors"
                                >
                                    View all posts →
                                </a>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {blogPosts.map((post) => (
                                    <motion.a
                                        key={post.title}
                                        href={post.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        variants={item}
                                        className="group bg-white rounded-lg shadow-sm border border-transparent hover:border-blue-200 transition-all duration-300 overflow-hidden"
                                    >
                                        <div className="relative h-52 overflow-hidden">
                                            <Image
                                                src={post.image}
                                                alt={post.title}
                                                width={600}
                                                height={400}
                                                className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-90"
                                            />
                                        </div>
                                        <div className="p-5">
                                            <span className="text-xs font-medium text-[#1E88E5] bg-blue-50 px-2.5 py-1 rounded-full">
                                                {post.category}
                                            </span>
                                            <h3 className="text-gray-900 font-bold mt-3 leading-snug group-hover:text-[#1E88E5] transition-colors line-clamp-2">
                                                {post.title}
                                            </h3>
                                        </div>
                                    </motion.a>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* CAP + Buy CTA */}
                <section id="buy" className="py-12 bg-white relative">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <motion.div
                                variants={item}
                                initial="hidden"
                                whileInView="show"
                                viewport={{ once: true, amount: 0.2 }}
                                className="bg-[#0B1C2D] rounded-lg p-8 lg:p-10 text-white flex flex-col gap-6 shadow-xl h-full"
                            >
                                <div>
                                    <span className="inline-block bg-[#FFD166] text-[#0B1C2D] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-4">
                                        Career Accelerator Program
                                    </span>
                                    <h2 className="text-2xl font-bold mb-3 tracking-tight">
                                        Take your IoT skills further with CAP
                                    </h2>
                                    <p className="text-gray-300 leading-relaxed font-light text-sm">
                                        Ready to move beyond the kit? BitnBolt&apos;s Career Accelerator Program is a
                                        cohort-based track for early-career engineers in IoT, embedded systems, and hardware.
                                    </p>
                                </div>
                                <a
                                    href="https://career.bitnbolt.in/cap"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-auto bg-[#FFD166] hover:bg-[#FFC033] text-[#0B1C2D] px-8 py-3.5 rounded-full font-bold text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 w-full sm:w-auto sm:self-start"
                                >
                                    Explore CAP
                                </a>
                            </motion.div>

                            <motion.div
                                variants={item}
                                initial="hidden"
                                whileInView="show"
                                viewport={{ once: true, amount: 0.2 }}
                                className="bg-[#0B1C2D] rounded-lg p-8 lg:p-10 text-white flex flex-col gap-6 shadow-xl h-full"
                            >
                                <div>
                                    <h3 className="text-2xl font-bold mb-3 tracking-tight">
                                        Ready to start your IoT journey?
                                    </h3>
                                    <p className="text-gray-300 font-light text-sm">
                                        Get the IoT Development KIT today.
                                    </p>
                                </div>
                                <div className="mt-auto flex flex-col sm:flex-row gap-3">
                                    <BuyButton className="w-full sm:flex-1" />
                                    <Link
                                        href="/contact"
                                        className="border-2 border-white/30 hover:border-white/60 text-white px-8 py-3.5 rounded-full font-semibold text-center transition-all duration-300 hover:bg-white/10 w-full sm:flex-1"
                                    >
                                        Talk to Us
                                    </Link>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                <Footer />
            </HomeContent>
        </main>
        </>
    );
}
