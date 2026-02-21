import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const section = searchParams.get('section');

  const where: any = {};
  // If called from public, only show active items
  const activeOnly = searchParams.get('activeOnly');
  if (activeOnly !== 'false') {
    where.active = true;
  }
  if (section) where.section = section;

  const items = await prisma.homepageItem.findMany({
    where,
    orderBy: { order: 'asc' },
  });

  return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const item = await prisma.homepageItem.create({
      data: {
        section: body.section,
        title: body.title || null,
        subtitle: body.subtitle || null,
        desc: body.desc || null,
        image: body.image,
        link: body.link || null,
        rotation: body.rotation ?? 0,
        order: body.order || 0,
        active: body.active ?? true,
      },
    });

    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create item' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    const body = await request.json();

    const item = await prisma.homepageItem.update({
      where: { id },
      data: {
        section: body.section,
        title: body.title || null,
        subtitle: body.subtitle || null,
        desc: body.desc || null,
        image: body.image,
        link: body.link || null,
        rotation: body.rotation ?? 0,
        order: body.order ?? 0,
        active: body.active ?? true,
      },
    });

    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    await prisma.homepageItem.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
  }
}

