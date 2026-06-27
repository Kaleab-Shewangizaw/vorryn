import { Router, Response } from "express";
import { z } from "zod";
import { AuthRequest } from "../middleware/requireAuth";
import { UserProfile } from "../models/UserProfile";

const router = Router();

// GET /api/profile/me
router.get("/me", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const profile = await UserProfile.findOne({ userId: req.user!.id });
    res.json({ user: req.user, profile: profile ?? null });
  } catch (err) {
    res.status(500).json({ error: "Failed to load profile" });
  }
});

// PATCH /api/profile/me — update warrior name
const UpdateSchema = z.object({
  warriorName: z
    .string()
    .min(1, "Name cannot be empty")
    .max(24, "Name too long — max 24 characters"),
});

router.patch("/me", async (req: AuthRequest, res: Response): Promise<void> => {
  const parsed = UpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    res
      .status(400)
      .json({ error: parsed.error.errors[0]?.message ?? "Invalid data" });
    return;
  }

  try {
    const profile = await UserProfile.findOneAndUpdate(
      { userId: req.user!.id },
      { warriorName: parsed.data.warriorName },
      { new: true, upsert: true }
    );
    res.json({ profile });
  } catch (err) {
    res.status(500).json({ error: "Failed to update warrior name" });
  }
});

export default router;
