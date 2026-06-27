// Better Auth manages the `user` collection directly via its MongoDB adapter.
// This file provides the TypeScript interface for type-safe usage across the app.

export interface BetterAuthUser {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
