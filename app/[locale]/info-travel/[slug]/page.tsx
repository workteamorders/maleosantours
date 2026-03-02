
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StaticPageHeader from '@/components/StaticPageHeader';
import { notFound } from 'next/navigation';
import { Info, MapPin, ChefHat, Bus, ShoppingBag, Landmark } from 'lucide-react';
import Link from 'next/link';

// Mock Data for the guides
const guidesData: Record<string, any> = {
    'manado-guide': {
        title: "Manado Guide",
        subtitle: "The Gateway to North Sulawesi",
        image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=2600&auto=format&fit=crop",
        icon: MapPin,
        content: `
            <p>Manado, the capital of North Sulawesi province, is situated at the Bay of Manado and is surrounded by a mountainous area. The city is the main gateway to North Sulawesi and is known for its beautiful underwater sea gardens at Bunaken National Park.</p>
            <p>The city itself is a melting pot of cultures, with a strong Dutch influence evident in the architecture and religion. The people of Manado are known for their warmth and hospitality.</p>
            <h3>Getting There</h3>
            <p>Sam Ratulangi International Airport (MDC) is the main entry point, with direct flights from major Indonesian cities like Jakarta, Surabaya, and Makassar, as well as international flights from Singapore and China.</p>
            <h3>Best Time to Visit</h3>
            <p>The best time to visit Manado is during the dry season from May to October. The waters are clearest for diving between June and September.</p>
        `
    },
    'history-culture': {
        title: "History & Culture",
        subtitle: "A Rich Tapestry of Traditions",
        image: "https://images.unsplash.com/photo-1599577785507-6c84f686c478?q=80&w=2600&auto=format&fit=crop",
        icon: Landmark,
        content: `
            <p>The Minahasa region has a unique history distinct from the rest of Indonesia. Before the arrival of Europeans, the region was governed by a confederation of tribes. The Dutch influence is strong here, often referred to as the '12th Province of the Netherlands' in the past.</p>
            <h3>Religion</h3>
            <p>Christianity is the predominant religion in Manado, which is evident in the numerous churches dotting the landscape. The iconic 'Jesus Blessing' statue is a testament to this faith.</p>
            <h3>Traditions</h3>
            <p>The Minahasan people have preserved many ancient traditions, including the Waruga (stone sarcophagi) and traditional dances like the Maengket.</p>
        `
    },
    'transportation': {
        title: "Transportation in Manado",
        subtitle: "Getting Around the City",
        image: "https://images.unsplash.com/photo-1541535650810-10d26f5c2ab3?q=80&w=2600&auto=format&fit=crop",
        icon: Bus,
        content: `
            <p>Getting around Manado is relatively easy with various options available for travelers.</p>
            <h3>Mikrolet (Angkot)</h3>
            <p>The most common form of public transport is the blue mini-buses known as Mikrolet. They follow specific routes and are very affordable.</p>
            <h3>Ojek</h3>
            <p>Motorcycle taxis (Ojek) are available everywhere and are good for short distances or beating traffic. Online ride-hailing apps like Gojek and Grab are also widely used.</p>
            <h3>Car Rental</h3>
            <p>For more comfort and flexibility, renting a car with a driver is recommended, especially for day trips to Minahasa Highlands or Bitung.</p>
            <h3>Taxis</h3>
            <p>Blue Bird taxis are reliable and use meters. They can be hailed on the street or booked via phone/app.</p>
        `
    },
    'shopping': {
        title: "Shopping in Manado",
        subtitle: "Souvenirs and Modern Malls",
        image: "https://images.unsplash.com/photo-1555529771-835f59fc5efe?q=80&w=2600&auto=format&fit=crop",
        icon: ShoppingBag,
        content: `
            <p>Manado offers a mix of modern shopping malls and traditional markets.</p>
            <h3>Modern Malls</h3>
            <p>Manado Town Square (Mantos) and Mega Mall web are popular spots located along the Boulevard, offering international brands, cinemas, and food courts.</p>
            <h3>Souvenirs</h3>
            <p>Look for 'Kue Klappertaart' (coconut cake), nutmeg candies, and traditional woven fabrics (Kain Bentenan) as distinct souvenirs from North Sulawesi.</p>
            <h3>Merciful Building</h3>
            <p>A popular stop for souvenirs, offering a wide range of local snacks and handicrafts.</p>
        `
    },
    'food-cuisine': {
        title: "Food & Cuisine",
        subtitle: "A Spicy Culinary Adventure",
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2600&auto=format&fit=crop",
        icon: ChefHat,
        content: `
            <p>Manado cuisine is famous throughout Indonesia for its spicy, savory, and fresh flavors. It makes heavy use of rich spices like chili, basil, lemongrass, and lime leaves.</p>
            <h3>Must-Try Dishes</h3>
            <ul>
                <li><strong>Tinutuan (Manado Porridge):</strong> A savory rice porridge mixed with pumpkin, sweet potato, corn, and vegetables, usually served for breakfast.</li>
                <li><strong>Ayam Rica-Rica:</strong> Chicken cooked in a spicy chili and tomato sauce. 'Rica' means chili in the local dialect.</li>
                <li><strong>Cakalang Fufu:</strong> Smoked skipjack tuna, a staple of the region.</li>
                <li><strong>Woku:</strong> A yellow spice paste made with turmeric, ginger, and lime leaves, used for fish or chicken.</li>
            </ul>
        `
    }
};

const guideLinks = [
    { title: 'Manado Guide', link: '/info-travel/manado-guide', icon: MapPin },
    { title: 'History & Culture', link: '/info-travel/history-culture', icon: Landmark },
    { title: 'Transportation', link: '/info-travel/transportation', icon: Bus },
    { title: 'Shopping', link: '/info-travel/shopping', icon: ShoppingBag },
    { title: 'Food & Cuisine', link: '/info-travel/food-cuisine', icon: ChefHat },
];

export default async function GuideDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const guide = guidesData[slug];

    if (!guide) {
        notFound();
    }

    const Icon = guide.icon;

    return (
        <main className="bg-neutral-50 min-h-screen font-sans">
            <Navbar />
            <StaticPageHeader
                title={guide.title}
                current={guide.title}
                image={guide.image}
            />

            <div className="container mx-auto px-6 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                    {/* Sidebar Navigation */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
                            <h3 className="text-lg font-serif font-bold mb-6 pb-2 border-b border-gray-100 text-gray-900">Travel Guides</h3>
                            <ul className="space-y-2">
                                {guideLinks.map((item, i) => (
                                    <li key={i}>
                                        <Link
                                            href={item.link}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${item.link.includes(slug)
                                                    ? 'bg-amber-50 text-amber-700 font-bold border-l-4 border-amber-500'
                                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                }`}
                                        >
                                            <item.icon size={18} />
                                            {item.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <div className="bg-white p-8 md:p-12 rounded-xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] border border-gray-100">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
                                    <Icon size={24} />
                                </div>
                                <div>
                                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">{guide.title}</h1>
                                    <p className="text-amber-600 font-medium">{guide.subtitle}</p>
                                </div>
                            </div>

                            <div
                                className="prose prose-lg prose-amber max-w-none text-gray-600 leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: guide.content }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
