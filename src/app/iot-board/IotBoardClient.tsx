"use client";

import Image from 'next/image';
import { motion, type Variants } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useState, useEffect } from 'react';
import Link from 'next/link';

type Props = {
    productId?: string;
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
                    const present = (cart.items || []).some((it: { productId: string }) => String(it.productId) === String(productId));
                    setInCart(present);
                }
            } catch (e) {
                // ignore
            }
        }
        checkCart();
        return () => controller.abort();
    }, [productId]);

    const container: Variants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.12 } }
    };

    const item: Variants = {
        hidden: { opacity: 0, y: 16 },
        show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 110 } }
    };

    const benefits = [
        "Everything you need in one box - no hassle of buying components separately.",
        "Easy-to-follow guides to get you started right away.",
        "Compatible with Arduino IDE and other popular micro-controllers.",
        "Reusable components for endless project possibilities.",
        "Great for boosting practical knowledge and innovation."
    ];

    const academicYears = [
        { year: "1st Year", focus: "Learn basic programming through visualization." },
        { year: "2nd Year", focus: "Interface sensors and actuators to build IoT projects." },
        { year: "3rd Year", focus: "Develop web servers and connect to databases for hands-on Web/App development." },
        { year: "4th Year", focus: "Build real-time advanced projects integrating IoT, Data Analytics, and ML/DL algorithms." }
    ];

    const targetAudience = [
        "Students learning IoT or ML/DL or Web/App Developement.",
        "Hobbyists building real-world solutions and need a prototype.",
        "Educators & Trainers for hands-on teaching.",
        "MVP Builders & Hacktahan Participants."
    ];

    const kitModules = [
        { id: 1, name: "OLED Display", nature: "Output Module" },
        { id: 2, name: "5V-Relay", nature: "Output Module" },
        { id: 3, name: "Buzzer", nature: "Output Module" },
        { id: 4, name: "4-bit LED", nature: "Output Module" },
        { id: 5, name: "RGB Led", nature: "Output Module" },
        { id: 6, name: "4-bit Seven Segment Display/Timer", nature: "Output Module" },
        { id: 7, name: "Potentiometer", nature: "Input Modules" },
        { id: 8, name: "Slider Switch", nature: "Input Modules" },
        { id: 9, name: "TSOP", nature: "Input Modules" },
        { id: 10, name: "4-bit Switch", nature: "Input Modules" },
        { id: 11, name: "IR Sensor", nature: "Input Modules" },
        { id: 12, name: "Ultrasonic Sensor", nature: "Input Modules" },
        { id: 13, name: "ESP32 Microcontroller", nature: "Controller" },
        { id: 14, name: "Connectors", nature: "Accessory" },
    ];

    const handleBuyNow = async () => {
        if (!productId) {
            console.error("Product ID not found");
            return;
        }
        try {
            setAdding(true);
            const res = await fetch('/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId: productId, quantity: 1 })
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

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 overflow-hidden">
            <Header />
            <div className="fixed inset-0 z-0">
                <div className="absolute top-20 right-24 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute bottom-24 left-24 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
            </div>

            {/* Hero Section */}
            <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
                <motion.div
                    className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
                    variants={container}
                    initial="hidden"
                    animate="show"
                >
                    <motion.div variants={item}>
                        <span className="inline-block bg-blue-100 text-blue-600 px-4 py-2 rounded-full font-medium text-sm mb-4">
                            One stop solution for IoT, ML/DL and Web/App Enthusiast
                        </span>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
                            IoT Development KIT
                        </h1>
                        <p className="text-gray-700 text-lg leading-relaxed mb-6 max-w-xl">
                            This kit is a one-stop solution to explore the world of IoT with practical, hands-on experience.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3">
                            {inCart ? (
                                <Link
                                    href="/cart"
                                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md shadow-green-200 flex items-center justify-center"
                                >
                                    View Cart
                                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                </Link>
                            ) : (
                                <button
                                    onClick={handleBuyNow}
                                    disabled={adding}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md shadow-blue-200 flex items-center justify-center disabled:opacity-70"
                                >
                                    {adding ? 'Adding...' : 'Buy Now'}
                                    {!adding && <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>}
                                </button>
                            )}
                            <Link href="/product/iot-board" className="bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-800 px-6 py-3 rounded-xl font-semibold flex items-center justify-center">
                                View Product
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div variants={item} className="relative">
                        <div className="relative rounded-3xl overflow-hidden shadow-xl">
                            <Image
                                src="https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=1200&h=900&fit=crop"
                                alt="IoT Development KIT"
                                width={1200}
                                height={900}
                                className="w-full h-auto object-cover"
                                priority
                            />
                        </div>
                    </motion.div>
                </motion.div>
            </section>

            {/* Benefits Section */}
            <section id="details" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Kit Overview & Benefits</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {benefits.map((benefit, i) => (
                            <motion.div key={i} variants={item} className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 flex items-start">
                                <span className="text-green-500 mr-3 text-xl">✓</span>
                                <p className="text-gray-700 font-medium">{benefit}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* Academic Years Section */}
            <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white/50 rounded-3xl my-12">
                <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
                    <div className="text-center mb-10 max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Helps Across All Academic Years</h2>
                        <p className="text-gray-600">
                            This board is very user friendly and can be utilized in many ways. It helps to work with a multidisciplinary approach like combining different technologies like IoT, Machine Learning , Deep Learning, Web development, Application Development, Server-End Development which is the basic requirement of any solution nowadays.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {academicYears.map((academicYear, idx) => (
                            <motion.div key={idx} variants={item} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="text-blue-600 font-bold text-xl mb-2">{academicYear.year}</div>
                                <p className="text-gray-700 text-sm">{academicYear.focus}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* Who It's For Section */}
            <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Who It's For</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {targetAudience.map((audience, i) => (
                            <motion.div key={i} variants={item} className="bg-blue-600 text-white rounded-2xl p-6 shadow-lg text-center flex items-center justify-center min-h-[120px]">
                                <p className="font-semibold text-lg">{audience}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* What’s in the KIT Section */}
            <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">What’s in the KIT</h2>
                        <p className="text-gray-600 max-w-3xl mx-auto">
                            The On-Board kit contains a mix combination which completes the basic learning before heading towards actual problem solving or prtotyping an idea. It provides base for beginners who are new to this technology.
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr No.</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name of the Module [On-Board]</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nature</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {kitModules.map((module) => (
                                        <tr key={module.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{module.id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{module.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${module.nature.includes('Output') ? 'bg-green-100 text-green-800' :
                                                        module.nature.includes('Input') ? 'bg-yellow-100 text-yellow-800' :
                                                            module.nature.includes('Controller') ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                                                    {module.nature}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Gallery Section - Kept as it adds visual appeal */}
            <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Gallery</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {["photo-1581091226825-a6a2a5aee158", "photo-1580894908360-9243200b4b9b", "photo-1518779578993-ec3579fee39f", "photo-1519389950473-47ba0277781c"].map((id, i) => (
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

            {/* Buy Section */}
            <section id="buy" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 lg:p-10 text-white flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-xl">
                    <div>
                        <h3 className="text-2xl font-bold mb-2">Ready to start your IoT journey?</h3>
                        <p className="opacity-90">Get the IoT Development KIT today.</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                        {inCart ? (
                            <Link
                                href="/cart"
                                className="bg-white text-green-700 hover:text-green-800 px-6 py-3 rounded-xl font-semibold text-center"
                            >
                                View Cart
                            </Link>
                        ) : (
                            <button
                                onClick={handleBuyNow}
                                disabled={adding}
                                className="bg-white text-blue-700 hover:text-blue-800 px-6 py-3 rounded-xl font-semibold text-center disabled:opacity-70"
                            >
                                {adding ? 'Adding...' : 'Buy Now'}
                            </button>
                        )}
                        <Link href="/contact" className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl font-semibold text-center">
                            Talk to Us
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    )
}
