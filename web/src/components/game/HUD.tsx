"use client";

import VorrynLogo from "@/app/components/vorryn-logo";
import { STAGES } from "@/lib/constants";

const HUD_HEIGHT = 56;

interface Props {
  warriorName: string;
  stage: number;
  enemiesRemaining?: number;
}

export default function HUD({ warriorName, stage, enemiesRemaining = 0 }: Props) {
  const stageData = STAGES.find((s) => s.id === stage) ?? STAGES[0];

  return (
    <div
      style={{
        height: HUD_HEIGHT,
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        backgroundColor: "rgba(0,0,0,0.92)",
        borderBottom: "1px solid #c2410c",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
      }}
    >
      {/* Left: logo + warrior name + stage */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <VorrynLogo size={32} />
        <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <span
            className="font-cinzel"
            style={{
              fontSize: 13,
              fontWeight: 800,
              color: "#e2e8f0",
              letterSpacing: "0.12em",
            }}
          >
            {warriorName || "WARRIOR"}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span
              style={{
                fontSize: 9,
                fontFamily: "var(--font-sans, sans-serif)",
                color: "#f97316",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
              }}
            >
              Stage {stage}
            </span>
            <span
              style={{
                display: "inline-block",
                padding: "1px 7px",
                borderRadius: 999,
                border: "1px solid rgba(194,65,12,0.5)",
                backgroundColor: "rgba(194,65,12,0.12)",
                fontSize: 9,
                fontFamily: "var(--font-cinzel, serif)",
                color: "#f97316",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
              }}
            >
              {stageData.label}
            </span>
          </div>
        </div>
      </div>

      {/* Right: enemies remaining */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2 }}>
        <span
          className="font-cinzel"
          style={{
            fontSize: 18,
            fontWeight: 900,
            color: enemiesRemaining > 0 ? "#dc2626" : "#4a5568",
            letterSpacing: "0.08em",
            lineHeight: 1,
          }}
        >
          {enemiesRemaining}
        </span>
        <span
          style={{
            fontSize: 9,
            fontFamily: "var(--font-sans, sans-serif)",
            color: "#4a5568",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
        >
          {enemiesRemaining === 1 ? "enemy" : "enemies"} remaining
        </span>
      </div>
    </div>
  );
}

export { HUD_HEIGHT };
