import { NextRequest, NextResponse } from 'next/server';

/**
 * Translation API Route
 * Primary: Google Translate unofficial API (no key, no char limit, reliable zh-TW)
 * Fallback: MyMemory API (500 char limit, poor zh-TW support — last resort only)
 */

async function translateWithGoogle(text: string, targetLang: string): Promise<string> {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=id&tl=${encodeURIComponent(targetLang)}&dt=t&q=${encodeURIComponent(text)}`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1)' },
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) throw new Error(`Google HTTP ${res.status}`);
  const data = await res.json();
  if (!Array.isArray(data) || !Array.isArray(data[0])) throw new Error('Google: invalid response');
  const translated = (data[0] as [string, ...unknown[]][])
    .filter((item) => item[0])
    .map((item) => item[0])
    .join('');
  if (!translated) throw new Error('Google: empty result');
  return translated;
}

async function translateWithMyMemory(text: string, targetLang: string): Promise<string> {
  // zh-TW is unreliable on MyMemory — use zh-CN as best effort
  const target = (targetLang === 'zh-TW' || targetLang === 'zh-tw') ? 'zh-CN' : targetLang;
  const shortText = text.slice(0, 490); // stay under 500 char limit
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(shortText)}&langpair=id|${target}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
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

export async function POST(request: NextRequest) {
  try {
    const { text, targetLangs } = await request.json();

    if (!text || !text.trim()) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 });
    }

    const langs: string[] = targetLangs || ['en', 'zh-CN', 'zh-TW'];
    const results: Record<string, string> = {};

    await Promise.all(
      langs.map(async (lang) => {
        try {
          results[lang] = await translateWithGoogle(text, lang);
        } catch (googleErr) {
          console.warn(`[translate] Google failed for ${lang}:`, googleErr);
          try {
            results[lang] = await translateWithMyMemory(text, lang);
          } catch (mmErr) {
            console.error(`[translate] All providers failed for ${lang}:`, mmErr);
            results[lang] = text; // absolute last resort
          }
        }
      })
    );

    return NextResponse.json({ translations: results });
  } catch (error) {
    console.error('[translate] Unhandled error:', error);
    return NextResponse.json({ error: 'Translation failed' }, { status: 500 });
  }
}
