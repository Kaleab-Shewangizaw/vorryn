"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import VorrynLogo from "@/app/components/vorryn-logo";
import AshParticles from "@/components/onboarding/AshParticles";
import { profileApi } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

export default function SetupPage() {
  useAuth({ require: true });

  const router = useRouter();
  const [warriorName, setWarriorName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    const trimmed = warriorName.trim();
    if (!trimmed) return;

    setLoading(true);
    setError("");

    try {
      await profileApi.setWarriorName(trimmed);
      router.push("/dashboard");
    } catch {
      setError("The forge rejected that name. Try another.");
      setLoading(false);
    }
  };

  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen bg-black overflow-hidden">
      <AshParticles density="medium" className="z-0" />

      {/* Atmospheric layers */}
      <div className="absolute inset-0 bg-[radial-gradient(transparent_35%,rgba(0,0,0,0.9)_100%)] pointer-events-none z-10" />
      <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-black/70 pointer-events-none z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,rgba(194,65,12,0.07)_0%,transparent_65%)] pointer-events-none z-10" />

      {/* Character silhouette — faint background anchor */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 opacity-10"
        aria-hidden
      >
        <Image
          src="/character.png"
          alt=""
          width={480}
          height={640}
          className="object-contain object-center select-none"
          priority
        />
      </div>

      <div className="relative z-20 w-full max-w-sm flex flex-col items-center gap-10 px-6">
        {/* Logo */}
        <div style={{ animation: "fade-in-up 0.8s ease-out 0.2s both" }}>
          <VorrynLogo size={110} />
        </div>

        {/* Heading */}
        <div
          className="text-center"
          style={{ animation: "fade-in-up 0.8s ease-out 0.5s both" }}
        >
          <h1 className="text-2xl md:text-3xl font-black text-cold-iron tracking-wider leading-tight">
            What shall they call you,
            <br />
            warrior?
          </h1>
          <p className="text-slate-500 text-xs tracking-widest font-sans mt-3 max-w-xs mx-auto leading-relaxed">
            This name will be etched into the order's record. Choose with intent.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="w-full px-4 py-3 rounded border border-red-900/60 bg-red-950/20 text-red-400 text-xs font-sans tracking-wide">
            {error}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col gap-5"
          style={{ animation: "fade-in-up 0.8s ease-out 0.8s both" }}
        >
          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-sans">
              Warrior Name
            </label>
            <input
              type="text"
              value={warriorName}
              onChange={(e) => setWarriorName(e.target.value)}
              placeholder="e.g. KAEL THE UNYIELDING"
              maxLength={24}
              required
              autoFocus
              className="w-full bg-black border border-vorryn-steel/40 focus:border-vorryn-glow-end px-4 py-3.5 rounded text-slate-200 text-sm font-sans placeholder:text-slate-700 focus:outline-none focus:ring-1 focus:ring-vorryn-glow-start/40 focus:shadow-[0_0_16px_rgba(194,65,12,0.22)] transition-all duration-300 tracking-wider"
            />
            <span className="text-[10px] text-slate-600 font-sans text-right">
              {warriorName.length}/24
            </span>
          </div>

          <button
            type="submit"
            disabled={loading || !warriorName.trim()}
            className="btn-ember animate-ember-pulse w-full py-4 text-sm rounded tracking-widest disabled:opacity-40 disabled:pointer-events-none"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 rounded-full border-2 border-slate-500 border-t-vorryn-glow-end animate-spin" />
            ) : (
              "CLAIM YOUR NAME"
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
