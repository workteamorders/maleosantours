import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import StaticPageHeader from '../../../components/StaticPageHeader';
import { MapPin, Info } from 'lucide-react';

export default function TravelInfo() {
  const guides = [
    { title: 'Manado Guide', link: '/info-travel/manado-guide' },
    { title: 'History & Culture', link: '/info-travel/history-culture' },
    { title: 'Transportation in Manado', link: '/info-travel/transportation' },
    { title: 'Shopping in Manado', link: '/info-travel/shopping' },
    { title: 'Food & Cuisine', link: '/info-travel/food-cuisine' },
  ];

  return (
    <main className="bg-white min-h-screen">
      <Navbar />
      <StaticPageHeader
        title="Travel Info"
        current="Travel Info"
        image="https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=2600&auto=format&fit=crop"
      />
      <div className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Sidebar */}
          <div className="col-span-1">
            <div className="bg-gray-50 p-6 border border-gray-100">
              <h3 className="text-xl font-serif font-bold mb-6 pb-4 border-b border-gray-200">Travel Guides</h3>
              <ul className="space-y-4">
                {guides.map((g, i) => (
                  <li key={i}>
                    <a href={g.link} className="flex items-center text-gray-600 hover:text-amber-600 transition-colors font-medium">
                      <Info size={16} className="mr-3" />
                      {g.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-1 md:col-span-2 space-y-8 text-gray-700 leading-relaxed">
            <div className="prose max-w-none">
              <h2 className="text-3xl font-serif font-bold mb-6 text-gray-900">Welcome to Manado</h2>
              <p className="mb-4">
                Nestled at the tip of the Minahasa Peninsula in North Sulawesi, Manado is a vibrant city surrounded by dramatic volcanic mountains and the sparkling waters of the Celebes Sea. It serves as the gateway to some of Indonesia's most spectacular diving sites, including the world-renowned Bunaken National Marine Park.
              </p>
              <p className="mb-4">
                Beyond its underwater treasures, Manado offers a rich cultural tapestry with a unique blend of Minahasan traditions and Dutch colonial influences. The city is famous for its spicy and flavorful cuisine, warm hospitality, and stunning natural landscapes ranging from highland lakes to lush rainforests.
              </p>
              <img src="https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=800&auto=format&fit=crop" alt="Manado Coast" className="w-full h-80 object-cover my-8 rounded-sm" />
              <h3 className="text-2xl font-serif font-bold mb-4 text-gray-900">Key Facts</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-amber-50 p-4 border-l-4 border-amber-500">
                  <span className="block font-bold text-amber-700">Currency</span>
                  Indonesian Rupiah (IDR)
                </div>
                <div className="bg-amber-50 p-4 border-l-4 border-amber-500">
                  <span className="block font-bold text-amber-700">Language</span>
                  Bahasa Indonesia, Manado Malay
                </div>
                <div className="bg-amber-50 p-4 border-l-4 border-amber-500">
                  <span className="block font-bold text-amber-700">Climate</span>
                  Tropical Rainforest
                </div>
                <div className="bg-amber-50 p-4 border-l-4 border-amber-500">
                  <span className="block font-bold text-amber-700">Time Zone</span>
                  WITA (GMT+8)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
