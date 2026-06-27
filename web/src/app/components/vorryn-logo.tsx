"use client";

import React from "react";

interface VorrynLogoProps {
  className?: string;
  size?: number;
}

export default function VorrynLogo({ className = "", size = 320 }: VorrynLogoProps) {
  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Outer ambient glow behind the logo image */}
      <div className="absolute inset-0 rounded-full bg-radial from-vorryn-glow-start/15 to-transparent blur-3xl opacity-70 scale-110 animate-pulse duration-8000" />

      {/* Main Logo Image with custom filters */}
      <div className="relative w-full h-full p-6 flex items-center justify-center">
        <img
          src="/icon.png"
          alt="Vorryn Logo"
          className="w-full h-full object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.98)] drop-shadow-[0_0_20px_rgba(194,65,12,0.3)] select-none pointer-events-none"
        />
        
        
       

        
       
      </div>
    </div>
  );
}
