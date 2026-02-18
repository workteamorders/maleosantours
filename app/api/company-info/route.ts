import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const info = await prisma.companyInfo.findFirst();
    if (!info) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(info);
  } catch (error) {
    console.error('Error fetching company info:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
