"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import VorrynLogo from "@/app/components/vorryn-logo";
import AshParticles from "@/components/onboarding/AshParticles";
import OnboardingStep from "@/components/onboarding/OnboardingStep";

const SUBTITLE = "Every warrior begins with nothing.";
const CHAR_DELAY_MS = 65;
const SUBTITLE_START_MS = 1400;

const subtitleEndMs =
  SUBTITLE_START_MS + (SUBTITLE.length - 1) * CHAR_DELAY_MS + 350;
const buttonAppearMs = subtitleEndMs + 450;

function LetterReveal({
  text,
  startDelay = 0,
}: {
  text: string;
  startDelay?: number;
}) {
  return (
    <>
      {text.split("").map((char, i) => (
        <span
          key={i}
          className="letter-char"
          style={{ animationDelay: `${startDelay + i * CHAR_DELAY_MS}ms` }}
        >
          {char === " " ? " " : char}
        </span>
      ))}
    </>
  );
}

const STORY_LINES = [
  {
    text: "Your enemies accumulate in the dark. Every day you do not act, they grow stronger and their hold on you deepens.",
    delay: 900,
  },
  {
    text: "The warriors who endure are not the ones who never fell — they are the ones who rose, again and again, until standing became instinct.",
    delay: 1600,
  },
  {
    text: "Vorryn tracks every battle, every burden named, every victory earned. The iron does not forget — and neither will you.",
    delay: 2400,
  },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const router = useRouter();

  const nextStep = useCallback(() => {
    if (step < 3) setStep((s) => s + 1);
    else router.push("/auth/login");
  }, [step, router]);

  const prevStep = useCallback(() => {
    if (step > 1) setStep((s) => s - 1);
  }, [step]);

  return (
    <div className="relative w-full min-h-screen bg-black overflow-hidden">
      <AshParticles density="low" className="z-0" />

      {/* Radial vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(transparent_38%,rgba(0,0,0,0.82)_100%)] pointer-events-none z-10" />

      <OnboardingStep stepNumber={step} totalSteps={3}>
        {/* ─── STEP 1: THE AWAKENING ─────────────────── */}
        {step === 1 && (
          <div className="flex flex-col items-center justify-center w-full min-h-screen gap-14 px-6 z-20 relative">
            {/* Logo — fades in from black */}
            <div
              className="flex flex-col items-center gap-10 text-center"
              style={{ animation: "fade-in-up 1.4s ease-out 0.3s both" }}
            >
              <VorrynLogo size={200} />

              {/* Letter-by-letter subtitle */}
              <p className="font-serif italic text-slate-300 text-lg md:text-xl tracking-[0.08em] leading-relaxed">
                <LetterReveal text={SUBTITLE} startDelay={SUBTITLE_START_MS} />
              </p>
            </div>

            {/* Continue button — appears after all letters settle */}
            <div style={{ animation: `fade-in-up 0.7s ease-out ${buttonAppearMs}ms both` }}>
              <button
                onClick={nextStep}
                className="btn-ember animate-ember-pulse px-12 py-4 text-sm rounded tracking-widest"
              >
                ANSWER THE CALL
              </button>
            </div>
          </div>
        )}

        {/* ─── STEP 2: THE CALL ──────────────────────── */}
        {step === 2 && (
          <div className="flex h-screen w-full z-20 relative">
            {/* Left: Character portrait */}
            <div
              className="relative w-5/12 h-full overflow-hidden shrink-0"
              style={{ animation: "slide-in-from-left 1s ease-out 0.15s both" }}
            >
              <Image
                src="/character.png"
                alt="Vorryn Warrior"
                fill
                className="object-cover object-top"
                priority
              />
              {/* Directional fades so left panel bleeds into right */}
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-black/50 z-10" />
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-transparent to-black z-10" />
            </div>

            {/* Right: Text content */}
            <div className="flex-1 flex flex-col justify-center px-10 md:px-16 gap-8 z-20 overflow-y-auto">
              {/* Heading */}
              <div style={{ animation: "fade-in-up 0.85s ease-out 0.55s both" }}>
                <h2 className="text-4xl md:text-5xl font-black text-cold-iron leading-tight">
                  The battle
                  <br />
                  is real.
                </h2>
              </div>

              {/* Staggered story lines */}
              <div className="flex flex-col gap-6">
                {STORY_LINES.map((line, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3"
                    style={{
                      animation: `fade-in-up 0.7s ease-out ${line.delay}ms both`,
                    }}
                  >
                    <div className="mt-[7px] w-1.5 h-1.5 rounded-full bg-vorryn-glow-end shrink-0 shadow-[0_0_6px_rgba(249,115,22,0.9)]" />
                    <p className="text-slate-400 text-sm md:text-base leading-relaxed font-sans">
                      {line.text}
                    </p>
                  </div>
                ))}
              </div>

              {/* Navigation */}
              <div
                className="flex gap-4"
                style={{
                  animation: `fade-in-up 0.6s ease-out ${STORY_LINES[STORY_LINES.length - 1].delay + 700}ms both`,
                }}
              >
                <button
                  onClick={prevStep}
                  className="px-6 py-2.5 rounded border border-vorryn-steel/40 text-slate-500 hover:text-slate-300 text-xs tracking-widest uppercase font-cinzel transition-colors duration-200"
                >
                  BACK
                </button>
                <button
                  onClick={nextStep}
                  className="btn-ember px-8 py-2.5 text-xs rounded tracking-widest"
                >
                  I AM READY
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── STEP 3: THE OATH ──────────────────────── */}
        {step === 3 && (
          <div className="relative flex flex-col items-center justify-center w-full min-h-screen gap-12 px-6 z-20 text-center">
            {/* Ember radial glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_55%,rgba(194,65,12,0.09)_0%,transparent_68%)] pointer-events-none" />

            <div className="max-w-xl flex flex-col items-center gap-9">
              {/* Heading */}
              <div style={{ animation: "fade-in-up 0.85s ease-out 0.25s both" }}>
                <h2 className="text-4xl md:text-6xl font-black text-cold-iron leading-tight tracking-wide">
                  Are you ready
                  <br />
                  to fight?
                </h2>
              </div>

              {/* Oath lore */}
              <div style={{ animation: "fade-in-up 0.85s ease-out 0.85s both" }}>
                <p className="text-slate-400 font-serif italic text-sm md:text-base leading-relaxed tracking-wide max-w-md">
                  "The order of Vorryn demands only one thing — that you show
                  up. Every battle recorded. Every burden named. Every victory
                  earned. The iron does not forget, and neither will you. Swear
                  it, and the gates shall open."
                </p>
              </div>

              {/* CTA */}
              <div
                className="flex flex-col items-center gap-4"
                style={{ animation: "fade-in-up 0.85s ease-out 1.6s both" }}
              >
                <button
                  onClick={() => router.push("/auth/login")}
                  className="btn-ember animate-ember-pulse px-14 py-5 text-base rounded tracking-widest"
                >
                  ENTER THE ORDER
                </button>
                <button
                  onClick={prevStep}
                  className="text-[11px] text-slate-600 hover:text-slate-400 tracking-widest uppercase font-cinzel transition-colors duration-200 mt-1"
                >
                  ← Return
                </button>
              </div>
            </div>
          </div>
        )}
      </OnboardingStep>
    </div>
  );
}
