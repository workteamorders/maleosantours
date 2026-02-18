import { NextRequest, NextResponse } from 'next/server';
import translate from 'google-translate-api-x';

/**
 * Translation API Route
 * Translates Indonesian text to English, Chinese Simplified, and Chinese Traditional
 */
export async function POST(request: NextRequest) {
  try {
    const { text, targetLangs } = await request.json();

    if (!text || !text.trim()) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 });
    }

    const langs = targetLangs || ['en', 'zh-CN', 'zh-TW'];
    const results: Record<string, string> = {};

    // Translate to each target language
    for (const lang of langs) {
      try {
        const res = await translate(text, { from: 'id', to: lang });
        results[lang] = res.text;
      } catch (err) {
        console.error(`Translation to ${lang} failed:`, err);
        results[lang] = text; // Fallback to original text
      }
    }

    return NextResponse.json({ translations: results });
  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json({ error: 'Translation failed' }, { status: 500 });
  }
}
