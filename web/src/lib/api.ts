import axios from "axios";

// Axios instance — cookies sent automatically (Better Auth session)
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export default api;

// ── Types ────────────────────────────────────────────────────────────────────

export interface UserProfile {
  userId: string;
  warriorName: string;
  stage: 1 | 2 | 3 | 4 | 5;
  totalDefeated: number;
  joinedAt: string;
}

export interface ProfileResponse {
  user: {
    id: string;
    email: string;
    name: string;
  };
  profile: UserProfile | null;
}

// ── Profile API helpers ───────────────────────────────────────────────────────

export const profileApi = {
  getMe: (): Promise<ProfileResponse> =>
    api.get<ProfileResponse>("/api/profile/me").then((r) => r.data),

  setWarriorName: (warriorName: string): Promise<{ profile: UserProfile }> =>
    api
      .patch<{ profile: UserProfile }>("/api/profile/me", { warriorName })
      .then((r) => r.data),
};
