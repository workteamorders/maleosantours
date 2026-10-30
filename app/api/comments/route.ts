import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  COMMENT_DUPLICATE_WINDOW_MS,
  COMMENT_RATE_LIMIT,
  COMMENT_RATE_WINDOW_MS,
  getClientIp,
  hashClientIp,
  isHoneypotFilled,
  validateCommentInput,
} from '@/lib/comments';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

function parseLimit(value: string | null): number {
  const parsed = Number.parseInt(value || '', 10);
  if (!Number.isFinite(parsed) || parsed < 1) return DEFAULT_LIMIT;
  return Math.min(parsed, MAX_LIMIT);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseLimit(searchParams.get('limit'));
    const cursor = searchParams.get('cursor');

    const comments = await prisma.visitorComment.findMany({
      where: { status: 'approved' },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      select: {
        id: true,
        name: true,
        content: true,
        createdAt: true,
      },
    });

    const hasMore = comments.length > limit;
    const items = hasMore ? comments.slice(0, limit) : comments;

    return NextResponse.json(
      {
        comments: items,
        nextCursor: hasMore ? items[items.length - 1]?.id || null : null,
      },
      {
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ error: 'Failed to load comments' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);

    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const payload = body as Record<string, unknown>;

    // Honeypot: real visitors never fill this hidden field.
    if (isHoneypotFilled(payload.website)) {
      return NextResponse.json({ error: 'Invalid submission' }, { status: 400 });
    }

    const validation = validateCommentInput({
      name: payload.name,
      content: payload.content,
    });

    if (!validation.ok) {
      return NextResponse.json(
        { error: 'validation_failed', fields: validation.fields },
        { status: 400 }
      );
    }

    const ipHash = hashClientIp(getClientIp(request));
    const now = Date.now();

    const recentCount = await prisma.visitorComment.count({
      where: {
        ipHash,
        createdAt: { gte: new Date(now - COMMENT_RATE_WINDOW_MS) },
      },
    });

    if (recentCount >= COMMENT_RATE_LIMIT) {
      return NextResponse.json(
        { error: 'rate_limited' },
        { status: 429, headers: { 'Retry-After': String(COMMENT_RATE_WINDOW_MS / 1000) } }
      );
    }

    // Treat an immediate identical resubmission as the same request.
    const duplicate = await prisma.visitorComment.findFirst({
      where: {
        ipHash,
        name: validation.name,
        content: validation.content,
        createdAt: { gte: new Date(now - COMMENT_DUPLICATE_WINDOW_MS) },
      },
      select: { id: true },
    });

    if (!duplicate) {
      await prisma.visitorComment.create({
        data: {
          name: validation.name,
          content: validation.content,
          status: 'pending',
          ipHash,
        },
      });
    }

    return NextResponse.json({ message: 'created' }, { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json({ error: 'Failed to submit comment' }, { status: 500 });
  }
}
