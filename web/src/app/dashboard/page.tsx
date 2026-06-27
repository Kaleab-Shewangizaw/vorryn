"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Swords, Shield } from "lucide-react";
import VorrynLogo from "@/app/components/vorryn-logo";
import AshParticles from "@/components/onboarding/AshParticles";
import { useAuth } from "@/hooks/useAuth";
import { profileApi, UserProfile } from "@/lib/api";
import { STAGES } from "@/lib/constants";
import { authClient } from "@/lib/auth-client";

const STAGE_LINES: Record<number, string> = {
  1: "The fire starts here. Your first enemy awaits in the dark.",
  2: "The iron is shaping. Every blow refines you.",
  3: "Your flame grows fierce. No enemy stands unchanged against you.",
  4: "The ancient ones take notice. Do not falter now.",
  5: "You are Vorryn. The abyss itself bows before your name.",
};

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
        // If the profile fetch fails, send them to setup
        router.push("/dashboard/setup");
      })
      .finally(() => setProfileLoading(false));
  }, [user, router]);

  const stage = STAGES.find((s) => s.id === (profile?.stage ?? 1)) ?? STAGES[0];

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

  return (
    <main className="relative flex flex-col min-h-screen bg-black overflow-hidden">
      <AshParticles density="low" className="z-0" />

      {/* Atmospheric overlays */}
      <div className="absolute inset-0 bg-[radial-gradient(transparent_40%,rgba(0,0,0,0.75)_100%)] pointer-events-none z-10" />
      <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-black/60 pointer-events-none z-10" />

      {/* ── Header ────────────────────────────────────── */}
      <header className="relative z-30 w-full flex items-center justify-between px-6 md:px-10 py-5 border-b border-vorryn-steel/10">
        {/* Left: logo + name */}
        <div className="flex items-center gap-3">
          <VorrynLogo size={36} />
          <span className="font-cinzel text-xs font-bold tracking-[0.22em] text-slate-400 uppercase">
            Vorryn
          </span>
        </div>

        {/* Right: warrior badge + sign out */}
        <div className="flex items-center gap-4">
          {profile && (
            <div className="flex flex-col items-end gap-0.5">
              <span className="font-cinzel text-sm font-black text-slate-200 tracking-wider">
                {profile.warriorName}
              </span>
              <span className="text-[10px] font-sans text-vorryn-glow-end tracking-widest uppercase">
                Stage {stage.id} — {stage.label}
              </span>
            </div>
          )}
          <button
            onClick={handleSignOut}
            className="text-[10px] text-slate-600 hover:text-slate-400 font-sans tracking-widest uppercase transition-colors duration-200 border border-vorryn-steel/20 hover:border-vorryn-steel/50 px-3 py-1.5 rounded"
          >
            Retreat
          </button>
        </div>
      </header>

      {/* ── Hero: Character ───────────────────────────── */}
      <section className="relative z-20 flex flex-col items-center flex-1 justify-center gap-6 py-10">
        {/* Character image */}
        <div
          className="relative"
          style={{ animation: "fade-in-up 1s ease-out 0.2s both" }}
        >
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(194,65,12,0.18)_0%,transparent_70%)] blur-2xl scale-150 pointer-events-none" />
          <Image
            src="/character.png"
            alt={`Vorryn warrior — ${stage.label}`}
            width={260}
            height={360}
            className="object-contain object-bottom drop-shadow-[0_20px_40px_rgba(0,0,0,0.95)] select-none"
            priority
          />
        </div>

        {/* Stage motivational line */}
        <div
          className="text-center max-w-xs px-4"
          style={{ animation: "fade-in-up 0.8s ease-out 0.6s both" }}
        >
          <p className="font-serif italic text-slate-400 text-sm leading-relaxed tracking-wide">
            "{STAGE_LINES[profile?.stage ?? 1]}"
          </p>
        </div>
      </section>

      {/* ── Action Cards ─────────────────────────────── */}
      <section
        className="relative z-30 w-full max-w-2xl mx-auto grid grid-cols-2 gap-4 px-6 md:px-10 pb-10"
        style={{ animation: "fade-in-up 0.8s ease-out 0.9s both" }}
      >
        {/* View Enemies */}
        <Link
          href="/dashboard/enemies"
          className="metal-card group flex flex-col items-center gap-4 p-7 rounded-lg cursor-pointer"
        >
          <div className="p-3 rounded-full border border-vorryn-steel/40 group-hover:border-vorryn-glow-end/60 transition-colors duration-300">
            <Shield className="w-6 h-6 text-slate-500 group-hover:text-vorryn-glow-end transition-colors duration-300" />
          </div>
          <div className="text-center">
            <h3 className="font-cinzel text-sm font-bold uppercase tracking-widest text-slate-200">
              View Enemies
            </h3>
            <p className="text-[11px] text-slate-500 font-sans mt-1.5 leading-relaxed">
              Survey your named burdens.
              <br />
              Know what you face.
            </p>
          </div>
        </Link>

        {/* Add Enemy */}
        <Link
          href="/dashboard/enemies/new"
          className="metal-card group flex flex-col items-center gap-4 p-7 rounded-lg cursor-pointer"
        >
          <div className="p-3 rounded-full border border-vorryn-steel/40 group-hover:border-vorryn-glow-end/60 transition-colors duration-300">
            <Swords className="w-6 h-6 text-slate-500 group-hover:text-vorryn-glow-end transition-colors duration-300" />
          </div>
          <div className="text-center">
            <h3 className="font-cinzel text-sm font-bold uppercase tracking-widest text-slate-200">
              Add Enemy
            </h3>
            <p className="text-[11px] text-slate-500 font-sans mt-1.5 leading-relaxed">
              Name your next battle.
              <br />
              Bring it into the light.
            </p>
          </div>
        </Link>
      </section>
    </main>
  );
}
