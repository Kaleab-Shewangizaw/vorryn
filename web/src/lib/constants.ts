export const APP_NAME = "Vorryn" as const;

export const COLORS = {
  bg: "#000000",
  dark: "#0a0a0a",
  steel: "#4a5568",
  glowStart: "#c2410c",
  glowEnd: "#f97316",
  ember: "#dc2626",
  text: "#e2e8f0",
  textMuted: "#94a3b8",
  textFaint: "#475569",
} as const;

export type Stage = {
  readonly id: number;
  readonly label: string;
  readonly title: string;
  readonly description: string;
  readonly threshold: number;
};

export const STAGES: readonly Stage[] = [
  {
    id: 1,
    label: "Ashen Recruit",
    title: "The Uninitiated",
    description: "Ember barely alive. The path has not yet been chosen.",
    threshold: 0,
  },
  {
    id: 2,
    label: "Iron Warden",
    title: "The Tempered",
    description: "Cold iron begins to take shape. The forge recognizes you.",
    threshold: 20,
  },
  {
    id: 3,
    label: "Ember Knight",
    title: "The Forged",
    description: "Flame and steel bind as one. You move with ancient purpose.",
    threshold: 45,
  },
  {
    id: 4,
    label: "Vorryn Sentinel",
    title: "The Ancient",
    description: "The darkness knows your name. You have become the threshold.",
    threshold: 70,
  },
  {
    id: 5,
    label: "Eclipse Champion",
    title: "The Undying",
    description: "Neither flame nor shadow can claim you. You are Vorryn.",
    threshold: 90,
  },
] as const;

export function getStageForProgress(progress: number): Stage {
  return (
    [...STAGES].reverse().find((s) => progress >= s.threshold) ?? STAGES[0]
  );
}
