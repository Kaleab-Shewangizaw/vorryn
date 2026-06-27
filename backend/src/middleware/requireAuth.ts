import { Request, Response, NextFunction } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { Auth } from "../lib/auth";
import { BetterAuthUser } from "../models/User";

export interface AuthRequest extends Request {
  user?: BetterAuthUser;
}

export function requireAuth(auth: Auth) {
  return async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
      });

      if (!session?.user) {
        res.status(401).json({ error: "Unauthorized — no active session" });
        return;
      }

      req.user = session.user as BetterAuthUser;
      next();
    } catch {
      res.status(401).json({ error: "Unauthorized — session invalid" });
    }
  };
}
