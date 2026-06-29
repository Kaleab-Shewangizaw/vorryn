"use client";

import { useEffect, useRef } from "react";
import type Phaser from "phaser";
import { MainScene } from "./scenes/MainScene";

interface Props {
  warriorName: string;
  stage: number;
}

export default function PhaserGame({ warriorName, stage }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return;

    const container = containerRef.current;

    // Phaser must be imported at runtime (browser only)
    import("phaser").then((PhaserModule) => {
      const PhaserLib = PhaserModule.default;

      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;

      const config: Phaser.Types.Core.GameConfig = {
        type: PhaserLib.WEBGL,
        parent: container,
        width: w,
        height: h,
        backgroundColor: "#000000",
        physics: {
          default: "arcade",
          arcade: {
            gravity: { x: 0, y: 600 },
            debug: false,
          },
        },
        scene: [MainScene],
        scale: {
          mode: PhaserLib.Scale.NONE,
          autoCenter: PhaserLib.Scale.CENTER_BOTH,
        },
        render: {
          antialias: false,
          pixelArt: false,
        },
      };

      const game = new PhaserLib.Game(config);
      game.registry.set("warriorName", warriorName);
      game.registry.set("stage", stage);
      gameRef.current = game;
    });

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
    // Only run once on mount — warriorName/stage updated separately below
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync prop changes into Phaser's registry without re-creating the game
  useEffect(() => {
    if (gameRef.current) {
      gameRef.current.registry.set("warriorName", warriorName);
      gameRef.current.registry.set("stage", stage);
    }
  }, [warriorName, stage]);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "100%", overflow: "hidden" }}
    />
  );
}
