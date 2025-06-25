import Header from '../components/Header';
import Hero from '../components/Hero';
import Deals from '../components/Deals';
import Products from '../components/Products';
import Footer from '../components/Footer';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/auth/signin');
  }
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Deals />
      <Products />
      <Footer />
    </main>
  );
}
