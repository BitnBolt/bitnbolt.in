'use client';

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Contact from '@/components/Contact';
import { PAGE_TOP } from '@/lib/layout';

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header forceWhite />
      <div className={PAGE_TOP}>
        <Contact />
      </div>
      <Footer />
    </main>
  );
}
