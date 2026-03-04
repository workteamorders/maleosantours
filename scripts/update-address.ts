import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const address = 'Swiss-Belhotel Maleosan Manado Arcade.';
    const googleMapsUrl = 'https://maps.google.com/maps?q=1.4883964,124.8465346&z=17&output=embed';

    const info = await prisma.companyInfo.findFirst();

    if (info) {
        await prisma.companyInfo.update({
            where: { id: info.id },
            data: {
                addressId: address,
                addressEn: address,
                addressZh: '美娜多马里奥桑瑞士贝尔酒店商场',
                addressZhCn: '美娜多馬里奧桑瑞士貝爾酒店商場',
                googleMaps: googleMapsUrl
            }
        });
        console.log('✅ Company info updated with new Google Maps URL');
    } else {
        console.log('❌ No company info found to update');
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
