'use server';

import { prisma } from '@/lib/prisma';
import { hashPassword, requireBoss } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

type AdminRoleInput = 'boss' | 'karyawan';

function parseRole(raw: FormDataEntryValue | null): AdminRoleInput {
    return raw === 'boss' ? 'boss' : 'karyawan';
}

function normalizeEmail(raw: FormDataEntryValue | null): string {
    return String(raw || '')
        .trim()
        .toLowerCase();
}

async function ensureNotLastBoss(targetAdminId: string, nextRole?: AdminRoleInput, nextActive?: boolean) {
    const target = await prisma.admin.findUnique({ where: { id: targetAdminId } });
    if (!target) {
        throw new Error('Akun admin tidak ditemukan');
    }

    const isTargetBoss = target.role === 'boss';
    const willRemainBoss = nextRole ? nextRole === 'boss' : isTargetBoss;
    const willRemainActive = nextActive ?? target.active;

    if (isTargetBoss && (!willRemainBoss || !willRemainActive)) {
        const activeBossCount = await prisma.admin.count({
            where: { role: 'boss', active: true },
        });

        if (activeBossCount <= 1) {
            throw new Error('Tidak bisa menonaktifkan/mengubah boss terakhir yang aktif');
        }
    }
}

export async function createAdminUser(formData: FormData) {
    await requireBoss();

    const name = String(formData.get('name') || '').trim();
    const email = normalizeEmail(formData.get('email'));
    const password = String(formData.get('password') || '');
    const role = parseRole(formData.get('role'));

    if (!name || !email || !password) {
        return { success: false, error: 'Nama, email, dan password wajib diisi' };
    }

    if (password.length < 6) {
        return { success: false, error: 'Password minimal 6 karakter' };
    }

    const existing = await prisma.admin.findUnique({ where: { email } });
    if (existing) {
        return { success: false, error: 'Email sudah dipakai' };
    }

    const hashedPassword = await hashPassword(password);

    await prisma.admin.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role,
            active: true,
        },
    });

    revalidatePath('/admin/admin-users');
    return { success: true };
}

export async function updateAdminUser(formData: FormData) {
    const currentBoss = await requireBoss();

    const id = String(formData.get('id') || '');
    const name = String(formData.get('name') || '').trim();
    const email = normalizeEmail(formData.get('email'));
    const password = String(formData.get('password') || '');
    const role = parseRole(formData.get('role'));

    if (!id || !name || !email) {
        return { success: false, error: 'Data akun tidak lengkap' };
    }

    const existing = await prisma.admin.findUnique({ where: { id } });
    if (!existing) {
        return { success: false, error: 'Akun admin tidak ditemukan' };
    }

    if (currentBoss.id === id && role !== 'boss') {
        return { success: false, error: 'Boss tidak bisa menurunkan role diri sendiri' };
    }

    if (existing.role === 'boss') {
        await ensureNotLastBoss(id, role, undefined);
    }

    const emailOwner = await prisma.admin.findFirst({
        where: {
            email,
            NOT: { id },
        },
    });

    if (emailOwner) {
        return { success: false, error: 'Email sudah dipakai akun lain' };
    }

    const data: {
        name: string;
        email: string;
        role: AdminRoleInput;
        password?: string;
    } = {
        name,
        email,
        role,
    };

    if (password.trim()) {
        if (password.length < 6) {
            return { success: false, error: 'Password baru minimal 6 karakter' };
        }
        data.password = await hashPassword(password);
    }

    await prisma.admin.update({
        where: { id },
        data,
    });

    revalidatePath('/admin/admin-users');
    return { success: true };
}

export async function toggleAdminUserActive(id: string, nextActive: boolean) {
    const currentBoss = await requireBoss();

    const target = await prisma.admin.findUnique({ where: { id } });
    if (!target) {
        return { success: false, error: 'Akun admin tidak ditemukan' };
    }

    if (currentBoss.id === id && !nextActive) {
        return { success: false, error: 'Anda tidak bisa menonaktifkan akun sendiri' };
    }

    if (target.role === 'boss') {
        await ensureNotLastBoss(id, undefined, nextActive);
    }

    await prisma.admin.update({
        where: { id },
        data: { active: nextActive },
    });

    if (!nextActive) {
        await prisma.session.deleteMany({ where: { adminId: id } });
    }

    revalidatePath('/admin/admin-users');
    return { success: true };
}

export async function deleteAdminUser(id: string) {
    const currentBoss = await requireBoss();

    const target = await prisma.admin.findUnique({ where: { id } });
    if (!target) {
        return { success: false, error: 'Akun admin tidak ditemukan' };
    }

    if (currentBoss.id === id) {
        return { success: false, error: 'Anda tidak bisa menghapus akun sendiri' };
    }

    if (target.role === 'boss') {
        await ensureNotLastBoss(id, 'karyawan', false);
    }

    await prisma.session.deleteMany({ where: { adminId: id } });
    await prisma.admin.delete({ where: { id } });

    revalidatePath('/admin/admin-users');
    return { success: true };
}
