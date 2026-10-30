'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, Trash2, XCircle } from 'lucide-react';
import { approveComment, deleteComment, rejectComment, unapproveComment } from './actions';

interface CommentActionsProps {
  id: string;
  status: string;
}

export default function CommentActions({ id, status }: CommentActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const approved = status === 'approved';
  const rejected = status === 'rejected';

  function run(action: () => Promise<void>) {
    setError(null);
    startTransition(async () => {
      try {
        await action();
        router.refresh();
      } catch {
        setError('Aksi gagal. Silakan coba lagi.');
      }
    });
  }

  function handleDelete() {
    if (!window.confirm('Hapus komentar ini secara permanen?')) return;
    run(() => deleteComment(id));
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex items-center justify-end gap-2">
        {approved ? (
          <button
            type="button"
            onClick={() => run(() => unapproveComment(id))}
            disabled={isPending}
            className="inline-flex items-center rounded-full bg-orange-100 px-3 py-1.5 text-xs font-medium text-orange-800 transition-colors hover:bg-orange-200 disabled:opacity-50"
            title="Batalkan persetujuan"
          >
            <XCircle className="mr-1 h-3 w-3" />
            Batalkan
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={() => run(() => approveComment(id))}
              disabled={isPending}
              className="inline-flex items-center rounded-full bg-green-100 px-3 py-1.5 text-xs font-medium text-green-800 transition-colors hover:bg-green-200 disabled:opacity-50"
              title="Setujui komentar"
            >
              <CheckCircle className="mr-1 h-3 w-3" />
              Setujui
            </button>
            {!rejected && (
              <button
                type="button"
                onClick={() => run(() => rejectComment(id))}
                disabled={isPending}
                className="inline-flex items-center rounded-full bg-red-100 px-3 py-1.5 text-xs font-medium text-red-800 transition-colors hover:bg-red-200 disabled:opacity-50"
                title="Tolak komentar"
              >
                <XCircle className="mr-1 h-3 w-3" />
                Tolak
              </button>
            )}
          </>
        )}

        <button
          type="button"
          onClick={handleDelete}
          disabled={isPending}
          className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
          title="Hapus komentar"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}
