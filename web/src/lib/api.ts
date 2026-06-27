// Thin API client for the Vorryn backend

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export interface VorrynUser {
  _id: string;
  username: string;
  email: string;
  characterName: string;
  faction: "ashen" | "iron" | "eclipse" | null;
  characterStage: 1 | 2 | 3 | 4 | 5;
  hasSeenIntro: boolean;
}

export interface AuthResponse {
  token: string;
  user: VorrynUser;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Request failed");
  return data as T;
}

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem("vorryn_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const api = {
  login: (username: string, password: string) =>
    request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),

  register: (body: {
    username: string;
    email: string;
    password: string;
    characterName?: string;
    faction?: string;
  }) =>
    request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  me: () =>
    request<{ user: VorrynUser }>("/auth/me", {
      headers: authHeaders(),
    }),

  markIntroSeen: () =>
    request<{ user: VorrynUser }>("/auth/seen-intro", {
      method: "PATCH",
      headers: authHeaders(),
    }),
};

// Token helpers
export function saveToken(token: string) {
  localStorage.setItem("vorryn_token", token);
}

export function clearToken() {
  localStorage.removeItem("vorryn_token");
}

export function getToken() {
  return typeof window !== "undefined"
    ? localStorage.getItem("vorryn_token")
    : null;
}
