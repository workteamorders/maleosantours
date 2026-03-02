import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import HomeContent from '../../components/HomeContent';

export default function Home() {
  return (
    <main className="relative bg-white min-h-screen">
      <Navbar />
      <HomeContent />
      <Footer />
    </main>
  );
}

