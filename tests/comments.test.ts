import { after, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { prisma } from '../lib/prisma';
import {
  COMMENT_NAME_MAX,
  COMMENT_CONTENT_MAX,
  isHoneypotFilled,
  validateCommentInput,
} from '../lib/comments';
import { GET, POST } from '../app/api/comments/route';
import { deleteComment } from '../app/admin/comments/actions';

const runId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const testNamePrefix = `TEST-${runId}`;

function testName(label: string) {
  return `${testNamePrefix}-${label}`;
}

function requestPost(body: Record<string, unknown>, ip: string) {
  return POST(
    new Request('http://localhost/api/comments', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-forwarded-for': ip,
      },
      body: JSON.stringify(body),
    })
  );
}

function requestList() {
  return GET(new Request('http://localhost/api/comments?limit=50'));
}

async function listComments() {
  const response = await requestList();
  assert.equal(response.status, 200);
  return (await response.json()) as {
    comments: Array<{ id: string; name: string; content: string; createdAt: string }>;
    nextCursor: string | null;
  };
}

after(async () => {
  await prisma.visitorComment.deleteMany({
    where: { name: { startsWith: testNamePrefix } },
  });
  await prisma.$disconnect();
});

describe('comment validation', () => {
  test('trims and accepts boundary lengths', () => {
    const result = validateCommentInput({
      name: `  ${'a'.repeat(2)}  `,
      content: `  ${'b'.repeat(5)}  `,
    });
    assert.equal(result.ok, true);
    if (result.ok) {
      assert.equal(result.name, 'aa');
      assert.equal(result.content, 'bbbbb');
    }

    const maxResult = validateCommentInput({
      name: 'a'.repeat(COMMENT_NAME_MAX),
      content: 'b'.repeat(COMMENT_CONTENT_MAX),
    });
    assert.equal(maxResult.ok, true);
  });

  test('rejects values below minimum and above maximum', () => {
    const short = validateCommentInput({ name: ' a ', content: '  1234 ' });
    assert.equal(short.ok, false);
    if (!short.ok) {
      assert.equal(short.fields.name, 'too_short');
      assert.equal(short.fields.content, 'too_short');
    }

    const long = validateCommentInput({
      name: 'a'.repeat(COMMENT_NAME_MAX + 1),
      content: 'b'.repeat(COMMENT_CONTENT_MAX + 1),
    });
    assert.equal(long.ok, false);
    if (!long.ok) {
      assert.equal(long.fields.name, 'too_long');
      assert.equal(long.fields.content, 'too_long');
    }
  });

  test('detects filled honeypot only', () => {
    assert.equal(isHoneypotFilled(''), false);
    assert.equal(isHoneypotFilled('   '), false);
    assert.equal(isHoneypotFilled('bot'), true);
    assert.equal(isHoneypotFilled(undefined), false);
  });
});

describe('public comment submission', () => {
  test('stores a new comment as pending and ignores client status', async () => {
    const name = testName('pending-submit');
    const content = 'Komentar pengujian yang valid.';

    const response = await requestPost(
      { name, content, status: 'approved' },
      '198.51.100.11'
    );
    assert.equal(response.status, 201);

    const stored = await prisma.visitorComment.findFirst({
      where: { name, content },
    });
    assert.ok(stored);
    assert.equal(stored?.status, 'pending');
  });

  test('rejects invalid server-side input', async () => {
    const name = testName('invalid');
    const response = await requestPost(
      { name: 'A', content: '1234' },
      '198.51.100.12'
    );
    assert.equal(response.status, 400);

    const body = (await response.json()) as {
      fields?: { name?: string; content?: string };
    };
    assert.equal(body.fields?.name, 'too_short');
    assert.equal(body.fields?.content, 'too_short');
    assert.equal(await prisma.visitorComment.count({ where: { name } }), 0);
  });

  test('rejects honeypot submissions', async () => {
    const name = testName('honeypot');
    const response = await requestPost(
      {
        name,
        content: 'Komentar dari bot yang mengisi honeypot.',
        website: 'https://spam.example',
      },
      '198.51.100.13'
    );
    assert.equal(response.status, 400);
    assert.equal(await prisma.visitorComment.count({ where: { name } }), 0);
  });

  test('rate limits repeated submissions from the same IP', async () => {
    const ip = '198.51.100.14';

    for (let index = 0; index < 3; index += 1) {
      const response = await requestPost(
        {
          name: testName(`rate-${index}`),
          content: `Komentar rate limit nomor ${index + 1}.`,
        },
        ip
      );
      assert.equal(response.status, 201);
    }

    const blocked = await requestPost(
      {
        name: testName('rate-blocked'),
        content: 'Komentar keempat harus ditolak.',
      },
      ip
    );
    assert.equal(blocked.status, 429);
  });
});

describe('public visibility and moderation transitions', () => {
  test('only approved comments are public and status changes are reflected', async () => {
    const approvedName = testName('approved-visible');
    const pendingName = testName('pending-hidden');
    const rejectedName = testName('rejected-hidden');

    const approved = await prisma.visitorComment.create({
      data: {
        name: approvedName,
        content: 'Komentar ini sudah disetujui.',
        status: 'approved',
      },
    });

    const pending = await prisma.visitorComment.create({
      data: {
        name: pendingName,
        content: 'Komentar ini masih menunggu persetujuan.',
        status: 'pending',
      },
    });

    const rejected = await prisma.visitorComment.create({
      data: {
        name: rejectedName,
        content: 'Komentar ini ditolak oleh admin.',
        status: 'rejected',
      },
    });

    let listed = await listComments();
    assert.ok(listed.comments.some((comment) => comment.id === approved.id));
    assert.ok(!listed.comments.some((comment) => comment.id === pending.id));
    assert.ok(!listed.comments.some((comment) => comment.id === rejected.id));

    await prisma.visitorComment.update({
      where: { id: approved.id },
      data: { status: 'pending' },
    });

    listed = await listComments();
    assert.ok(!listed.comments.some((comment) => comment.id === approved.id));

    await prisma.visitorComment.update({
      where: { id: approved.id },
      data: { status: 'approved' },
    });

    listed = await listComments();
    assert.ok(listed.comments.some((comment) => comment.id === approved.id));

    await prisma.visitorComment.delete({ where: { id: approved.id } });

    listed = await listComments();
    assert.ok(!listed.comments.some((comment) => comment.id === approved.id));
  });
});

describe('public comment pagination', () => {
  test('returns at most ten comments and supports loading more with a cursor', async () => {
    const now = Date.now();
    await prisma.visitorComment.createMany({
      data: Array.from({ length: 12 }, (_, index) => ({
        name: testName(`page-${index}`),
        content: `Komentar pagination nomor ${index + 1}.`,
        status: 'approved',
        createdAt: new Date(now + index * 1000),
      })),
    });

    const firstResponse = await GET(
      new Request('http://localhost/api/comments?limit=10')
    );
    assert.equal(firstResponse.status, 200);
    const firstPage = (await firstResponse.json()) as {
      comments: Array<{ id: string }>;
      nextCursor: string | null;
    };

    assert.equal(firstPage.comments.length, 10);
    assert.ok(firstPage.nextCursor);

    const secondResponse = await GET(
      new Request(
        `http://localhost/api/comments?limit=10&cursor=${encodeURIComponent(
          firstPage.nextCursor || ''
        )}`
      )
    );
    assert.equal(secondResponse.status, 200);
    const secondPage = (await secondResponse.json()) as {
      comments: Array<{ id: string }>;
      nextCursor: string | null;
    };

    assert.ok(secondPage.comments.length > 0);
    const firstIds = new Set(firstPage.comments.map((comment) => comment.id));
    assert.ok(secondPage.comments.every((comment) => !firstIds.has(comment.id)));
  });
});

describe('admin moderation authorization', () => {
  test('rejects moderation without an admin session', async () => {
    await assert.rejects(
      () => deleteComment('__missing_comment_for_auth_test__'),
      /Unauthorized/
    );
  });
});
