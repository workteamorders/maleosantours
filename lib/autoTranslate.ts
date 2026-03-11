/**
 * Auto-Translation Utilities
 * Translates missing locale fields on-the-fly and caches results to DB.
 * Used by both display pages (auto-translate on view) and server actions (auto-translate on save).
 */

import { prisma } from './prisma';

// ---------------------------------------------------------------------------
// Core: Google Translate (same engine as /api/translate)
// ---------------------------------------------------------------------------

async function translateWithGoogle(text: string, targetLang: string): Promise<string> {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=id&tl=${encodeURIComponent(targetLang)}&dt=t&q=${encodeURIComponent(text)}`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1)' },
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) throw new Error(`Google HTTP ${res.status}`);
  const data = await res.json();
  if (!Array.isArray(data) || !Array.isArray(data[0])) throw new Error('Invalid response');
  return (data[0] as [string, ...unknown[]][])
    .filter((item) => item[0])
    .map((item) => item[0])
    .join('');
}

/** Translate text (returns original on failure) */
async function safeTranslate(text: string, googleLang: string): Promise<string> {
  if (!text?.trim()) return text || '';
  try {
    const result = await translateWithGoogle(text, googleLang);
    return result || text;
  } catch (err) {
    console.warn(`[autoTranslate] Failed for "${text.slice(0, 40)}…" → ${googleLang}:`, err);
    return text;
  }
}

// ---------------------------------------------------------------------------
// Language mappings
// App locale → DB field suffix, Google Translate target language
// ---------------------------------------------------------------------------

const LOCALE_MAP: Record<string, { suffix: string; google: string }> = {
  en:      { suffix: 'En',   google: 'en' },
  zh:      { suffix: 'Zh',   google: 'zh-CN' },  // Simplified Chinese
  'zh-CN': { suffix: 'ZhCn', google: 'zh-TW' },  // Traditional Chinese
};

const TARGET_LOCALES = Object.keys(LOCALE_MAP); // ['en', 'zh', 'zh-CN']

// ---------------------------------------------------------------------------
// JSON field translators
// ---------------------------------------------------------------------------

async function translateItinerary(json: string | null, googleLang: string): Promise<string> {
  if (!json || json === '[]' || json === 'null') return '[]';
  try {
    const items = JSON.parse(json);
    if (!Array.isArray(items) || items.length === 0) return '[]';
    const translated = await Promise.all(
      items.map(async (item: any) => ({
        ...item,
        activity: item.activity?.trim()
          ? await safeTranslate(item.activity, googleLang)
          : (item.activity || ''),
      }))
    );
    return JSON.stringify(translated);
  } catch {
    return json;
  }
}

async function translateStringArray(json: string | null, googleLang: string): Promise<string> {
  if (!json || json === '[]' || json === 'null') return '[]';
  try {
    const items = JSON.parse(json);
    if (!Array.isArray(items) || items.length === 0) return '[]';
    const translated = await Promise.all(
      items.map(async (item: string) => item?.trim() ? await safeTranslate(item, googleLang) : (item || ''))
    );
    return JSON.stringify(translated);
  } catch {
    return json;
  }
}

function isEmpty(val: string | null | undefined): boolean {
  return !val || val.trim() === '' || val === '[]' || val === 'null';
}

// ---------------------------------------------------------------------------
// Tour Package: auto-translate for ONE locale (display-time)
// ---------------------------------------------------------------------------

export async function ensureTourTranslations(pkg: any, locale: string): Promise<any> {
  if (locale === 'id' || !LOCALE_MAP[locale]) return pkg;

  const { suffix, google } = LOCALE_MAP[locale];
  const updates: Record<string, string | null> = {};
  let needsUpdate = false;

  // Simple text fields
  const textPairs = [
    { src: 'nameId', tgt: `name${suffix}` },
    { src: 'descId', tgt: `desc${suffix}` },
    { src: 'duration', tgt: `duration${suffix}` },
    { src: 'priceUnit', tgt: `priceUnit${suffix}` },
  ];
  for (const { src, tgt } of textPairs) {
    if (isEmpty(pkg[tgt]) && !isEmpty(pkg[src])) {
      const translated = await safeTranslate(pkg[src], google);
      pkg[tgt] = translated;
      updates[tgt] = translated;
      needsUpdate = true;
    }
  }

  // Itinerary (JSON)
  const itinTgt = `itinerary${suffix}`;
  if (isEmpty(pkg[itinTgt]) && !isEmpty(pkg.itineraryId)) {
    const translated = await translateItinerary(pkg.itineraryId, google);
    pkg[itinTgt] = translated;
    updates[itinTgt] = translated;
    needsUpdate = true;
  }

  // Inclusions/Exclusions (JSON arrays)
  for (const base of ['included', 'excluded']) {
    const src = `${base}Id`;
    const tgt = `${base}${suffix}`;
    if (isEmpty(pkg[tgt]) && !isEmpty(pkg[src])) {
      const translated = await translateStringArray(pkg[src], google);
      pkg[tgt] = translated;
      updates[tgt] = translated;
      needsUpdate = true;
    }
  }

  // Cache to DB so this only runs once per record per locale
  if (needsUpdate) {
    prisma.tourPackage.update({ where: { id: pkg.id }, data: updates })
      .catch((e: unknown) => console.error('[autoTranslate] DB cache failed (tour):', e));
  }

  return pkg;
}

// ---------------------------------------------------------------------------
// Info Travel: auto-translate for ONE locale (display-time)
// ---------------------------------------------------------------------------

export async function ensureInfoTravelTranslations(item: any, locale: string): Promise<any> {
  if (locale === 'id' || !LOCALE_MAP[locale]) return item;

  const { suffix, google } = LOCALE_MAP[locale];
  const updates: Record<string, string | null> = {};
  let needsUpdate = false;

  // Text fields
  const textPairs = [
    { src: 'titleId', tgt: `title${suffix}` },
    { src: 'descId', tgt: `desc${suffix}` },
  ];
  for (const { src, tgt } of textPairs) {
    if (isEmpty(item[tgt]) && !isEmpty(item[src])) {
      const translated = await safeTranslate(item[src], google);
      item[tgt] = translated;
      updates[tgt] = translated;
      needsUpdate = true;
    }
  }

  // Itinerary
  const itinTgt = `itinerary${suffix}`;
  if (isEmpty(item[itinTgt]) && !isEmpty(item.itineraryId)) {
    const translated = await translateItinerary(item.itineraryId, google);
    item[itinTgt] = translated;
    updates[itinTgt] = translated;
    needsUpdate = true;
  }

  if (needsUpdate) {
    prisma.infoTravel.update({ where: { id: item.id }, data: updates })
      .catch((e: unknown) => console.error('[autoTranslate] DB cache failed (info):', e));
  }

  return item;
}

// ---------------------------------------------------------------------------
// Server-side: translate ALL missing locale fields at once (for save actions)
// ---------------------------------------------------------------------------

export async function autoTranslateAllFields(
  data: Record<string, any>,
  fieldMap: { src: string; targets: { suffix: string }[]; type: 'text' | 'itinerary' | 'array' }[]
): Promise<Record<string, any>> {
  // For each target locale, translate missing fields in parallel
  await Promise.all(
    TARGET_LOCALES.map(async (locale) => {
      const { suffix, google } = LOCALE_MAP[locale];

      for (const field of fieldMap) {
        const srcVal = data[field.src];
        if (isEmpty(srcVal)) continue;

        const tgtKey = `${field.src.replace(/Id$/, '')}${suffix}`;
        // Handle naming: descId → descEn, includedId → includedEn, etc.
        const actualTgtKey = field.targets.length > 0
          ? field.targets.find(t => t.suffix === suffix)
            ? `${field.src.replace(/Id$/, '').replace(/^itinerary$/, 'itinerary').replace(/^included$/, 'included').replace(/^excluded$/, 'excluded')}${suffix}`
            : tgtKey
          : tgtKey;

        if (!isEmpty(data[actualTgtKey])) continue; // already has translation

        if (field.type === 'text') {
          data[actualTgtKey] = await safeTranslate(srcVal, google);
        } else if (field.type === 'itinerary') {
          data[actualTgtKey] = await translateItinerary(srcVal, google);
        } else if (field.type === 'array') {
          data[actualTgtKey] = await translateStringArray(srcVal, google);
        }
      }
    })
  );

  return data;
}

/** Auto-translate all missing fields for a TourPackage data object before DB save */
export async function autoTranslateTourData(data: Record<string, any>): Promise<Record<string, any>> {
  for (const locale of TARGET_LOCALES) {
    const { suffix, google } = LOCALE_MAP[locale];

    // Text fields: nameId→name{suffix}, descId→desc{suffix}, duration→duration{suffix}, priceUnit→priceUnit{suffix}
    const textPairs = [
      { src: 'nameId', tgt: `name${suffix}` },
      { src: 'descId', tgt: `desc${suffix}` },
      { src: 'duration', tgt: `duration${suffix}` },
      { src: 'priceUnit', tgt: `priceUnit${suffix}` },
    ];
    for (const { src, tgt } of textPairs) {
      if (!isEmpty(data[src]) && isEmpty(data[tgt])) {
        data[tgt] = await safeTranslate(data[src], google);
      }
    }

    // Itinerary
    const itinTgt = `itinerary${suffix}`;
    if (!isEmpty(data.itineraryId) && isEmpty(data[itinTgt])) {
      data[itinTgt] = await translateItinerary(data.itineraryId, google);
    }

    // Inclusions/Exclusions
    for (const base of ['included', 'excluded']) {
      const src = `${base}Id`;
      const tgt = `${base}${suffix}`;
      if (!isEmpty(data[src]) && isEmpty(data[tgt])) {
        data[tgt] = await translateStringArray(data[src], google);
      }
    }
  }
  return data;
}

/** Auto-translate all missing fields for an InfoTravel data object before DB save */
export async function autoTranslateInfoTravelData(data: Record<string, any>): Promise<Record<string, any>> {
  for (const locale of TARGET_LOCALES) {
    const { suffix, google } = LOCALE_MAP[locale];

    // Text fields
    const textPairs = [
      { src: 'titleId', tgt: `title${suffix}` },
      { src: 'descId', tgt: `desc${suffix}` },
    ];
    for (const { src, tgt } of textPairs) {
      if (!isEmpty(data[src]) && isEmpty(data[tgt])) {
        data[tgt] = await safeTranslate(data[src], google);
      }
    }

    // Itinerary
    const itinTgt = `itinerary${suffix}`;
    if (!isEmpty(data.itineraryId) && isEmpty(data[itinTgt])) {
      data[itinTgt] = await translateItinerary(data.itineraryId, google);
    }
  }
  return data;
}
