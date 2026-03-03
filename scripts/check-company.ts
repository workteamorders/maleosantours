import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const info = await prisma.companyInfo.findFirst();
    console.log('Current Company Info:', JSON.stringify(info, null, 2));
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
