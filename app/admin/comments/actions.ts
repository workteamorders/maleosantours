'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireAdminSession } from '@/lib/auth';

function revalidateComments() {
  revalidatePath('/admin/comments');
  revalidatePath('/');
}

function assertId(id: string) {
  if (typeof id !== 'string' || id.trim().length === 0) {
    throw new Error('Invalid comment id');
  }
}

export async function approveComment(id: string) {
  await requireAdminSession();
  assertId(id);

  await prisma.visitorComment.update({
    where: { id },
    data: { status: 'approved' },
  });

  revalidateComments();
}

export async function unapproveComment(id: string) {
  await requireAdminSession();
  assertId(id);

  await prisma.visitorComment.update({
    where: { id },
    data: { status: 'pending' },
  });

  revalidateComments();
}

export async function rejectComment(id: string) {
  await requireAdminSession();
  assertId(id);

  await prisma.visitorComment.update({
    where: { id },
    data: { status: 'rejected' },
  });

  revalidateComments();
}

export async function deleteComment(id: string) {
  await requireAdminSession();
  assertId(id);

  await prisma.visitorComment.delete({
    where: { id },
  });

  revalidateComments();
}
