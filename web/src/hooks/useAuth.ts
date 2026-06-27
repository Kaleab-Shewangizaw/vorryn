"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";

interface UseAuthOptions {
  /** If true, redirect to /onboarding when there is no active session */
  require?: boolean;
}

export function useAuth({ require = false }: UseAuthOptions = {}) {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && require && !session) {
      router.push("/onboarding");
    }
  }, [session, isPending, require, router]);

  return {
    user: session?.user ?? null,
    isLoading: isPending,
    isAuthenticated: !!session,
  };
}
