'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { MessageSquare, Send } from 'lucide-react';

type PublicComment = {
  id: string;
  name: string;
  content: string;
  createdAt: string;
};

type FieldErrors = Partial<Record<'name' | 'content', 'too_short' | 'too_long'>>;

type ApiListResponse = {
  comments: PublicComment[];
  nextCursor: string | null;
};

const NAME_MIN = 2;
const NAME_MAX = 80;
const CONTENT_MIN = 5;
const CONTENT_MAX = 1000;

export default function CommentsSection() {
  const t = useTranslations('comments');
  const locale = useLocale();

  const [comments, setComments] = useState<PublicComment[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [listError, setListError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [website, setWebsite] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState<'idle' | 'success' | 'error'>('idle');

  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(
        locale === 'id' ? 'id-ID' : locale === 'zh' ? 'zh-CN' : locale === 'zh-CN' ? 'zh-TW' : 'en-US',
        {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          timeZone: 'Asia/Makassar',
        }
      ),
    [locale]
  );

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setListError(false);

      try {
        const response = await fetch('/api/comments?limit=10', { cache: 'no-store' });
        if (!response.ok) throw new Error('Failed to load comments');

        const data = (await response.json()) as ApiListResponse;
        if (cancelled) return;

        setComments(data.comments);
        setNextCursor(data.nextCursor);
      } catch {
        if (!cancelled) setListError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  async function loadMore() {
    if (!nextCursor || loadingMore) return;

    setLoadingMore(true);
    try {
      const response = await fetch(
        `/api/comments?limit=10&cursor=${encodeURIComponent(nextCursor)}`,
        { cache: 'no-store' }
      );
      if (!response.ok) throw new Error('Failed to load more comments');

      const data = (await response.json()) as ApiListResponse;
      setComments((current) => {
        const seen = new Set(current.map((comment) => comment.id));
        return [...current, ...data.comments.filter((comment) => !seen.has(comment.id))];
      });
      setNextCursor(data.nextCursor);
    } catch {
      setListError(true);
    } finally {
      setLoadingMore(false);
    }
  }

  function errorMessage(error: 'too_short' | 'too_long', field: 'name' | 'content') {
    if (field === 'name') {
      return error === 'too_short' ? t('validation.nameTooShort') : t('validation.nameTooLong');
    }
    return error === 'too_short' ? t('validation.contentTooShort') : t('validation.contentTooLong');
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    const trimmedName = name.trim();
    const trimmedContent = content.trim();
    const errors: FieldErrors = {};

    if (trimmedName.length < NAME_MIN) errors.name = 'too_short';
    else if (trimmedName.length > NAME_MAX) errors.name = 'too_long';

    if (trimmedContent.length < CONTENT_MIN) errors.content = 'too_short';
    else if (trimmedContent.length > CONTENT_MAX) errors.content = 'too_long';

    setFieldErrors(errors);
    setSubmitState('idle');

    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: trimmedName,
          content: trimmedContent,
          website,
        }),
      });

      if (response.status === 400) {
        const data = (await response.json().catch(() => null)) as { fields?: FieldErrors } | null;
        if (data?.fields) {
          setFieldErrors(data.fields);
          return;
        }
      }

      if (!response.ok) throw new Error('Failed to submit comment');

      setName('');
      setContent('');
      setWebsite('');
      setFieldErrors({});
      setSubmitState('success');
    } catch {
      setSubmitState('error');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="komentar" className="relative z-10 bg-background px-6 pt-24 pb-16 md:px-10 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center md:mb-14">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-accent-secondary">
            {t('title')}
          </p>
          <h2 className="font-serif text-4xl text-foreground md:text-5xl">{t('title')}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-foreground/60">{t('subtitle')}</p>
          <div className="mx-auto mt-5 h-[2px] w-16 bg-accent-primary" />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-12">
          <div className="h-fit rounded-2xl border border-foreground/10 bg-white p-6 shadow-sm md:p-8">
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div>
                <label htmlFor="comment-name" className="mb-2 block text-sm font-semibold text-foreground">
                  {t('name')}
                </label>
                <input
                  id="comment-name"
                  name="name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder={t('namePlaceholder')}
                  maxLength={NAME_MAX}
                  autoComplete="name"
                  aria-invalid={Boolean(fieldErrors.name)}
                  aria-describedby={fieldErrors.name ? 'comment-name-error' : undefined}
                  className="w-full rounded-xl border border-foreground/15 bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-accent-primary"
                  disabled={submitting}
                />
                {fieldErrors.name && (
                  <p id="comment-name-error" className="mt-2 text-sm text-red-600">
                    {errorMessage(fieldErrors.name, 'name')}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="comment-content" className="mb-2 block text-sm font-semibold text-foreground">
                  {t('comment')}
                </label>
                <textarea
                  id="comment-content"
                  name="content"
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                  placeholder={t('commentPlaceholder')}
                  maxLength={CONTENT_MAX}
                  rows={5}
                  aria-invalid={Boolean(fieldErrors.content)}
                  aria-describedby={fieldErrors.content ? 'comment-content-error' : undefined}
                  className="w-full resize-y rounded-xl border border-foreground/15 bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-accent-primary"
                  disabled={submitting}
                />
                <div className="mt-2 flex items-start justify-between gap-4">
                  {fieldErrors.content ? (
                    <p id="comment-content-error" className="text-sm text-red-600">
                      {errorMessage(fieldErrors.content, 'content')}
                    </p>
                  ) : (
                    <span />
                  )}
                  <span className="shrink-0 text-xs text-foreground/40">
                    {content.trim().length}/{CONTENT_MAX}
                  </span>
                </div>
              </div>

              <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
                <label htmlFor="comment-website">Website</label>
                <input
                  id="comment-website"
                  name="website"
                  type="text"
                  value={website}
                  onChange={(event) => setWebsite(event.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-foreground px-6 py-3.5 text-sm font-bold uppercase tracking-widest text-background transition-colors hover:bg-foreground/85 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Send size={16} />
                {submitting ? t('submitting') : t('submit')}
              </button>

              <div aria-live="polite">
                {submitState === 'success' && (
                  <p className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
                    {t('success')}
                  </p>
                )}
                {submitState === 'error' && (
                  <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {t('submitError')}
                  </p>
                )}
              </div>
            </form>
          </div>

          <div className="min-w-0">
            {loading ? (
              <div className="space-y-4" aria-busy="true" aria-label={t('loading')}>
                {[0, 1, 2].map((item) => (
                  <div key={item} className="animate-pulse rounded-2xl border border-foreground/10 bg-white p-6">
                    <div className="mb-3 h-4 w-32 rounded bg-foreground/10" />
                    <div className="mb-2 h-3 w-full rounded bg-foreground/5" />
                    <div className="h-3 w-4/5 rounded bg-foreground/5" />
                  </div>
                ))}
              </div>
            ) : listError && comments.length === 0 ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
                <p className="mb-4 text-sm text-red-700">{t('loadError')}</p>
                <button
                  type="button"
                  onClick={() => setReloadKey((key) => key + 1)}
                  className="rounded-full border border-red-300 px-5 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
                >
                  {t('retry')}
                </button>
              </div>
            ) : comments.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-foreground/15 bg-white/60 p-10 text-center">
                <MessageSquare className="mx-auto mb-3 h-8 w-8 text-foreground/30" />
                <p className="text-sm text-foreground/50">{t('noComments')}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <article
                    key={comment.id}
                    className="rounded-2xl border border-foreground/10 bg-white p-6 shadow-sm"
                  >
                    <div className="mb-3 flex items-start justify-between gap-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-foreground/5 font-serif text-lg text-foreground/60">
                          {comment.name.trim().charAt(0).toUpperCase()}
                        </div>
                        <h3 className="truncate font-semibold text-foreground">{comment.name}</h3>
                      </div>
                      <time
                        dateTime={comment.createdAt}
                        className="shrink-0 text-xs text-foreground/40"
                      >
                        {dateFormatter.format(new Date(comment.createdAt))}
                      </time>
                    </div>
                    <p className="whitespace-pre-line break-words text-sm leading-relaxed text-foreground/70">
                      {comment.content}
                    </p>
                  </article>
                ))}

                {nextCursor && (
                  <button
                    type="button"
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="w-full rounded-xl border border-foreground/15 px-5 py-3 text-sm font-semibold text-foreground/70 transition-colors hover:border-foreground/30 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loadingMore ? t('loadingMore') : t('loadMore')}
                  </button>
                )}

                {listError && comments.length > 0 && (
                  <p className="text-center text-sm text-red-600">{t('loadError')}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
