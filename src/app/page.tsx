import Header from '../components/Header';
import Hero from '../components/Hero';
import Deals from '../components/Deals';
import Products from '../components/Products';
import Footer from '../components/Footer';

export default function Home() {
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
