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

    console.log('--- MANADO CITY TOUR DETAILS ---');
    console.log('Desc EN:', tour.descEn);
    console.log('Itinerary EN:', tour.itineraryEn);
    console.log('Included EN:', tour.includedEn);
    console.log('Excluded EN:', tour.excludedEn);
}

main().catch(console.error).finally(() => prisma.$disconnect());
