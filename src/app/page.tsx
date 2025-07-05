import Header from '../components/Header';
import Hero from '../components/Hero';
import Deals from '../components/Deals';
import Products from '../components/Products';
import Footer from '../components/Footer';
import Features from '../components/Features';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
// import HomeContent from '@/components/HomeContent';
import HomeContent from '@/components/HomeContent';

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 overflow-hidden">
      {/* Background decorations */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-20 right-20 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Content */}
      <HomeContent>
        <Header />
        <Hero />
        <Deals />
        <Products />
        <Features />
        <Footer />
      </HomeContent>
    </main>
  );
}
