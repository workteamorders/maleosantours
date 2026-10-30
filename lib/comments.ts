import { createHash } from 'crypto';

export const COMMENT_NAME_MIN = 2;
export const COMMENT_NAME_MAX = 80;
export const COMMENT_CONTENT_MIN = 5;
export const COMMENT_CONTENT_MAX = 1000;

export const COMMENT_RATE_LIMIT = 3;
export const COMMENT_RATE_WINDOW_MS = 10 * 60 * 1000;
export const COMMENT_DUPLICATE_WINDOW_MS = 60 * 1000;

export type CommentFieldError = 'too_short' | 'too_long';

export type CommentValidationResult =
  | { ok: true; name: string; content: string }
  | { ok: false; fields: Partial<Record<'name' | 'content', CommentFieldError>> };

function validateField(
  value: unknown,
  min: number,
  max: number
): { value: string; error?: CommentFieldError } {
  const trimmed = typeof value === 'string' ? value.trim() : '';
  if (trimmed.length < min) return { value: trimmed, error: 'too_short' };
  if (trimmed.length > max) return { value: trimmed, error: 'too_long' };
  return { value: trimmed };
}

export function validateCommentInput(input: {
  name?: unknown;
  content?: unknown;
}): CommentValidationResult {
  const name = validateField(input.name, COMMENT_NAME_MIN, COMMENT_NAME_MAX);
  const content = validateField(input.content, COMMENT_CONTENT_MIN, COMMENT_CONTENT_MAX);

  if (name.error || content.error) {
    return {
      ok: false,
      fields: {
        ...(name.error ? { name: name.error } : {}),
        ...(content.error ? { content: content.error } : {}),
      },
    };
  }

  return { ok: true, name: name.value, content: content.value };
}

export function isHoneypotFilled(value: unknown): boolean {
  return typeof value === 'string' && value.trim().length > 0;
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return request.headers.get('x-real-ip')?.trim() || 'unknown';
}

export function hashClientIp(ip: string): string {
  const salt = process.env.AUTH_SECRET || 'maleosan-comments';
  return createHash('sha256').update(`${ip}:${salt}`).digest('hex');
}
