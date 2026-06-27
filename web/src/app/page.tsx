import Link from "next/link";
import VorrynLogo from "./components/vorryn-logo";
import AshParticles from "./components/ash-particles";

export default function Home() {
  return (
    <main className="relative flex flex-col items-center justify-between w-full min-h-screen px-6 py-8 overflow-hidden bg-black select-none">
      {/* Ember particle field */}
      <AshParticles logoSize={280} />

      {/* Atmospheric vignettes */}
      <div className="absolute inset-0 pointer-events-none bg-linear-to-t from-black via-transparent to-black/80 z-20" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(transparent_50%,rgba(0,0,0,0.85)_100%)] z-20" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_50%_60%,rgba(194,65,12,0.06)_0%,transparent_65%)] z-20" />

      {/* Header */}
      <header className="relative w-full max-w-6xl flex justify-between items-center z-30">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-vorryn-glow-end animate-pulse" />
          <span className="text-xs uppercase tracking-widest text-slate-500 font-sans">
            Secured Domain // F.03
          </span>
        </div>
        <span className="text-[10px] tracking-widest text-slate-600 uppercase font-sans">
          v0.1.0_ALPHA
        </span>
      </header>

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center flex-1 z-30 text-center gap-10 py-12">
        <div className="vorryn-logo-container transform hover:scale-105 transition-transform duration-700">
          <VorrynLogo size={280} />
        </div>

        <div className="space-y-5">
          <h1 className="text-6xl md:text-8xl font-black text-cold-iron tracking-[0.3em] pl-[0.3em]">
            VORRYN
          </h1>
          <p className="text-slate-400 font-serif italic text-sm md:text-base tracking-wider max-w-sm mx-auto leading-relaxed">
            "The ancient ember stirs. The iron remembers.
            <br />
            Only the worthy shall carry its name."
          </p>
        </div>

        <Link
          href="/dashboard"
          className="btn-ember px-12 py-4 text-sm rounded tracking-widest"
        >
          ENTER THE ORDER
        </Link>
      </section>

      {/* Footer */}
      <footer className="relative w-full max-w-6xl flex justify-between items-center text-[10px] tracking-widest text-slate-600 font-sans z-30">
        <span>VORRYN // v0.1.0_ALPHA</span>
        <span>© 2026 ECLIPSE SYNDICATE</span>
      </footer>
    </main>
  );
}
