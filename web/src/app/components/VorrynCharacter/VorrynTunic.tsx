// Layer 1: Tunic — swappable across stages
// Stage 1: Worn ancient cloth (current art — full character used as reference)
// Stage 3: Reinforced leather
// Stage 5: Full armor plate
// When isolated tunic PNGs are ready, swap src per stage.

interface VorrynTunicProps {
  stage?: 1 | 2 | 3 | 4 | 5;
}

const TUNIC_ASSETS: Record<number, string> = {
  1: "/char-tunic-1.png",  // worn cloth (placeholder: not yet isolated)
  2: "/char-tunic-2.png",  // reinforced cloth
  3: "/char-tunic-3.png",  // leather
  4: "/char-tunic-4.png",  // dark leather
  5: "/char-tunic-5.png",  // armor plate
};

export default function VorrynTunic({ stage = 1 }: VorrynTunicProps) {
  const src = TUNIC_ASSETS[stage] ?? TUNIC_ASSETS[1];
  // While individual layer PNGs are not yet available, this renders nothing
  // (the base composite image already includes the tunic at stage 1).
  // Uncomment the img when isolated layer assets are ready.
  if (!src) return null;
  return null; // TODO: replace with <img> once isolated asset exists
  /* return (
    <img
      src={src}
      alt={`Vorryn tunic stage ${stage}`}
      className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
      draggable={false}
    />
  ); */
}
