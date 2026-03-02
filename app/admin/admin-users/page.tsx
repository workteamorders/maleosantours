import { prisma } from '@/lib/prisma';
import { getCurrentAdmin, isBossRole } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminUsersManager from './AdminUsersManager';

async function getAdminUsers() {
    const admins = await prisma.admin.findMany({
        orderBy: [{ role: 'asc' }, { createdAt: 'desc' }],
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            active: true,
            createdAt: true,
        },
    });

    return admins.map((admin) => ({
        ...admin,
        role: admin.role === 'boss' ? 'boss' : 'karyawan',
        createdAt: new Intl.DateTimeFormat('id-ID', {
            dateStyle: 'medium',
            timeStyle: 'short',
        }).format(admin.createdAt),
    }));
}

export default async function AdminUsersPage() {
    const currentAdmin = await getCurrentAdmin();

    if (!currentAdmin || !isBossRole(currentAdmin.role)) {
        redirect('/admin/forbidden');
    }

    const admins = await getAdminUsers();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Manajemen Admin</h1>
                <p className="text-gray-600 mt-1 text-sm md:text-base">
                    Kelola akun boss dan karyawan: tambah, ubah, aktif/nonaktif, dan hapus.
                </p>
            </div>

            <AdminUsersManager admins={admins} currentAdminId={currentAdmin.id} />
        </div>
    );
}
