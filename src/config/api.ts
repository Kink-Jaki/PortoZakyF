function normalizeApiBase(url: string): string {
  // Remove trailing slashes to prevent `${apiBase}//path`
  return url.replace(/\/+$/, '');
}

export const apiBase = normalizeApiBase(
  import.meta.env.VITE_API_URL ?? 'https://zakyportoapi-production.up.railway.app'
);


