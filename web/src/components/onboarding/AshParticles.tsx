"use client";

import { useMemo } from "react";

type Density = "low" | "medium" | "high";

const DENSITY_COUNT: Record<Density, number> = {
  low: 10,
  medium: 22,
  high: 42,
};

const EMBER_COLORS = ["#f97316", "#c2410c", "#dc2626"];
const ASH_COLORS = ["#475569", "#334155", "#64748b", "#94a3b8"];

interface Particle {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
  color: string;
  sway: number;
  isEmber: boolean;
}

interface AshParticlesProps {
  density?: Density;
  className?: string;
}

export default function AshParticles({
  density = "medium",
  className = "",
}: AshParticlesProps) {
  const count = DENSITY_COUNT[density];

  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: count }, (_, i) => {
      const isEmber = Math.random() < 0.3;
      return {
        id: i,
        left: Math.random() * 100,
        delay: -(Math.random() * 22),
        duration: 12 + Math.random() * 14,
        size: isEmber ? 1.5 + Math.random() * 2 : 2 + Math.random() * 3.5,
        color: isEmber
          ? EMBER_COLORS[Math.floor(Math.random() * EMBER_COLORS.length)]
          : ASH_COLORS[Math.floor(Math.random() * ASH_COLORS.length)],
        sway: (Math.random() - 0.5) * 80,
        isEmber,
      };
    });
  }, [count]);

  return (
    <div
      aria-hidden
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
    >
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute bottom-0 rounded-full"
          style={
            {
              left: `${p.left}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              background: p.color,
              boxShadow: p.isEmber ? `0 0 ${p.size * 2}px ${p.color}88` : "none",
              animationName: "ash-float",
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              animationTimingFunction: "linear",
              animationIterationCount: "infinite",
              animationFillMode: "both",
              "--sway": `${p.sway}px`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
