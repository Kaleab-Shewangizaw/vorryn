"use client";

import { useState } from "react";
import Link from "next/link";
import VorrynLogo from "@/app/components/vorryn-logo";
import AshParticles from "@/components/onboarding/AshParticles";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // auth integration placeholder
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen bg-black px-6 overflow-hidden">
      <AshParticles density="low" className="z-0" />

      {/* Layered atmospheric overlays */}
      <div className="absolute inset-0 bg-[radial-gradient(transparent_38%,rgba(0,0,0,0.88)_100%)] pointer-events-none z-10" />
      <div className="absolute inset-0 bg-linear-to-t from-black/75 via-transparent to-black/60 pointer-events-none z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(194,65,12,0.05)_0%,transparent_65%)] pointer-events-none z-10" />

      <div className="relative z-20 w-full max-w-md flex flex-col items-center gap-8">
        {/* Logo */}
        <div style={{ animation: "fade-in-up 0.8s ease-out 0.1s both" }}>
          <VorrynLogo size={96} />
        </div>

        {/* Heading */}
        <div
          className="text-center"
          style={{ animation: "fade-in-up 0.8s ease-out 0.35s both" }}
        >
          <h1 className="text-3xl md:text-4xl font-black text-cold-iron tracking-widest">
            RETURN, WARRIOR
          </h1>
          <p className="text-slate-500 text-[11px] tracking-[0.2em] uppercase mt-2 font-sans">
            The iron remembers your name.
          </p>
        </div>

        {/* Login form */}
        <form
          onSubmit={handleLogin}
          className="w-full flex flex-col gap-4"
          style={{ animation: "fade-in-up 0.8s ease-out 0.6s both" }}
        >
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase tracking-[0.18em] text-slate-500 font-sans">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="warrior@vorryn.io"
              required
              autoComplete="email"
              className="w-full bg-black border border-vorryn-steel/40 focus:border-vorryn-glow-end px-4 py-3 rounded text-slate-200 text-sm font-sans placeholder:text-slate-700 focus:outline-none focus:ring-1 focus:ring-vorryn-glow-start/40 focus:shadow-[0_0_14px_rgba(194,65,12,0.18)] transition-all duration-300"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase tracking-[0.18em] text-slate-500 font-sans">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="············"
              required
              autoComplete="current-password"
              className="w-full bg-black border border-vorryn-steel/40 focus:border-vorryn-glow-end px-4 py-3 rounded text-slate-200 text-sm font-sans placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-vorryn-glow-start/40 focus:shadow-[0_0_14px_rgba(194,65,12,0.18)] transition-all duration-300"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn-ember animate-ember-pulse w-full py-3.5 text-sm rounded tracking-widest mt-1 disabled:opacity-50"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 rounded-full border-2 border-slate-500 border-t-vorryn-glow-end animate-spin" />
            ) : (
              "ENTER THE STRONGHOLD"
            )}
          </button>
        </form>

        {/* Divider */}
        <div
          className="w-full flex items-center gap-4"
          style={{ animation: "fade-in-up 0.6s ease-out 0.9s both" }}
        >
          <div className="flex-1 h-px bg-vorryn-steel/20" />
          <span className="text-[10px] text-slate-600 tracking-widest uppercase font-sans shrink-0">
            or continue with
          </span>
          <div className="flex-1 h-px bg-vorryn-steel/20" />
        </div>

        {/* Google OAuth */}
        <button
          type="button"
          className="w-full flex items-center justify-center gap-3 border border-vorryn-steel/40 bg-black/60 hover:bg-slate-950 hover:border-slate-500 text-slate-400 hover:text-slate-200 py-3 px-6 rounded transition-all duration-300 text-sm font-sans tracking-wider"
          style={{ animation: "fade-in-up 0.6s ease-out 1s both" }}
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" aria-hidden>
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </button>

        {/* Register link */}
        <p
          className="text-xs text-slate-600 font-sans"
          style={{ animation: "fade-in-up 0.6s ease-out 1.1s both" }}
        >
          New warrior?{" "}
          <Link
            href="/auth/register"
            className="text-slate-400 hover:text-vorryn-glow-end transition-colors duration-200 underline-offset-2 hover:underline"
          >
            Begin here
          </Link>
        </p>
      </div>
    </main>
  );
}
