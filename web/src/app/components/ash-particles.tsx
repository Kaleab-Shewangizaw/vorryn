"use client";

import React, { useEffect, useRef } from "react";

interface AshParticlesProps {
  logoSize?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  swaySpeed: number;
  swayOffset: number;
  type: "ember" | "ash" | "smoke";
  maxLife: number;
  life: number;
}

export default function AshParticles({ logoSize = 320 }: AshParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    
    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Particle factory helper
    const createParticle = (type: "ember" | "ash" | "smoke", emitterX: number, emitterY: number): Particle => {
      const life = 0;
      if (type === "ember") {
        // Bright orange sparks rising from logo tip
        const maxLife = 100 + Math.random() * 80;
        return {
          x: emitterX + (Math.random() - 0.5) * 8, // slight offset around tip
          y: emitterY - 10,
          vx: (Math.random() - 0.5) * 0.8,
          vy: -1.2 - Math.random() * 1.5, // rise upward
          size: 1 + Math.random() * 2.2,
          color: Math.random() > 0.3 ? "#f97316" : "#ffedd5", // orange or white/yellow hot
          alpha: 0.8 + Math.random() * 0.2,
          decay: 1 / maxLife,
          swaySpeed: 0.02 + Math.random() * 0.03,
          swayOffset: Math.random() * Math.PI * 2,
          type,
          maxLife,
          life,
        };
      } else if (type === "smoke") {
        // Faint smoke plumes rising from logo tip
        const maxLife = 150 + Math.random() * 120;
        return {
          x: emitterX + (Math.random() - 0.5) * 12,
          y: emitterY - 8,
          vx: (Math.random() - 0.5) * 0.4,
          vy: -0.5 - Math.random() * 0.6,
          size: 10 + Math.random() * 25,
          color: Math.random() > 0.5 ? "#c2410c" : "#1e293b", // faint ember smoke or dark grey smoke
          alpha: 0.05 + Math.random() * 0.08,
          decay: 1 / maxLife,
          swaySpeed: 0.005 + Math.random() * 0.01,
          swayOffset: Math.random() * Math.PI * 2,
          type,
          maxLife,
          life,
        };
      } else {
        // Global ambient drifting ashes across the screen
        const maxLife = 200 + Math.random() * 250;
        return {
          x: Math.random() * canvas.width,
          y: canvas.height + 20, // start below screen
          vx: (Math.random() - 0.4) * 0.5,
          vy: -0.4 - Math.random() * 0.8, // slow rise
          size: 1.5 + Math.random() * 3.5,
          color: Math.random() > 0.4 ? "#475569" : "#dc2626", // grey steel or deep red dark ember
          alpha: 0.2 + Math.random() * 0.3,
          decay: 1 / maxLife,
          swaySpeed: 0.01 + Math.random() * 0.01,
          swayOffset: Math.random() * Math.PI * 2,
          type,
          maxLife,
          life,
        };
      }
    };

    // Animation Loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Determine logo tip position in screen coordinates
      // The logo is centered on screen.
      const emitterX = canvas.width / 2;
      
      // Let's calculate vertical tip location:
      // In Step 1, the logo is centered. Let's calculate its exact Y tip based on logo sizing.
      // The SVG has height 240, and the tip is around Y=210.
      // So the tip is at ~87.5% of the logo's height.
      // If the logo is centered, it starts around (height/2 - logoSize/2)
      // So emitterY = (canvas.height / 2) - (logoSize / 2) + (logoSize * 0.84)
      // However, we might adjust logo centering depending on the onboarding step.
      // Let's read the current layout: logo is centered vertically in step 1, top-anchored in steps 2/3.
      // We can detect if there's a custom logo location or simply query the DOM!
      // This is a robust way to make particles follow the logo across different screens!
      const logoEl = document.querySelector(".vorryn-logo-container");
      let logoEmitterY = canvas.height * 0.5 + 110; // fallback

      if (logoEl) {
        const rect = logoEl.getBoundingClientRect();
        // The tip is at the bottom center of the VorrynLogo component
        // Since VorrynLogo is size x size (e.g. 320x320), the V tip is located around 81% of its height
        logoEmitterY = rect.top + rect.height * 0.81;
      }

      // Emitter Rate Control
      // Spawning tip embers
      if (Math.random() < 0.6) {
        particles.push(createParticle("ember", emitterX, logoEmitterY));
      }
      // Spawning tip smoke
      if (Math.random() < 0.25) {
        particles.push(createParticle("smoke", emitterX, logoEmitterY));
      }
      // Spawning ambient global ash
      if (particles.filter(p => p.type === "ash").length < 40 && Math.random() < 0.15) {
        particles.push(createParticle("ash", emitterX, logoEmitterY));
      }

      // Draw and Update Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life += 1;

        // Apply sway/wind effect
        const sway = Math.sin(p.life * p.swaySpeed + p.swayOffset) * (p.type === "smoke" ? 0.3 : 0.4);
        p.x += p.vx + sway;
        p.y += p.vy;

        // Fade out near end of life
        const ageRatio = p.life / p.maxLife;
        let currentAlpha = p.alpha * (1 - ageRatio);
        if (currentAlpha < 0) currentAlpha = 0;

        // Render based on type
        ctx.save();
        ctx.globalAlpha = currentAlpha;

        if (p.type === "smoke") {
          // Smoke is a soft blurry radial gradient
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
          grad.addColorStop(0, p.color);
          grad.addColorStop(1, "transparent");
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === "ember") {
          // Ember is a small bright glowing circle
          ctx.shadowBlur = p.size * 3;
          ctx.shadowColor = p.color === "#ffedd5" ? "#f97316" : "#dc2626";
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Ash is a irregular dark/red speck
          ctx.fillStyle = p.color;
          ctx.beginPath();
          // Draw slightly elongated specks for falling/drifting feel
          ctx.ellipse(p.x, p.y, p.size, p.size * 0.6, Math.PI / 4, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();

        // Remove dead or out-of-bounds particles
        if (p.life >= p.maxLife || p.y < -50 || p.x < -50 || p.x > canvas.width + 50) {
          particles.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [logoSize]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
