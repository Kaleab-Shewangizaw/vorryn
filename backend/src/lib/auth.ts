import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { Db } from "mongodb";
import { UserProfile } from "../models/UserProfile";

export function createAuth(db: Db) {
  return betterAuth({
    database: mongodbAdapter(db, {
      // Standalone MongoDB (no replica set) does not support transactions
      transaction: false,
    }),

    secret: process.env.BETTER_AUTH_SECRET || "vorryn_ember_forge_dev_secret",
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:4000",
    basePath: "/api/auth",

    trustedOrigins: [process.env.FRONTEND_URL || "http://localhost:3000"],

    emailAndPassword: {
      enabled: true,
      minPasswordLength: 8,
    },

    socialProviders: process.env.GOOGLE_CLIENT_ID
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          },
        }
      : {},

    databaseHooks: {
      user: {
        create: {
          after: async (user) => {
            await UserProfile.create({
              userId: user.id,
              warriorName: "",
              stage: 1,
              totalDefeated: 0,
              joinedAt: new Date(),
            });
          },
        },
      },
    },
  });
}

export type Auth = ReturnType<typeof createAuth>;
