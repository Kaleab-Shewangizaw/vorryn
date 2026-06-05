import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db";
import authRouter from "./routes/auth";

const app = express();
const PORT = Number(process.env.PORT) || 3001;

// ── Middleware ────────────────────────────
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001"],
  credentials: true,
}));
app.use(express.json());

// ── Routes ───────────────────────────────
app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "vorryn-api", ts: new Date().toISOString() });
});

app.use("/auth", authRouter);

// ── Start ────────────────────────────────
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`\n🔥 Vorryn API running → http://localhost:${PORT}`);
    console.log(`   Health → http://localhost:${PORT}/health\n`);
  });
});

export default app;
