import { prisma } from '../lib/prisma.js';

async function main() {
    const tour = await prisma.tourPackage.findFirst({
        where: {
            OR: [
                { nameId: { contains: 'Manado City Tour' } },
                { nameEn: { contains: 'Manado City Tour' } }
            ]
        }
    });

    if (!tour) {
        console.log('Tour not found');
        return;
    }

    console.log('--- TOUR DATA ---');
    console.log('ID:', tour.id);
    console.log('Name ID:', tour.nameId);
    console.log('Name EN:', tour.nameEn);
    console.log('Desc ID:', tour.descId);
    console.log('Desc EN:', tour.descEn);
    console.log('Itinerary ID:', tour.itineraryId);
    console.log('Itinerary EN:', tour.itineraryEn);
    console.log('Included ID:', tour.includedId);
    console.log('Included EN:', tour.includedEn);
    console.log('--- END ---');
}

main().catch(console.error).finally(() => prisma.$disconnect());
