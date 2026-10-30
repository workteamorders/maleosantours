import { CheckCircle, Clock, MessageSquare, XCircle } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import CommentActions from './CommentActions';

const dateFormatter = new Intl.DateTimeFormat('id-ID', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'Asia/Makassar',
});

export default async function CommentsAdminPage() {
  const comments = await prisma.visitorComment.findMany({
    where: { status: { in: ['pending', 'approved', 'rejected'] } },
    orderBy: { createdAt: 'desc' },
  });

  const statusWeight: Record<string, number> = {
    pending: 0,
    rejected: 1,
    approved: 2,
  };

  const sortedComments = [...comments].sort((a, b) => {
    const weightDifference = (statusWeight[a.status] ?? 3) - (statusWeight[b.status] ?? 3);
    if (weightDifference !== 0) return weightDifference;
    return b.createdAt.getTime() - a.createdAt.getTime();
  });

  const pendingCount = comments.filter((comment) => comment.status === 'pending').length;
  const approvedCount = comments.filter((comment) => comment.status === 'approved').length;
  const rejectedCount = comments.filter((comment) => comment.status === 'rejected').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">Komentar</h1>
        <p className="mt-1 text-sm text-gray-600 md:text-base">
          Kelola komentar pengunjung sebelum ditampilkan di beranda.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg bg-white p-5 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Menunggu Persetujuan</p>
              <p className="mt-1 text-3xl font-bold text-gray-900">{pendingCount}</p>
            </div>
            <div className="rounded-lg bg-orange-100 p-3 text-orange-600">
              <Clock className="h-6 w-6" />
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-white p-5 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Disetujui</p>
              <p className="mt-1 text-3xl font-bold text-gray-900">{approvedCount}</p>
            </div>
            <div className="rounded-lg bg-green-100 p-3 text-green-600">
              <CheckCircle className="h-6 w-6" />
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-white p-5 shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ditolak</p>
              <p className="mt-1 text-3xl font-bold text-gray-900">{rejectedCount}</p>
            </div>
            <div className="rounded-lg bg-red-100 p-3 text-red-600">
              <XCircle className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {sortedComments.length === 0 ? (
        <div className="rounded-lg bg-white p-12 text-center shadow">
          <MessageSquare className="mx-auto mb-3 h-9 w-9 text-gray-300" />
          <p className="text-lg text-gray-500">Belum ada komentar.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg bg-white shadow">
          <table className="min-w-[860px] w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Pengunjung
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Komentar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Tanggal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {sortedComments.map((comment) => {
                const approved = comment.status === 'approved';
                const rejected = comment.status === 'rejected';
                return (
                  <tr
                    key={comment.id}
                    className={
                      approved
                        ? 'hover:bg-gray-50'
                        : rejected
                          ? 'bg-red-50/30 hover:bg-red-50'
                          : 'bg-orange-50/30 hover:bg-orange-50'
                    }
                  >
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{comment.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="line-clamp-3 max-w-md whitespace-pre-line break-words text-sm text-gray-700">
                        {comment.content}
                      </p>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {dateFormatter.format(comment.createdAt)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          approved
                            ? 'bg-green-100 text-green-800'
                            : rejected
                              ? 'bg-red-100 text-red-800'
                              : 'bg-orange-100 text-orange-800'
                        }`}
                      >
                        {approved ? 'Disetujui' : rejected ? 'Ditolak' : 'Pending'}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <CommentActions id={comment.id} status={comment.status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
