import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { toNodeHandler } from "better-auth/node";
import { connectDB } from "./config/db";
import { createAuth } from "./lib/auth";
import { requireAuth } from "./middleware/requireAuth";
import profileRouter from "./routes/profile.route";

const app = express();
const PORT = Number(process.env.PORT) || 4000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  })
);
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "vorryn-api",
    ts: new Date().toISOString(),
  });
});

async function start() {
  await connectDB();

  // Better Auth needs the MongoDB Db instance — available after connectDB()
  const db = mongoose.connection.db;
  if (!db) throw new Error("MongoDB connection not initialized");

  const auth = createAuth(db);

  // Better Auth owns all /api/auth/* routes
  app.all("/api/auth/{*path}", (req, res) => {
    return toNodeHandler(auth)(req, res);
  });

  // Protected profile routes
  app.use("/api/profile", requireAuth(auth), profileRouter);

  app.listen(PORT, () => {
    console.log(`\n🔥 Vorryn API → http://localhost:${PORT}`);
    console.log(`   Auth  → http://localhost:${PORT}/api/auth`);
    console.log(`   Health→ http://localhost:${PORT}/health\n`);
  });
}

start().catch((err) => {
  console.error("Fatal startup error:", err);
  process.exit(1);
});

export default app;
