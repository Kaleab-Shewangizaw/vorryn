"use client";

import React, { useEffect, useState } from "react";
import { X, ShieldAlert, Sparkles, Swords } from "lucide-react";

interface CharacterPortraitProps {
  isOpen: boolean;
  onClose: () => void;
  selectedFaction?: string | null;
}

export default function CharacterPortrait({ isOpen, onClose, selectedFaction }: CharacterPortraitProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      // Optional: Add a deep impact sound cue when opening if Web Audio is active
    } else {
      const timer = setTimeout(() => setMounted(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen && !mounted) return null;

  const factionName = selectedFaction
    ? selectedFaction === "ashen"
      ? "Ashen Covenant"
      : selectedFaction === "iron"
      ? "Iron Keepers"
      : "Eclipse Cult"
    : "The Unbound";

  const getFactionColor = () => {
    if (selectedFaction === "ashen") return "text-vorryn-glow-end";
    if (selectedFaction === "iron") return "text-slate-350";
    if (selectedFaction === "eclipse") return "text-red-500";
    return "text-slate-400";
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md transition-all duration-500 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Background glowing dust */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(194,65,12,0.08)_0%,transparent_60%)]" />

      {/* Portrait Modal Card */}
      <div
        className={`relative w-full max-w-lg metal-card rounded-xl overflow-hidden flex flex-col transition-all duration-500 border border-vorryn-steel/60 shadow-2xl ${
          isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        }`}
      >
        {/* Header Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-40 p-1.5 rounded-full border border-slate-800 bg-black/80 hover:border-vorryn-glow-end text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Character Image Container */}
        <div className="relative aspect-square w-full overflow-hidden bg-black group border-b border-vorryn-steel/30">
          <img
            src="/character.png"
            alt="Vorryn Shadow Warrior"
            className="w-full h-full object-cover transition-transform duration-10000 ease-out group-hover:scale-110 pointer-events-none select-none"
          />

          {/* Vignette Overlay on the image */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-90 pointer-events-none" />

          {/* Eye glow boost highlight overlay (simulated) */}
          <div 
            className="absolute w-12 h-4 bg-white/20 blur-[6px] rounded-full mix-blend-screen pointer-events-none"
            style={{ top: '12%', left: '50%', transform: 'translateX(-50%)', opacity: 0.15 }}
          />

          {/* Metadata Badge */}
          <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 bg-black/80 border border-slate-800 rounded">
            <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-slate-400">
              CONCEPT ART // AWAKENED
            </span>
          </div>
        </div>

        {/* Character Lore and Stats Details */}
        <div className="p-6 space-y-4 bg-gradient-to-b from-[#050505] to-[#0a0a0a]">
          <div className="flex justify-between items-end border-b border-slate-900 pb-3">
            <div>
              <span className={`text-[10px] uppercase tracking-widest font-sans font-bold ${getFactionColor()}`}>
                {factionName}
              </span>
              <h3 className="text-xl md:text-2xl font-black text-cold-iron tracking-widest mt-0.5">
                SHADOW WARRIOR
              </h3>
            </div>
            <div className="text-right">
              <span className="text-[9px] uppercase tracking-widest text-slate-500 font-sans">
                Affiliation
              </span>
              <p className="text-[10px] tracking-widest text-slate-300 font-serif italic mt-0.5">
                Order of the Cold Iron
              </p>
            </div>
          </div>

          <p className="text-slate-400 text-xs leading-relaxed font-serif italic">
            "No face, only cold white embers piercing the dark. He stands at the threshold of the void, watching the horizon of the shattered kingdoms. A silent sentinel of Vorryn."
          </p>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="flex flex-col items-center p-2 rounded bg-black/40 border border-slate-900">
              <Swords className="w-4 h-4 text-vorryn-glow-end mb-1" />
              <span className="text-[8px] uppercase tracking-widest text-slate-500 font-sans">Stature</span>
              <span className="text-xs font-bold text-slate-200 mt-0.5 tracking-wider">LETHAL</span>
            </div>

            <div className="flex flex-col items-center p-2 rounded bg-black/40 border border-slate-900">
              <ShieldAlert className="w-4 h-4 text-slate-400 mb-1" />
              <span className="text-[8px] uppercase tracking-widest text-slate-500 font-sans">Resolve</span>
              <span className="text-xs font-bold text-slate-200 mt-0.5 tracking-wider">UNBENT</span>
            </div>

            <div className="flex flex-col items-center p-2 rounded bg-black/40 border border-slate-900">
              <Sparkles className="w-4 h-4 text-red-500 mb-1" />
              <span className="text-[8px] uppercase tracking-widest text-slate-500 font-sans">Catalyst</span>
              <span className="text-xs font-bold text-slate-200 mt-0.5 tracking-wider">VOID</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
