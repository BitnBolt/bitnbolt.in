import Header from '../components/Header';
import Hero from '../components/Hero';
import Deals from '../components/Deals';
import Products from '../components/Products';
import Features from '../components/Features';
import Testimonials from '../components/Testimonials';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Deals />
      <Products />
      {/* <Features /> */}
      {/* <Testimonials /> */}
      {/* <Contact /> */}
      <Footer />
    </main>
  );
}
