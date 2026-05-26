const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

const FALLBACK_ORIGINS = ['http://localhost:5000', 'http://127.0.0.1:5000'];

function buildUrls(path) {
  if (API_BASE) {
    return [`${API_BASE}${path}`];
  }
  return [path, ...FALLBACK_ORIGINS.map((origin) => `${origin}${path}`)];
}

async function apiFetch(path, options = {}) {
  const urls = [...new Set(buildUrls(path))];
  let lastError;

  for (const url of urls) {
    try {
      const res = await fetch(url, {
        ...options,
        headers: {
          Accept: 'application/json',
          ...options.headers,
        },
      });
      return res;
    } catch (err) {
      lastError = err;
    }
  }

  throw new Error(
    lastError?.message === 'Failed to fetch'
      ? 'Cannot reach the API. Run npm run dev from the project root (both server and client).'
      : lastError?.message || 'Network error'
  );
}

async function parseJsonResponse(res) {
  try {
    return await res.json();
  } catch {
    return {};
  }
}

export async function fetchPortfolio() {
  const res = await apiFetch('/api/portfolio');

  if (!res.ok) {
    const body = await parseJsonResponse(res);
    throw new Error(body.message || `Server returned ${res.status}`);
  }

  return res.json();
}

export async function sendContact(form) {
  const res = await apiFetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form),
  });

  const data = await parseJsonResponse(res);

  if (!res.ok) {
    const msg = data.errors?.[0]?.msg || data.message || 'Failed to send message';
    throw new Error(msg);
  }

  return data;
}
