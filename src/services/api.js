// Thin fetch wrapper. Base URL comes from env; in dev it defaults to the Vite proxy.
const BASE = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? '/api' : 'https://staging.fastor.ai');

export async function request(path, { method = 'GET', form, token } = {}) {
  const headers = {};
  if (form) headers['Content-Type'] = 'application/x-www-form-urlencoded';
  if (token) headers.Authorization = `Bearer ${token}`;
  let res;
  try {
    res = await fetch(BASE + path, { method, headers, body: form ? new URLSearchParams(form) : undefined });
  } catch {
    throw new Error('Network error. Check your connection and try again.');
  }
  const body = await res.json().catch(() => null);
  const failed = !res.ok || (body && body.status && body.status !== 'Success');
  if (failed) {
    const msg = body && (typeof body.data === 'string' ? body.data : body.message || body.error);
    throw new Error(msg || `Request failed (${res.status})`);
  }
  return body;
}
