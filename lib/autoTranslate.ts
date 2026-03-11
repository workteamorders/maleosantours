/**
 * Auto-Translation Utilities
 * Translates missing locale fields on-the-fly and caches results to DB.
 * Used by both display pages (auto-translate on view) and server actions (auto-translate on save).
 */

import { prisma } from './prisma';

// ---------------------------------------------------------------------------
// Core translators: Google primary, MyMemory fallback
// ---------------------------------------------------------------------------

async function translateWithGoogle(text: string, targetLang: string): Promise<string> {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=id&tl=${encodeURIComponent(targetLang)}&dt=t&q=${encodeURIComponent(text)}`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1)' },
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`Google HTTP ${res.status}`);
  const data = await res.json();
  if (!Array.isArray(data) || !Array.isArray(data[0])) throw new Error('Invalid response');
  const result = (data[0] as [string, ...unknown[]][])
    .filter((item) => item[0])
    .map((item) => item[0])
    .join('');
  if (!result) throw new Error('Empty result');
  return result;
}

async function translateWithMyMemory(text: string, targetLang: string): Promise<string> {
  const target = (targetLang === 'zh-TW' || targetLang === 'zh-tw') ? 'zh-CN' : targetLang;
  const shortText = text.slice(0, 490);
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(shortText)}&langpair=id|${target}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
  const data = await res.json();
  const t: string = data?.responseData?.translatedText ?? '';
  if (
    data.responseStatus === 200 &&
    t &&
    !t.includes('INVALID TARGET LANGUAGE') &&
    !t.includes('MYMEMORY WARNING') &&
    t.toLowerCase() !== shortText.toLowerCase()
  ) {
    return t;
  }
  throw new Error(`MyMemory failed (status ${data.responseStatus})`);
}

/**
 * Translate text with Google → MyMemory fallback.
 * Returns NULL on failure so callers know NOT to cache the bad result.
 * IMPORTANT: Never return the source text as a "translation" — that causes
 * the system to think the field is already translated and skip future retries.
 */
async function safeTranslate(text: string, googleLang: string): Promise<string | null> {
  if (!text?.trim()) return text || '';
  try {
    const result = await translateWithGoogle(text, googleLang);
    // Reject if result is identical to source (indicates translation failure)
    if (result.trim().toLowerCase() === text.trim().toLowerCase()) return null;
    return result;
  } catch (googleErr) {
    console.warn(`[autoTranslate] Google failed → ${googleLang}:`, googleErr);
    try {
      const result = await translateWithMyMemory(text, googleLang);
      if (result.trim().toLowerCase() === text.trim().toLowerCase()) return null;
      return result;
    } catch (mmErr) {
      console.warn(`[autoTranslate] MyMemory failed → ${googleLang}:`, mmErr);
      return null; // Return null — caller should NOT cache this
    }
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
// JSON field translators — sequential to avoid rate limiting
// ---------------------------------------------------------------------------

/** Translate itinerary JSON sequentially (not parallel) to avoid rate-limit */
async function translateItinerary(json: string | null, googleLang: string): Promise<string | null> {
  if (!json || json === '[]' || json === 'null') return '[]';
  try {
    const items = JSON.parse(json);
    if (!Array.isArray(items) || items.length === 0) return '[]';
    const translated: any[] = [];
    let anyTranslated = false;
    for (const item of items) {
      if (item.activity?.trim()) {
        const result = await safeTranslate(item.activity, googleLang);
        if (result !== null) {
          translated.push({ ...item, activity: result });
          anyTranslated = true;
        } else {
          translated.push(item); // keep original on failure
        }
      } else {
        translated.push(item);
      }
    }
    // Only return if at least one item was actually translated
    return anyTranslated ? JSON.stringify(translated) : null;
  } catch {
    return null;
  }
}

/** Translate string array sequentially */
async function translateStringArray(json: string | null, googleLang: string): Promise<string | null> {
  if (!json || json === '[]' || json === 'null') return '[]';
  try {
    const items = JSON.parse(json);
    if (!Array.isArray(items) || items.length === 0) return '[]';
    const translated: string[] = [];
    let anyTranslated = false;
    for (const item of items) {
      if (item?.trim()) {
        const result = await safeTranslate(item, googleLang);
        if (result !== null) {
          translated.push(result);
          anyTranslated = true;
        } else {
          translated.push(item); // keep original on failure
        }
      } else {
        translated.push(item || '');
      }
    }
    return anyTranslated ? JSON.stringify(translated) : null;
  } catch {
    return null;
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
  const updates: Record<string, string> = {};
  let needsUpdate = false;

  // Simple text fields — only cache if translation is non-null (i.e. actually translated)
  const textPairs = [
    { src: 'nameId', tgt: `name${suffix}` },
    { src: 'descId', tgt: `desc${suffix}` },
    { src: 'duration', tgt: `duration${suffix}` },
    { src: 'priceUnit', tgt: `priceUnit${suffix}` },
  ];
  for (const { src, tgt } of textPairs) {
    if (isEmpty(pkg[tgt]) && !isEmpty(pkg[src])) {
      const translated = await safeTranslate(pkg[src], google);
      if (translated !== null) {
        pkg[tgt] = translated;   // mutate for this request
        updates[tgt] = translated; // cache to DB
        needsUpdate = true;
      } else {
        // Translation failed — show source as fallback but do NOT cache
        pkg[tgt] = pkg[src];
      }
    }
  }

  // Itinerary (JSON)
  const itinTgt = `itinerary${suffix}`;
  if (isEmpty(pkg[itinTgt]) && !isEmpty(pkg.itineraryId)) {
    const translated = await translateItinerary(pkg.itineraryId, google);
    if (translated !== null) {
      pkg[itinTgt] = translated;
      updates[itinTgt] = translated;
      needsUpdate = true;
    } else {
      pkg[itinTgt] = pkg.itineraryId; // show original, don't cache
    }
  }

  // Inclusions/Exclusions (JSON arrays)
  for (const base of ['included', 'excluded']) {
    const src = `${base}Id`;
    const tgt = `${base}${suffix}`;
    if (isEmpty(pkg[tgt]) && !isEmpty(pkg[src])) {
      const translated = await translateStringArray(pkg[src], google);
      if (translated !== null) {
        pkg[tgt] = translated;
        updates[tgt] = translated;
        needsUpdate = true;
      } else {
        pkg[tgt] = pkg[src];
      }
    }
  }

  // Cache to DB so this only runs once per record per locale (only for successful translations)
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
  const updates: Record<string, string> = {};
  let needsUpdate = false;

  // Text fields
  const textPairs = [
    { src: 'titleId', tgt: `title${suffix}` },
    { src: 'descId', tgt: `desc${suffix}` },
  ];
  for (const { src, tgt } of textPairs) {
    if (isEmpty(item[tgt]) && !isEmpty(item[src])) {
      const translated = await safeTranslate(item[src], google);
      if (translated !== null) {
        item[tgt] = translated;
        updates[tgt] = translated;
        needsUpdate = true;
      } else {
        item[tgt] = item[src];
      }
    }
  }

  // Itinerary
  const itinTgt = `itinerary${suffix}`;
  if (isEmpty(item[itinTgt]) && !isEmpty(item.itineraryId)) {
    const translated = await translateItinerary(item.itineraryId, google);
    if (translated !== null) {
      item[itinTgt] = translated;
      updates[itinTgt] = translated;
      needsUpdate = true;
    } else {
      item[itinTgt] = item.itineraryId;
    }
  }

  if (needsUpdate) {
    prisma.infoTravel.update({ where: { id: item.id }, data: updates })
      .catch((e: unknown) => console.error('[autoTranslate] DB cache failed (info):', e));
  }

  return item;
}

// ---------------------------------------------------------------------------
// Server-side: auto-translate on save
// ---------------------------------------------------------------------------

/** Auto-translate all missing fields for a TourPackage data object before DB save */
export async function autoTranslateTourData(data: Record<string, any>): Promise<Record<string, any>> {
  for (const locale of TARGET_LOCALES) {
    const { suffix, google } = LOCALE_MAP[locale];

    const textPairs = [
      { src: 'nameId', tgt: `name${suffix}` },
      { src: 'descId', tgt: `desc${suffix}` },
      { src: 'duration', tgt: `duration${suffix}` },
      { src: 'priceUnit', tgt: `priceUnit${suffix}` },
    ];
    for (const { src, tgt } of textPairs) {
      if (!isEmpty(data[src]) && isEmpty(data[tgt])) {
        const result = await safeTranslate(data[src], google);
        if (result !== null) data[tgt] = result;
        // If null: leave field empty so it retries on next save/view
      }
    }

    const itinTgt = `itinerary${suffix}`;
    if (!isEmpty(data.itineraryId) && isEmpty(data[itinTgt])) {
      const result = await translateItinerary(data.itineraryId, google);
      if (result !== null) data[itinTgt] = result;
    }

    for (const base of ['included', 'excluded']) {
      const src = `${base}Id`;
      const tgt = `${base}${suffix}`;
      if (!isEmpty(data[src]) && isEmpty(data[tgt])) {
        const result = await translateStringArray(data[src], google);
        if (result !== null) data[tgt] = result;
      }
    }
  }
  return data;
}

/** Auto-translate all missing fields for an InfoTravel data object before DB save */
export async function autoTranslateInfoTravelData(data: Record<string, any>): Promise<Record<string, any>> {
  for (const locale of TARGET_LOCALES) {
    const { suffix, google } = LOCALE_MAP[locale];

    const textPairs = [
      { src: 'titleId', tgt: `title${suffix}` },
      { src: 'descId', tgt: `desc${suffix}` },
    ];
    for (const { src, tgt } of textPairs) {
      if (!isEmpty(data[src]) && isEmpty(data[tgt])) {
        const result = await safeTranslate(data[src], google);
        if (result !== null) data[tgt] = result;
      }
    }

    const itinTgt = `itinerary${suffix}`;
    if (!isEmpty(data.itineraryId) && isEmpty(data[itinTgt])) {
      const result = await translateItinerary(data.itineraryId, google);
      if (result !== null) data[itinTgt] = result;
    }
  }
  return data;
}
