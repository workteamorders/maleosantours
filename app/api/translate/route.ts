import { NextRequest, NextResponse } from 'next/server';

/**
 * Translation API Route
 * Migrated to more stable providers (TranslateAI & MyMemory)
 */
export async function POST(request: NextRequest) {
  try {
    const { text, targetLangs } = await request.json();

    if (!text || !text.trim()) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 });
    }

    const langs = targetLangs || ['en', 'zh-CN', 'zh-TW'];
    const results: Record<string, string> = {};

    // Parallelize translation calls for better speed
    await Promise.all(langs.map(async (lang: string) => {
      try {
        // Map common codes to MyMemory format (id|en, id|zh, id|zht)
        let target = lang;
        if (lang === 'zh-CN' || lang === 'zh') target = 'zh-CN'; // Simplified
        if (lang === 'zh-TW' || lang === 'zh-tw') target = 'zh-TW'; // Traditional

        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=id|${target}`;
        const res = await fetch(url);
        const data = await res.json();

        // MyMemory sometimes returns 200 with error message as translatedText
        if (data.responseData &&
          data.responseData.translatedText &&
          !data.responseData.translatedText.includes('INVALID TARGET LANGUAGE') &&
          data.responseStatus === 200) {
          results[lang] = data.responseData.translatedText;
        } else {
          results[lang] = text;
        }
      } catch (err) {
        console.error(`Translation to ${lang} failed:`, err);
        results[lang] = text;
      }
    }));

    return NextResponse.json({ translations: results });
  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json({ error: 'Translation failed' }, { status: 500 });
  }
}
