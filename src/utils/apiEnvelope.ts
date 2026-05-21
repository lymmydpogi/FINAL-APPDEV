/** Standard WEBAPP JSON envelope */
export type ApiEnvelope<T = unknown> = {
  success: boolean;
  message: string;
  data: T | null;
  errors: string[] | Record<string, string>;
};

export function parseEnvelope<T = unknown>(raw: unknown): ApiEnvelope<T> {
  if (raw && typeof raw === 'object' && 'success' in raw) {
    const r = raw as ApiEnvelope<T>;
    return {
      success: !!r.success,
      message: String(r.message ?? ''),
      data: (r.data ?? null) as T | null,
      errors: r.errors ?? [],
    };
  }
  return { success: true, message: '', data: raw as T, errors: [] };
}

export function errorsToMap(errors: string[] | Record<string, string>): Record<string, string> {
  if (Array.isArray(errors)) {
    return { _form: errors[0] ?? 'Request failed' };
  }
  return errors;
}

export function throwIfApiError<T>(raw: unknown): T {
  const env = parseEnvelope<T>(raw);
  if (!env.success) {
    const map = errorsToMap(env.errors);
    const first = Object.values(map)[0] ?? env.message ?? 'Request failed';
    throw new Error(first);
  }
  return env.data as T;
}
