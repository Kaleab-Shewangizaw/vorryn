import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { User } from "../models/User";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "vorryn_ember_secret_do_not_share_2026";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

function signToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions);
}

// ──────────────────────────────────────────
// POST /auth/register
// ──────────────────────────────────────────
const RegisterSchema = z.object({
  username: z.string().min(2).max(20),
  email: z.string().email(),
  password: z.string().min(6),
  characterName: z.string().optional(),
  faction: z.enum(["ashen", "iron", "eclipse"]).optional(),
});

router.post("/register", async (req: Request, res: Response): Promise<void> => {
  const parsed = RegisterSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
    return;
  }

  const { username, email, password, characterName, faction } = parsed.data;

  const existing = await User.findOne({ $or: [{ email }, { username }] });
  if (existing) {
    res.status(409).json({ error: "Username or email already taken" });
    return;
  }

  const user = await User.create({
    username,
    email,
    passwordHash: password, // pre-save hook will hash it
    characterName: characterName ?? "",
    faction: faction ?? null,
    hasSeenIntro: false,
  });

  const token = signToken(String(user._id));
  res.status(201).json({ token, user });
});

// ──────────────────────────────────────────
// POST /auth/login
// ──────────────────────────────────────────
const LoginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

router.post("/login", async (req: Request, res: Response): Promise<void> => {
  const parsed = LoginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Validation failed" });
    return;
  }

  const { username, password } = parsed.data;

  // Allow login by username or email
  const user = await User.findOne({
    $or: [{ username }, { email: username }],
  });

  if (!user) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const valid = await user.comparePassword(password);
  if (!valid) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const token = signToken(String(user._id));
  res.json({ token, user });
});

// ──────────────────────────────────────────
// GET /auth/me  (protected)
// ──────────────────────────────────────────
router.get("/me", authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  const user = await User.findById(req.userId);
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  res.json({ user });
});

// ──────────────────────────────────────────
// PATCH /auth/seen-intro  (protected)
// Mark the intro video as watched
// ──────────────────────────────────────────
router.patch("/seen-intro", authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  const user = await User.findByIdAndUpdate(
    req.userId,
    { hasSeenIntro: true },
    { new: true }
  );
  res.json({ user });
});

export default router;
