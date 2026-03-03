import { prisma } from '../lib/prisma.js';
import fs from 'fs';

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
        fs.writeFileSync('debug_output.txt', 'Tour not found');
        return;
    }

    const output = {
        id: tour.id,
        nameId: tour.nameId,
        nameEn: tour.nameEn,
        descEn: tour.descEn,
        itineraryEn: tour.itineraryEn,
        includedEn: tour.includedEn,
        excludedEn: tour.excludedEn
    };

    fs.writeFileSync('debug_output.txt', JSON.stringify(output, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
