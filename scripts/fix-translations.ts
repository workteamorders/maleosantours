/**
 * Fix Missing Translations Script (V2 - Using google-translate-api-x)
 * Automatically translates missing content for all Tour Packages in the database
 * Usage: npx tsx scripts/fix-translations.ts
 */

import { prisma } from '../lib/prisma.js';
import { translate } from 'google-translate-api-x';

async function translateText(text: string): Promise<Record<string, string>> {
    if (!text || !text.trim()) return {};

    const results: Record<string, string> = {};

    try {
        // Translate to English
        const resEn = await translate(text, { from: 'id', to: 'en' });
        results['en'] = resEn.text;

        // Translate to Chinese Simplified
        const resZh = await translate(text, { from: 'id', to: 'zh-CN' });
        results['zh-CN'] = resZh.text;

        // Translate to Chinese Traditional
        const resZhTw = await translate(text, { from: 'id', to: 'zh-TW' });
        results['zh-TW'] = resZhTw.text;

        // Small delay to avoid rate limiting
        await new Promise(r => setTimeout(r, 500));
    } catch (err) {
        console.error('    Translation error:', err);
        // Fallback to original text if error
        results['en'] = text;
        results['zh-CN'] = text;
        results['zh-TW'] = text;
    }

    return results;
}

async function main() {
    console.log('🔍 Checking for missing or invalid translations in Tour Packages...\n');

    const tours = await prisma.tourPackage.findMany();

    for (const tour of tours) {
        let needsUpdate = false;
        const updateData: any = {};

        console.log(`📦 Processing: ${tour.nameId}`);

        // Check Description
        // We update if English is same as ID (indicating it wasn't really translated) or empty
        if (tour.descId && (!tour.descEn || tour.descEn === tour.descId || tour.descEn.length < 5)) {
            console.log('   - Translating Description...');
            const t = await translateText(tour.descId);
            if (t['en'] !== tour.descId) {
                updateData.descEn = t['en'];
                updateData.descZh = t['zh-CN'];
                updateData.descZhCn = t['zh-TW'];
                needsUpdate = true;
            }
        }

        // Check Itinerary
        if (tour.itineraryId && tour.itineraryId !== '[]') {
            const itinerary = JSON.parse(tour.itineraryId);
            // Deep compare or check if En is just a copy of Id
            const isItineraryEmpty = !tour.itineraryEn || tour.itineraryEn === '[]' || tour.itineraryEn === tour.itineraryId;

            if (isItineraryEmpty) {
                console.log('   - Translating Itinerary...');
                try {
                    const enItin = []; const zhItin = []; const zhCnItin = [];
                    for (const item of itinerary) {
                        if (item.activity.trim()) {
                            const t = await translateText(item.activity);
                            enItin.push({ time: item.time, activity: t['en'] || item.activity });
                            zhItin.push({ time: item.time, activity: t['zh-CN'] || item.activity });
                            zhCnItin.push({ time: item.time, activity: t['zh-TW'] || item.activity });
                        } else {
                            enItin.push(item); zhItin.push(item); zhCnItin.push(item);
                        }
                    }
                    updateData.itineraryEn = JSON.stringify(enItin);
                    updateData.itineraryZh = JSON.stringify(zhItin);
                    updateData.itineraryZhCn = JSON.stringify(zhCnItin);
                    needsUpdate = true;
                } catch (e) {
                    console.error('     Error processing itinerary:', e);
                }
            }
        }

        // Check Included
        if (tour.includedId && tour.includedId !== '[]') {
            const isIncludedEmpty = !tour.includedEn || tour.includedEn === '[]' || tour.includedEn === tour.includedId;

            if (isIncludedEmpty) {
                console.log('   - Translating Inclusions...');
                try {
                    const inclusions = JSON.parse(tour.includedId);
                    const enInc = []; const zhInc = []; const zhCnInc = [];
                    for (const item of inclusions) {
                        if (item.trim()) {
                            const t = await translateText(item);
                            enInc.push(t['en'] || item);
                            zhInc.push(t['zh-CN'] || item);
                            zhCnInc.push(t['zh-TW'] || item);
                        } else {
                            enInc.push(item); zhInc.push(item); zhCnInc.push(item);
                        }
                    }
                    updateData.includedEn = JSON.stringify(enInc);
                    updateData.includedZh = JSON.stringify(zhInc);
                    updateData.includedZhCn = JSON.stringify(zhCnInc);
                    needsUpdate = true;
                } catch (e) {
                    console.error('     Error processing inclusions:', e);
                }
            }
        }

        // Check Excluded
        if (tour.excludedId && tour.excludedId !== '[]') {
            const isExcludedEmpty = !tour.excludedEn || tour.excludedEn === '[]' || tour.excludedEn === tour.excludedId;

            if (isExcludedEmpty) {
                console.log('   - Translating Exclusions...');
                try {
                    const exclusions = JSON.parse(tour.excludedId);
                    const enExc = []; const zhExc = []; const zhCnExc = [];
                    for (const item of exclusions) {
                        if (item.trim()) {
                            const t = await translateText(item);
                            enExc.push(t['en'] || item);
                            zhExc.push(t['zh-CN'] || item);
                            zhCnExc.push(t['zh-TW'] || item);
                        } else {
                            enExc.push(item); zhExc.push(item); zhCnExc.push(item);
                        }
                    }
                    updateData.excludedEn = JSON.stringify(enExc);
                    updateData.excludedZh = JSON.stringify(zhExc);
                    updateData.excludedZhCn = JSON.stringify(zhCnExc);
                    needsUpdate = true;
                } catch (e) {
                    console.error('     Error processing exclusions:', e);
                }
            }
        }

        if (needsUpdate) {
            await prisma.tourPackage.update({
                where: { id: tour.id },
                data: updateData
            });
            console.log(`   ✅ Successfully updated: ${tour.nameId}`);
        } else {
            console.log(`   ⏭️ Skipped (Already translated): ${tour.nameId}`);
        }
    }

    console.log('\n✨ Database translation fix complete!');
}

main()
    .catch((e) => {
        console.error('❌ Global script error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
