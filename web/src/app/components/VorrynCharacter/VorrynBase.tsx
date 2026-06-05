// Layer 0: Base body + face — never changes between stages
// Replace /char-base.png with the isolated body/face layer PNG when available.
export default function VorrynBase() {
  return (
    <img
      src="/char-base.png"
      alt="Vorryn base body"
      className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
      draggable={false}
    />
  );
}
