import Link from 'next/link';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function AdminForbiddenPage() {
    return (
        <div className="max-w-2xl mx-auto py-16">
            <div className="bg-white rounded-xl shadow border border-red-100 p-8 text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-5">
                    <ShieldAlert className="w-8 h-8" />
                </div>

                <h1 className="text-2xl font-bold text-gray-900">Akses Ditolak</h1>
                <p className="text-gray-600 mt-3">
                    Halaman ini hanya dapat diakses oleh akun dengan role Boss.
                </p>

                <div className="mt-8 flex justify-center">
                    <Link
                        href="/admin"
                        className="inline-flex items-center px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Kembali ke Dasbor
                    </Link>
                </div>
            </div>
        </div>
    );
}
