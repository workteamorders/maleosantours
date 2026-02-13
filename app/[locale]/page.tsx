import Hero from '../../components/Hero';
import Navbar from '../../components/Navbar';
import Philosophy from '../../components/Philosophy';
import Destinations from '../../components/Destinations';
import Services from '../../components/Services';
import Journal from '../../components/Journal';
import Footer from '../../components/Footer';

export default function Home() {
  return (
    <main className="relative bg-background">
      <Navbar />
      <Hero />
      <Philosophy />
      {/* Destinations (Horizontal Scroll) */}
      <div className="relative z-10 bg-background">
        <Destinations />
      </div>
      <Services />
      <Journal />
      <Footer />
    </main>
  );
}
