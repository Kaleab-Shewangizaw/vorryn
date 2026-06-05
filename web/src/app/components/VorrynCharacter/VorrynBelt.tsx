// Layer 2: Belt — swappable across stages
// Stage 1: Simple rope/cloth tie
// Stage 3: Old leather belt with buckle
// Stage 5: Plated battle girdle

interface VorrynBeltProps {
  stage?: 1 | 2 | 3 | 4 | 5;
}

const BELT_ASSETS: Record<number, string> = {
  1: "/char-belt-1.png",  // rope/cloth
  2: "/char-belt-2.png",  // crude leather
  3: "/char-belt-3.png",  // leather buckle
  4: "/char-belt-4.png",  // reinforced leather
  5: "/char-belt-5.png",  // plated girdle
};

export default function VorrynBelt({ stage = 1 }: VorrynBeltProps) {
  const src = BELT_ASSETS[stage] ?? BELT_ASSETS[1];
  if (!src) return null;
  return null; // TODO: replace with <img> once isolated asset exists
  /* return (
    <img
      src={src}
      alt={`Vorryn belt stage ${stage}`}
      className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
      draggable={false}
    />
  ); */
}
