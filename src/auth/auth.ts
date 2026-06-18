export type LoginResponse = { token: string };

const TOKEN_KEY = 'porto_token';

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const login = async (params: {
  username: string;
  password: string;
}): Promise<string> => {
  const apiBase = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

  const res = await fetch(`${apiBase}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: params.username,
      password: params.password,
    }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    const message = data?.message ?? `Login gagal (${res.status})`;
    throw new Error(message);
  }

  const data = (await res.json()) as LoginResponse;
  if (!data.token) throw new Error('Token tidak ditemukan dari server');

  localStorage.setItem(TOKEN_KEY, data.token);
  return data.token;
};

export const authHeaders = () => {
  const token = getToken();
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

