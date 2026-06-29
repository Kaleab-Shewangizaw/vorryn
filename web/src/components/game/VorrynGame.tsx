"use client";

import dynamic from "next/dynamic";

const PhaserGame = dynamic(() => import("./PhaserGame"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-3">
        <div className="w-5 h-5 rounded-full border-2 border-vorryn-steel border-t-vorryn-glow-end animate-spin" />
        <span className="text-[10px] text-slate-600 tracking-widest uppercase font-sans">
          Forging the world…
        </span>
      </div>
    </div>
  ),
});

interface Props {
  warriorName: string;
  stage: number;
  hudHeight?: number;
}

export default function VorrynGame({ warriorName, stage, hudHeight = 56 }: Props) {
  return (
    <div
      style={{
        height: `calc(100vh - ${hudHeight}px)`,
        width: "100vw",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <PhaserGame warriorName={warriorName} stage={stage} />
    </div>
  );
}
