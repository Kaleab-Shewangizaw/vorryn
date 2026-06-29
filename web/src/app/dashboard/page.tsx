"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { profileApi, UserProfile } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import HUD, { HUD_HEIGHT } from "@/components/game/HUD";
import VorrynGame from "@/components/game/VorrynGame";

export default function DashboardPage() {
  const { user, isLoading } = useAuth({ require: true });
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    profileApi
      .getMe()
      .then(({ profile: p }) => {
        if (!p?.warriorName) {
          router.push("/dashboard/setup");
          return;
        }
        setProfile(p);
      })
      .catch(() => {
        router.push("/dashboard/setup");
      })
      .finally(() => setProfileLoading(false));
  }, [user, router]);

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/onboarding");
  };

  if (isLoading || profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="flex flex-col items-center gap-4">
          <div className="w-6 h-6 rounded-full border-2 border-vorryn-steel border-t-vorryn-glow-end animate-spin" />
          <span className="text-[10px] text-slate-600 tracking-widest uppercase font-sans">
            The forge stirs…
          </span>
        </div>
      </div>
    );
  }

  const warriorName = profile?.warriorName ?? "";
  const stage = profile?.stage ?? 1;

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "#000",
        position: "relative",
      }}
    >
      {/* Fixed HUD overlay */}
      <HUD
        warriorName={warriorName}
        stage={stage}
        enemiesRemaining={0}
      />

      {/* Sign out button — absolute top-right outside HUD logic */}
      <button
        onClick={handleSignOut}
        style={{
          position: "fixed",
          top: HUD_HEIGHT / 2,
          right: 100,
          transform: "translateY(-50%)",
          zIndex: 60,
          fontSize: 9,
          fontFamily: "var(--font-sans, sans-serif)",
          color: "#4a5568",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          border: "1px solid rgba(74,85,104,0.3)",
          borderRadius: 4,
          padding: "4px 10px",
          background: "transparent",
          cursor: "pointer",
          transition: "color 0.2s, border-color 0.2s",
        }}
        onMouseEnter={(e) => {
          (e.target as HTMLButtonElement).style.color = "#94a3b8";
          (e.target as HTMLButtonElement).style.borderColor = "rgba(74,85,104,0.6)";
        }}
        onMouseLeave={(e) => {
          (e.target as HTMLButtonElement).style.color = "#4a5568";
          (e.target as HTMLButtonElement).style.borderColor = "rgba(74,85,104,0.3)";
        }}
      >
        Retreat
      </button>

      {/* Game world — fills everything below HUD */}
      <div style={{ paddingTop: HUD_HEIGHT, height: "100vh", boxSizing: "border-box" }}>
        <VorrynGame
          warriorName={warriorName}
          stage={stage}
          hudHeight={HUD_HEIGHT}
        />
      </div>
    </div>
  );
}
