"use client";

import React, { useState, useEffect, useRef } from "react";
import VorrynLogo from "./components/vorryn-logo";
import AshParticles from "./components/ash-particles";
import CharacterPortrait from "./components/character-portrait";
import { Volume2, VolumeX, Shield, Flame, Moon, ArrowRight, Check, Swords } from "lucide-react";

// Web Audio API ambient synthesizer
class AmbientSynth {
  ctx: AudioContext | null = null;
  masterGain: GainNode | null = null;
  droneGain: GainNode | null = null;
  windGain: GainNode | null = null;
  crackleGain: GainNode | null = null;
  oscs: OscillatorNode[] = [];
  windFilter: BiquadFilterNode | null = null;
  windInterval: any = null;
  crackleInterval: any = null;
  isInitialized = false;

  init() {
    if (this.isInitialized) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Fade in master volume
      this.masterGain.gain.linearRampToValueAtTime(0.6, this.ctx.currentTime + 3);

      this.setupDrone();
      this.setupWind();
      this.setupCrackle();
      this.isInitialized = true;
    } catch (e) {
      console.error("Failed to initialize audio synthesizer:", e);
    }
  }

  setupDrone() {
    if (!this.ctx || !this.masterGain) return;
    this.droneGain = this.ctx.createGain();
    this.droneGain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    this.droneGain.connect(this.masterGain);

    const lowpass = this.ctx.createBiquadFilter();
    lowpass.type = "lowpass";
    lowpass.frequency.setValueAtTime(110, this.ctx.currentTime);
    lowpass.connect(this.droneGain);

    // Deep detuned oscillators (low drone)
    const osc1 = this.ctx.createOscillator();
    osc1.type = "sawtooth";
    osc1.frequency.setValueAtTime(43.65, this.ctx.currentTime); // Low F
    osc1.connect(lowpass);

    const osc2 = this.ctx.createOscillator();
    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(44.0, this.ctx.currentTime); // detuned
    osc2.connect(lowpass);

    const osc3 = this.ctx.createOscillator();
    osc3.type = "sine";
    osc3.frequency.setValueAtTime(87.3, this.ctx.currentTime); // octave higher
    osc3.connect(lowpass);

    osc1.start();
    osc2.start();
    osc3.start();

    this.oscs = [osc1, osc2, osc3];
  }

  setupWind() {
    if (!this.ctx || !this.masterGain) return;
    this.windGain = this.ctx.createGain();
    this.windGain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    this.windGain.connect(this.masterGain);

    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    this.windFilter = this.ctx.createBiquadFilter();
    this.windFilter.type = "bandpass";
    this.windFilter.Q.setValueAtTime(2.5, this.ctx.currentTime);
    this.windFilter.frequency.setValueAtTime(350, this.ctx.currentTime);

    whiteNoise.connect(this.windFilter);
    this.windFilter.connect(this.windGain);
    whiteNoise.start();

    // Modulate wind frequency for howling effect
    this.windInterval = setInterval(() => {
      if (!this.ctx || !this.windFilter) return;
      const targetFreq = 150 + Math.random() * 450;
      const duration = 2.5 + Math.random() * 3.5;
      this.windFilter.frequency.exponentialRampToValueAtTime(targetFreq, this.ctx.currentTime + duration);
    }, 4500);
  }

  setupCrackle() {
    if (!this.ctx || !this.masterGain) return;
    this.crackleGain = this.ctx.createGain();
    this.crackleGain.gain.setValueAtTime(0.06, this.ctx.currentTime);
    this.crackleGain.connect(this.masterGain);

    const highpass = this.ctx.createBiquadFilter();
    highpass.type = "highpass";
    highpass.frequency.setValueAtTime(1800, this.ctx.currentTime);
    highpass.connect(this.crackleGain);

    const bufferSize = this.ctx.sampleRate * 0.15;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    // Schedule random wood pops and crackles
    this.crackleInterval = setInterval(() => {
      if (!this.ctx || !this.crackleGain) return;

      const source = this.ctx.createBufferSource();
      source.buffer = noiseBuffer;

      const clickGain = this.ctx.createGain();
      const val = 0.05 + Math.random() * 0.2;
      clickGain.gain.setValueAtTime(val, this.ctx.currentTime);
      clickGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.01 + Math.random() * 0.02);

      source.connect(clickGain);
      clickGain.connect(highpass);
      source.start();
    }, 150);
  }

  setVolume(vol: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.linearRampToValueAtTime(vol, this.ctx.currentTime + 0.3);
    }
  }

  stop() {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.5);
    }
    setTimeout(() => {
      if (this.windInterval) clearInterval(this.windInterval);
      if (this.crackleInterval) clearInterval(this.crackleInterval);
      try {
        this.oscs.forEach(o => o.stop());
        if (this.ctx) this.ctx.close();
      } catch (e) {}
      this.isInitialized = false;
    }, 600);
  }
}

export default function Home() {
  const [step, setStep] = useState(1);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [hoveredFaction, setHoveredFaction] = useState<"ashen" | "iron" | "eclipse" | null>(null);
  const [selectedFaction, setSelectedFaction] = useState<"ashen" | "iron" | "eclipse" | null>(null);
  const [characterName, setCharacterName] = useState("");
  const [hasSworn, setHasSworn] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isPortraitOpen, setIsPortraitOpen] = useState(false);

  const synthRef = useRef<AmbientSynth | null>(null);

  // Initialize synth on mount/unmount
  useEffect(() => {
    synthRef.current = new AmbientSynth();
    return () => {
      if (synthRef.current) {
        synthRef.current.stop();
      }
    };
  }, []);

  // Toggle audio
  const handleToggleAudio = () => {
    if (!synthRef.current) return;

    if (!audioEnabled) {
      synthRef.current.init();
      synthRef.current.setVolume(0.6);
      setAudioEnabled(true);
    } else {
      synthRef.current.setVolume(0);
      setTimeout(() => {
        if (synthRef.current) synthRef.current.stop();
      }, 500);
      setAudioEnabled(false);
    }
  };

  // Start audio automatically on first interaction (Awaken) if desired
  const handleAwaken = () => {
    if (synthRef.current && !audioEnabled) {
      synthRef.current.init();
      synthRef.current.setVolume(0.6);
      setAudioEnabled(true);
    }
    setStep(2);
  };

  // Trigger final cinematic entry
  const handleFinalize = () => {
    if (!characterName.trim() || !hasSworn) return;
    setIsCompleting(true);

    // Play a brief synth rumble intensification or similar if desired
    if (synthRef.current && audioEnabled && synthRef.current.masterGain && synthRef.current.ctx) {
      // Temporarily pump the volume, then drop it to create an impact effect
      synthRef.current.masterGain.gain.setValueAtTime(0.8, synthRef.current.ctx.currentTime);
      synthRef.current.masterGain.gain.exponentialRampToValueAtTime(0.01, synthRef.current.ctx.currentTime + 2.0);
    }

    setTimeout(() => {
      setIsComplete(true);
      setIsCompleting(false);
    }, 2500);
  };

  const handleReset = () => {
    setStep(1);
    setSelectedFaction(null);
    setCharacterName("");
    setHasSworn(false);
    setIsComplete(false);
    if (synthRef.current && audioEnabled) {
      synthRef.current.setVolume(0.6);
    }
  };

  // Background gradient shifts based on faction interactions
  const getBackgroundStyles = () => {
    const active = hoveredFaction || selectedFaction;
    if (active === "ashen") {
      return "radial-gradient(circle at 50% 50%, rgba(194, 65, 12, 0.12) 0%, #000000 70%)";
    }
    if (active === "iron") {
      return "radial-gradient(circle at 50% 50%, rgba(74, 85, 104, 0.15) 0%, #000000 70%)";
    }
    if (active === "eclipse") {
      return "radial-gradient(circle at 50% 50%, rgba(220, 38, 38, 0.12) 0%, #000000 70%)";
    }
    return "radial-gradient(circle at 50% 50%, rgba(249, 115, 22, 0.04) 0%, #000000 80%)";
  };

  return (
    <main
      className="relative flex flex-col items-center justify-between w-full h-full min-h-screen px-6 py-8 overflow-hidden select-none bg-black transition-all duration-1000"
      style={{ backgroundImage: getBackgroundStyles() }}
    >
      {/* Ash particle field */}
      {!isComplete && <AshParticles logoSize={step === 1 ? 320 : 180} />}

      {/* Atmospheric Vignette Overlays */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black via-transparent to-black/80 z-20" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(transparent_50%,rgba(0,0,0,0.85)_100%)] z-20" />

      {/* Header controls */}
      <div className="relative w-full max-w-6xl flex justify-between items-center z-30">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-vorryn-glow-end animate-pulse" />
          <span className="text-xs uppercase tracking-widest text-slate-500 font-sans">
            Secured Domain // F.03
          </span>
        </div>

        {/* Header Actions */}
        <div className="flex gap-3 items-center">
          <button
            onClick={() => setIsPortraitOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-slate-800 hover:border-vorryn-glow-end bg-black/60 text-slate-400 hover:text-slate-200 transition-all text-xs tracking-widest cursor-pointer"
          >
            <Swords className="w-3.5 h-3.5 text-slate-400" />
            <span>INSPECT WARRIOR</span>
          </button>

          <button
            onClick={handleToggleAudio}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-md border border-slate-800 hover:border-vorryn-glow-end bg-black/60 text-slate-400 hover:text-slate-200 transition-all text-xs tracking-widest cursor-pointer"
          >
            {audioEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-vorryn-glow-end animate-pulse" />
                <span>AMBIENT: ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-slate-500" />
                <span>AMBIENT: OFF</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* MIDDLE CONTENT PANEL */}
      <div className="relative flex flex-col items-center justify-center flex-1 w-full max-w-4xl z-30 my-8">
        
        {/* CINEMATIC GAME-ENTRY STATE */}
        {isComplete ? (
          <div className="flex flex-col items-center justify-center text-center animate-fade-in duration-1000 max-w-xl">
            <div className="vorryn-logo-container mb-6 scale-90 opacity-40">
              <VorrynLogo size={140} />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold tracking-widest text-cold-iron mb-6 animate-pulse">
              COVENANT BOUND
            </h1>
            
            <p className="text-slate-400 text-sm md:text-base leading-relaxed tracking-wide mb-8 font-serif italic">
              "The iron holds, the flame consumes, the shadow protects. Go forth, <span className="text-vorryn-glow-end font-sans not-italic font-semibold tracking-widest">{characterName.toUpperCase()}</span>, as a sworn member of the <span className="text-slate-300 font-semibold">{selectedFaction === "ashen" ? "Ashen Covenant" : selectedFaction === "iron" ? "Iron Keepers" : "Eclipse Cult"}</span>. The gates of Vorryn have opened."
            </p>
            
            <button
              onClick={handleReset}
              className="px-8 py-3 rounded border border-vorryn-steel/50 hover:border-slate-400 bg-black text-xs tracking-widest uppercase hover:text-white transition-all duration-300 cursor-pointer"
            >
              Sever Connection & Restart
            </button>
          </div>
        ) : (
          <>
            {/* STEP 1: SPLASH SCREEN */}
            {step === 1 && (
              <div className="flex flex-col items-center text-center max-w-xl transition-all duration-700">
                {/* Logo centered */}
                <div className="vorryn-logo-container mb-2 transform hover:scale-105 transition-transform duration-700">
                  <VorrynLogo size={320} />
                </div>

                <div className="space-y-4">
                  <h1 className="text-5xl md:text-7xl font-black text-cold-iron tracking-[0.25em] pl-[0.25em]">
                    VORRYN
                  </h1>
                  
                  <p className="text-slate-400 font-serif text-sm md:text-base italic max-w-md tracking-wider leading-relaxed mx-auto">
                    "A shadow stirs in the cold iron. The ancient embers awaken. Will you answer the call?"
                  </p>
                </div>

                <div className="mt-12 flex gap-4 justify-center">
                  <button
                    onClick={handleAwaken}
                    className="btn-ember px-10 py-4 text-sm rounded bg-black cursor-pointer"
                  >
                    AWAKEN
                  </button>
                  <button
                    onClick={() => setIsPortraitOpen(true)}
                    className="px-8 py-4 text-sm rounded border border-slate-800 hover:border-slate-500 bg-black text-slate-400 hover:text-slate-200 tracking-widest transition-all cursor-pointer"
                  >
                    VIEW SENTINEL
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: FACTION COVENANT SELECTION */}
            {step === 2 && (
              <div className="flex flex-col items-center w-full transition-all duration-700">
                {/* Small Top-Anchored Logo */}
                <div className="vorryn-logo-container scale-75 -mt-6 mb-6">
                  <VorrynLogo size={140} />
                </div>

                <div className="text-center mb-8">
                  <h2 className="text-2xl md:text-3xl tracking-[0.2em] text-slate-100 font-bold uppercase">
                    CHOOSE YOUR COVENANT
                  </h2>
                  <p className="text-slate-400 text-xs md:text-sm font-serif italic mt-2">
                    "Bind your soul to an order. Each carries a different burden."
                  </p>
                </div>

                {/* Faction Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl px-4">
                  {/* Faction 1: Ashen Covenant */}
                  <div
                    onMouseEnter={() => setHoveredFaction("ashen")}
                    onMouseLeave={() => setHoveredFaction(null)}
                    onClick={() => setSelectedFaction("ashen")}
                    className={`metal-card p-6 rounded-lg cursor-pointer flex flex-col items-center text-center transition-all duration-300 ${
                      selectedFaction === "ashen" ? "border-vorryn-glow-end ring-1 ring-vorryn-glow-start" : ""
                    }`}
                  >
                    <div className={`p-4 rounded-full bg-orange-950/20 border mb-4 transition-colors ${
                      selectedFaction === "ashen" ? "border-vorryn-glow-end text-vorryn-glow-end" : "border-slate-800 text-slate-500"
                    }`}>
                      <Flame className="w-8 h-8" />
                    </div>
                    <h3 className="text-base tracking-widest font-bold text-slate-200 mb-3 uppercase">Ashen Covenant</h3>
                    <p className="text-xs text-slate-400 leading-relaxed font-sans">
                      Keepers of the dying flame. They wield the molten orange fire of creation and destruction, seeking to stave off the absolute dark.
                    </p>
                    {selectedFaction === "ashen" && (
                      <span className="text-[10px] text-vorryn-glow-end tracking-widest uppercase mt-4 font-bold flex items-center gap-1">
                        <Check className="w-3 h-3" /> Selected
                      </span>
                    )}
                  </div>

                  {/* Faction 2: Iron Keepers */}
                  <div
                    onMouseEnter={() => setHoveredFaction("iron")}
                    onMouseLeave={() => setHoveredFaction(null)}
                    onClick={() => setSelectedFaction("iron")}
                    className={`metal-card p-6 rounded-lg cursor-pointer flex flex-col items-center text-center transition-all duration-300 ${
                      selectedFaction === "iron" ? "border-slate-400 ring-1 ring-slate-500" : ""
                    }`}
                  >
                    <div className={`p-4 rounded-full bg-slate-900/40 border mb-4 transition-colors ${
                      selectedFaction === "iron" ? "border-slate-300 text-slate-200" : "border-slate-800 text-slate-500"
                    }`}>
                      <Shield className="w-8 h-8" />
                    </div>
                    <h3 className="text-base tracking-widest font-bold text-slate-200 mb-3 uppercase">Iron Keepers</h3>
                    <p className="text-xs text-slate-400 leading-relaxed font-sans">
                      Wardens of the shattered gate. Forged in cold steel, they rely on absolute resolve, heavy plate armor, and ancient oaths to survive the abyss.
                    </p>
                    {selectedFaction === "iron" && (
                      <span className="text-[10px] text-slate-300 tracking-widest uppercase mt-4 font-bold flex items-center gap-1">
                        <Check className="w-3 h-3" /> Selected
                      </span>
                    )}
                  </div>

                  {/* Faction 3: Eclipse Cult */}
                  <div
                    onMouseEnter={() => setHoveredFaction("eclipse")}
                    onMouseLeave={() => setHoveredFaction(null)}
                    onClick={() => setSelectedFaction("eclipse")}
                    className={`metal-card p-6 rounded-lg cursor-pointer flex flex-col items-center text-center transition-all duration-300 ${
                      selectedFaction === "eclipse" ? "border-red-700 ring-1 ring-red-800" : ""
                    }`}
                  >
                    <div className={`p-4 rounded-full bg-red-950/20 border mb-4 transition-colors ${
                      selectedFaction === "eclipse" ? "border-red-600 text-red-500" : "border-slate-800 text-slate-500"
                    }`}>
                      <Moon className="w-8 h-8" />
                    </div>
                    <h3 className="text-base tracking-widest font-bold text-slate-200 mb-3 uppercase">Eclipse Cult</h3>
                    <p className="text-xs text-slate-400 leading-relaxed font-sans">
                      Followers of the shadow's wake. They embrace deep crimson embers and dark void magic, believing the shadows are a shield rather than a threat.
                    </p>
                    {selectedFaction === "eclipse" && (
                      <span className="text-[10px] text-red-500 tracking-widest uppercase mt-4 font-bold flex items-center gap-1">
                        <Check className="w-3 h-3" /> Selected
                      </span>
                    )}
                  </div>
                </div>

                {/* Slide Actions */}
                <div className="mt-12 flex gap-4">
                  <button
                    onClick={() => setStep(1)}
                    className="px-6 py-2.5 rounded border border-slate-800 hover:border-slate-600 text-xs tracking-widest uppercase text-slate-500 hover:text-slate-300 transition-all cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    disabled={!selectedFaction}
                    className={`btn-ember px-8 py-2.5 rounded text-xs cursor-pointer flex items-center gap-2 ${
                      !selectedFaction ? "opacity-30 pointer-events-none border-slate-800 text-slate-600" : ""
                    }`}
                  >
                    PROCEED <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: THE COVENANT OATH */}
            {step === 3 && (
              <div className="flex flex-col items-center text-center max-w-lg w-full transition-all duration-700">
                {/* Small Top-Anchored Logo */}
                <div className="vorryn-logo-container scale-75 -mt-6 mb-6">
                  <VorrynLogo size={140} />
                </div>

                <h2 className="text-2xl md:text-3xl tracking-[0.2em] text-slate-100 font-bold uppercase mb-2">
                  THE OATH OF SOULS
                </h2>
                
                <p className="text-slate-400 text-xs md:text-sm font-serif italic mb-8">
                  "Enter your moniker to bind your essence to the {selectedFaction === "ashen" ? "Ashen Covenant" : selectedFaction === "iron" ? "Iron Keepers" : "Eclipse Cult"}."
                </p>

                {/* Form Group */}
                <div className="w-full space-y-6 text-left">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-slate-500 mb-2.5 font-sans">
                      Character Moniker
                    </label>
                    <input
                      type="text"
                      maxLength={18}
                      placeholder="e.g. ALDRICH"
                      value={characterName}
                      onChange={(e) => setCharacterName(e.target.value.replace(/[^a-zA-Z]/g, ""))}
                      className="w-full bg-black border border-slate-800 focus:border-vorryn-glow-end px-4 py-3 rounded text-slate-200 tracking-widest font-sans uppercase placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-vorryn-glow-start transition-all"
                    />
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded border border-slate-900 bg-slate-950/20">
                    <input
                      type="checkbox"
                      id="oath-checkbox"
                      checked={hasSworn}
                      onChange={(e) => setHasSworn(e.target.checked)}
                      className="mt-1 cursor-pointer accent-vorryn-glow-end"
                    />
                    <label htmlFor="oath-checkbox" className="text-xs text-slate-400 leading-relaxed font-serif select-none cursor-pointer">
                      I swear my life to the covenant and accept the ancient burden. Let the cold iron bind my fate.
                    </label>
                  </div>
                </div>

                {/* Final Submit Panel */}
                <div className="mt-10 flex gap-4 w-full justify-center">
                  <button
                    onClick={() => setStep(2)}
                    disabled={isCompleting}
                    className="px-6 py-2.5 rounded border border-slate-800 hover:border-slate-600 text-xs tracking-widest uppercase text-slate-500 hover:text-slate-300 transition-all disabled:opacity-30 cursor-pointer"
                  >
                    Back
                  </button>

                  <button
                    onClick={handleFinalize}
                    disabled={!characterName.trim() || !hasSworn || isCompleting}
                    className={`btn-ember px-8 py-2.5 rounded text-xs flex items-center justify-center gap-2 min-w-[160px] cursor-pointer ${
                      (!characterName.trim() || !hasSworn || isCompleting) ? "opacity-30 pointer-events-none" : ""
                    }`}
                  >
                    {isCompleting ? (
                      <span className="w-4 h-4 rounded-full border-2 border-slate-400 border-t-vorryn-glow-end animate-spin" />
                    ) : (
                      "SEAL COVENANT"
                    )}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* FOOTER */}
      <div className="relative w-full max-w-6xl flex justify-between items-center text-[10px] tracking-widest text-slate-600 font-sans z-30">
        <span>VORRYN // v0.1.0_ALPHA</span>
        <span>© 2026 ECLIPSE SYNDICATE</span>
      </div>

      {/* Full screen flash/overlay during transition */}
      {isCompleting && (
        <div className="absolute inset-0 bg-white z-50 animate-fade-out mix-blend-difference pointer-events-none duration-1500" />
      )}

      {/* Character Portrait Concept Art Showcase */}
      <CharacterPortrait
        isOpen={isPortraitOpen}
        onClose={() => setIsPortraitOpen(false)}
        selectedFaction={selectedFaction}
      />
    </main>
  );
}
