import { prisma } from '../lib/prisma.js';

async function main() {
    const tours = await prisma.tourPackage.findMany({
        select: {
            id: true,
            slug: true,
            nameId: true,
            nameEn: true,
            descEn: true
        }
    });

    console.log(JSON.stringify(tours, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
