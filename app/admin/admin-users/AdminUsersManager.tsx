'use client';

import { useState } from 'react';
import {
    createAdminUser,
    deleteAdminUser,
    toggleAdminUserActive,
    updateAdminUser,
} from './actions';
import { Edit, Power, Save, Trash2, UserPlus, X } from 'lucide-react';

type AdminRow = {
    id: string;
    name: string;
    email: string;
    role: string;
    active: boolean;
    createdAt: string;
};

interface AdminUsersManagerProps {
    admins: AdminRow[];
    currentAdminId: string;
}

function roleBadge(role: string) {
    if (role === 'boss') {
        return 'bg-purple-100 text-purple-700';
    }
    return 'bg-blue-100 text-blue-700';
}

function roleLabel(role: string) {
    return role === 'boss' ? 'Boss' : 'Karyawan';
}

export default function AdminUsersManager({ admins, currentAdminId }: AdminUsersManagerProps) {
    const [loadingKey, setLoadingKey] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');
    const [editEmail, setEditEmail] = useState('');
    const [editRole, setEditRole] = useState<'boss' | 'karyawan'>('karyawan');
    const [editPassword, setEditPassword] = useState('');

    async function handleCreate(formData: FormData) {
        setLoadingKey('create');
        setMessage('');
        setError('');
        const result = await createAdminUser(formData);
        if (result.success) {
            setMessage('Akun admin berhasil dibuat');
            const form = document.getElementById('create-admin-form') as HTMLFormElement | null;
            form?.reset();
        } else {
            setError(result.error || 'Gagal membuat akun admin');
        }
        setLoadingKey('');
    }

    async function handleToggle(id: string, nextActive: boolean) {
        setLoadingKey(`toggle-${id}`);
        setMessage('');
        setError('');
        const result = await toggleAdminUserActive(id, nextActive);
        if (result.success) {
            setMessage('Status akun berhasil diperbarui');
        } else {
            setError(result.error || 'Gagal mengubah status akun');
        }
        setLoadingKey('');
    }

    async function handleDelete(id: string, name: string) {
        if (!confirm(`Hapus akun ${name}?`)) return;

        setLoadingKey(`delete-${id}`);
        setMessage('');
        setError('');
        const result = await deleteAdminUser(id);
        if (result.success) {
            setMessage('Akun admin berhasil dihapus');
        } else {
            setError(result.error || 'Gagal menghapus akun');
        }
        setLoadingKey('');
    }

    function startEdit(admin: AdminRow) {
        setEditingId(admin.id);
        setEditName(admin.name);
        setEditEmail(admin.email);
        setEditRole(admin.role === 'boss' ? 'boss' : 'karyawan');
        setEditPassword('');
        setMessage('');
        setError('');
    }

    async function submitEdit() {
        if (!editingId) return;

        setLoadingKey(`edit-${editingId}`);
        setMessage('');
        setError('');

        const fd = new FormData();
        fd.set('id', editingId);
        fd.set('name', editName);
        fd.set('email', editEmail);
        fd.set('role', editRole);
        fd.set('password', editPassword);

        const result = await updateAdminUser(fd);
        if (result.success) {
            setMessage('Akun admin berhasil diperbarui');
            setEditingId(null);
            setEditPassword('');
        } else {
            setError(result.error || 'Gagal memperbarui akun');
        }

        setLoadingKey('');
    }

    return (
        <div className="space-y-6">
            {(message || error) && (
                <div className={`rounded-lg px-4 py-3 text-sm ${error ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
                    {error || message}
                </div>
            )}

            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <UserPlus className="w-5 h-5 mr-2 text-blue-600" />
                    Tambah Admin/Karyawan
                </h2>

                <form id="create-admin-form" action={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
                        <input
                            type="text"
                            name="name"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Nama admin"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="email@domain.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            required
                            minLength={6}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Minimal 6 karakter"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                        <select
                            name="role"
                            defaultValue="karyawan"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="karyawan">Karyawan</option>
                            <option value="boss">Boss</option>
                        </select>
                    </div>

                    <div className="md:col-span-2 flex justify-end">
                        <button
                            type="submit"
                            disabled={loadingKey === 'create'}
                            className="inline-flex items-center px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60"
                        >
                            <UserPlus className="w-4 h-4 mr-2" />
                            {loadingKey === 'create' ? 'Menyimpan...' : 'Tambah Akun'}
                        </button>
                    </div>
                </form>
            </div>

            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="w-full min-w-190 divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dibuat</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {admins.map((admin) => (
                            <tr key={admin.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                    {admin.name}
                                    {admin.id === currentAdminId && (
                                        <span className="ml-2 text-xs text-blue-600 font-semibold">(Anda)</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-700">{admin.email}</td>
                                <td className="px-6 py-4 text-sm">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleBadge(admin.role)}`}>
                                        {roleLabel(admin.role)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    <span
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${admin.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                            }`}
                                    >
                                        {admin.active ? 'Aktif' : 'Nonaktif'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">{admin.createdAt}</td>
                                <td className="px-6 py-4 text-sm text-right">
                                    <div className="inline-flex items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={() => startEdit(admin)}
                                            disabled={loadingKey !== ''}
                                            className="inline-flex items-center text-blue-600 hover:text-blue-800 disabled:opacity-50"
                                        >
                                            <Edit className="w-4 h-4 mr-1" />
                                            Ubah
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleToggle(admin.id, !admin.active)}
                                            disabled={loadingKey === `toggle-${admin.id}`}
                                            className="inline-flex items-center text-gray-700 hover:text-gray-900 disabled:opacity-50"
                                        >
                                            <Power className="w-4 h-4 mr-1" />
                                            {loadingKey === `toggle-${admin.id}` ? 'Proses...' : admin.active ? 'Nonaktifkan' : 'Aktifkan'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(admin.id, admin.name)}
                                            disabled={loadingKey === `delete-${admin.id}`}
                                            className="inline-flex items-center text-red-600 hover:text-red-800 disabled:opacity-50"
                                        >
                                            <Trash2 className="w-4 h-4 mr-1" />
                                            {loadingKey === `delete-${admin.id}` ? 'Menghapus...' : 'Hapus'}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {editingId && (
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Ubah Akun Admin</h3>
                        <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
                            <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                value={editEmail}
                                onChange={(e) => setEditEmail(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                            <select
                                value={editRole}
                                onChange={(e) => setEditRole((e.target.value === 'boss' ? 'boss' : 'karyawan'))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="karyawan">Karyawan</option>
                                <option value="boss">Boss</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password Baru (Opsional)</label>
                            <input
                                type="password"
                                value={editPassword}
                                onChange={(e) => setEditPassword(e.target.value)}
                                minLength={6}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Kosongkan jika tidak diubah"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end mt-5 gap-3">
                        <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                        >
                            Batal
                        </button>
                        <button
                            type="button"
                            onClick={submitEdit}
                            disabled={loadingKey === `edit-${editingId}`}
                            className="inline-flex items-center px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            {loadingKey === `edit-${editingId}` ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
