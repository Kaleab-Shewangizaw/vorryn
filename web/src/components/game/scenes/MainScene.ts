import Phaser from "phaser";

// ─────────────────────────────────────────────────────────────────
// World & physics
// ─────────────────────────────────────────────────────────────────
const WORLD_W = 4000;
const WORLD_H = 1800;
const GRAVITY = 600;

// ─────────────────────────────────────────────────────────────────
// Ground
// ─────────────────────────────────────────────────────────────────
const GROUND_Y = 1720;
const GROUND_H = 80;

// ─────────────────────────────────────────────────────────────────
// Platforms
// ─────────────────────────────────────────────────────────────────
const PLATFORM_H = 40;

// ─────────────────────────────────────────────────────────────────
// Player
// Spritesheet: vorryn-sheet.png — 5 cols × 3 rows, 192×256 per frame
// ─────────────────────────────────────────────────────────────────
const FRAME_W = 192;
const FRAME_H = 256;
const PLAYER_DISPLAY_W = 72;
const PLAYER_DISPLAY_H = 96;   // maintains 3:4 ratio with FRAME_W:FRAME_H
const BODY_W = 40;
const BODY_H = 80;
const PLAYER_SPEED = 220;
const JUMP_VY = -520;
const CLIMB_SPEED = 150;

// ─────────────────────────────────────────────────────────────────
// Buildings
// ─────────────────────────────────────────────────────────────────
const BUILDING_X = [300, 700, 1100, 1600, 2200, 2800, 3400] as const;
const TALL_SET = new Set<number>([1100, 2200, 3400]);

// ─────────────────────────────────────────────────────────────────
// Torches
// ─────────────────────────────────────────────────────────────────
const GROUND_TORCH_X = [400, 800, 1200, 1800, 2400, 3000, 3600] as const;
const GROUND_TORCH_Y = 1640;
const TORCH_W = 36;
const TORCH_H = 72;

// ─────────────────────────────────────────────────────────────────
// Type helpers
// ─────────────────────────────────────────────────────────────────
type PlatformDef = { cx: number; cy: number; width: number };

// ─────────────────────────────────────────────────────────────────
// MainScene
// ─────────────────────────────────────────────────────────────────
export class MainScene extends Phaser.Scene {
  // ── Parallax layers ─────────────────────────────────────────────
  private bgFar!: Phaser.GameObjects.TileSprite;
  private bgMid!: Phaser.GameObjects.TileSprite;

  // ── Physics groups ──────────────────────────────────────────────
  private platformGroup!: Phaser.Physics.Arcade.StaticGroup;
  private ladderGroup!: Phaser.Physics.Arcade.StaticGroup;

  // ── Player ──────────────────────────────────────────────────────
  private player!: Phaser.Physics.Arcade.Sprite;

  // ── Input ───────────────────────────────────────────────────────
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: {
    up: Phaser.Input.Keyboard.Key;
    down: Phaser.Input.Keyboard.Key;
    left: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
  };

  // ── Lights ──────────────────────────────────────────────────────
  private torchLights: Phaser.GameObjects.PointLight[] = [];

  // ── State ───────────────────────────────────────────────────────
  private isJumping = false;

  constructor() {
    super({ key: "MainScene" });
  }

  // ─────────────────────────────────────────────────────────────────
  // PRELOAD
  // All assets are pre-processed PNGs with transparent backgrounds —
  // no runtime pixel-stripping needed.
  // ─────────────────────────────────────────────────────────────────
  preload(): void {
    // Background layers — dark JPGs, used directly
    this.load.image("bg-far",  "/game/bg-far.jpg");
    this.load.image("bg-mid",  "/game/bg-mid.png");   // PNG with transparent sky → bg-far shows through

    // Sprite assets — pre-processed PNGs with transparency
    this.load.spritesheet("vorryn", "/game/vorryn-sheet.png", {
      frameWidth:  FRAME_W,   // 192 px per frame (5-column sheet)
      frameHeight: FRAME_H,   // 256 px per frame (3-row sheet)
    });
    this.load.image("ground", "/game/ground-tile.png");
    this.load.image("ladder", "/game/ladder-tile.png");
    this.load.image("torch",  "/game/torch.png");
  }

  // ─────────────────────────────────────────────────────────────────
  // CREATE
  // ─────────────────────────────────────────────────────────────────
  create(): void {
    const SW = this.scale.width;
    const SH = this.scale.height;

    // ── Parallax backgrounds (screen-space, scrollFactor 0) ────────
    this.bgFar = this.add
      .tileSprite(0, 0, SW, SH, "bg-far")
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setDepth(0);

    this.bgMid = this.add
      .tileSprite(0, 0, SW, SH, "bg-mid")
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setDepth(1);

    // ── Physics world ──────────────────────────────────────────────
    this.physics.world.setBounds(0, 0, WORLD_W, WORLD_H);
    this.physics.world.gravity.y = GRAVITY;

    // ── Groups ─────────────────────────────────────────────────────
    this.platformGroup = this.physics.add.staticGroup();
    this.ladderGroup   = this.physics.add.staticGroup();

    // ── Ground floor ───────────────────────────────────────────────
    this.spawnPlatform(WORLD_W / 2, GROUND_Y, WORLD_W, GROUND_H);

    // ── Buildings ──────────────────────────────────────────────────
    for (const bx of BUILDING_X) {
      this.spawnBuilding(bx);
    }

    // ── Ground-level torches ───────────────────────────────────────
    for (const tx of GROUND_TORCH_X) {
      this.spawnTorch(tx, GROUND_TORCH_Y);
    }

    // ── Player ─────────────────────────────────────────────────────
    this.player = this.physics.add.sprite(200, 1600, "vorryn");
    this.player
      .setCollideWorldBounds(true)
      .setDepth(10)
      .setDisplaySize(PLAYER_DISPLAY_W, PLAYER_DISPLAY_H)
      .setMaxVelocity(PLAYER_SPEED, 900);

    const body = this.player.body as Phaser.Physics.Arcade.Body;
    body.setSize(BODY_W, BODY_H);
    // offsetY = displayH - bodyH puts the body flush with the sprite's visual bottom,
    // so the player's feet land exactly on the platform surface (not floating above it).
    body.setOffset(
      (PLAYER_DISPLAY_W - BODY_W) / 2,
      PLAYER_DISPLAY_H - BODY_H,
    );

    // ── Animations ─────────────────────────────────────────────────
    this.buildAnimations();
    this.player.play("idle");

    // ── Collisions ─────────────────────────────────────────────────
    this.physics.add.collider(this.player, this.platformGroup);

    // ── Camera ─────────────────────────────────────────────────────
    this.cameras.main
      .setBounds(0, 0, WORLD_W, WORLD_H)
      .startFollow(this.player, true, 0.1, 0.1)
      .setZoom(1);

    // ── Input ──────────────────────────────────────────────────────
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasd = this.input.keyboard!.addKeys({
      up:    Phaser.Input.Keyboard.KeyCodes.W,
      down:  Phaser.Input.Keyboard.KeyCodes.S,
      left:  Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    }) as {
      up:    Phaser.Input.Keyboard.Key;
      down:  Phaser.Input.Keyboard.Key;
      left:  Phaser.Input.Keyboard.Key;
      right: Phaser.Input.Keyboard.Key;
    };
  }

  // ─────────────────────────────────────────────────────────────────
  // UPDATE
  // ─────────────────────────────────────────────────────────────────
  update(): void {
    const body    = this.player.body as Phaser.Physics.Arcade.Body;
    const onGround = body.blocked.down;
    const onLadder = this.detectLadder(body);

    // ── Input ──────────────────────────────────────────────────────
    const goLeft  = this.cursors.left.isDown  || this.wasd.left.isDown;
    const goRight = this.cursors.right.isDown || this.wasd.right.isDown;
    const goUp    = this.cursors.up.isDown    || this.wasd.up.isDown;
    const goDown  = this.cursors.down.isDown  || this.wasd.down.isDown;
    const jumpPressed =
      Phaser.Input.Keyboard.JustDown(this.cursors.up) ||
      Phaser.Input.Keyboard.JustDown(this.wasd.up);

    // ── Ladder ─────────────────────────────────────────────────────
    if (onLadder && (goUp || goDown)) {
      body.setAllowGravity(false);
      this.player.setVelocityX(0);
      this.player.setVelocityY(goUp ? -CLIMB_SPEED : CLIMB_SPEED);
      this.player.play("climb", true);
    } else {
      // ── Normal movement ─────────────────────────────────────────
      body.setAllowGravity(true);

      if (goLeft) {
        this.player.setVelocityX(-PLAYER_SPEED);
        this.player.setFlipX(true);
        if (onGround && !this.isJumping) this.player.play("walk", true);
      } else if (goRight) {
        this.player.setVelocityX(PLAYER_SPEED);
        this.player.setFlipX(false);
        if (onGround && !this.isJumping) this.player.play("walk", true);
      } else {
        this.player.setVelocityX(0);
        if (onGround && !this.isJumping) this.player.play("idle", true);
      }

      if (this.isJumping && onGround) this.isJumping = false;

      if (jumpPressed && onGround) {
        this.player.setVelocityY(JUMP_VY);
        this.player.play("jump", true);
        this.isJumping = true;
      }

      if (!onGround && !this.isJumping) this.player.play("jump", true);
    }

    // ── Parallax ───────────────────────────────────────────────────
    const cx = this.cameras.main.scrollX;
    const cy = this.cameras.main.scrollY;
    this.bgFar.setTilePosition(cx * 0.1, cy * 0.05);
    this.bgMid.setTilePosition(cx * 0.3, cy * 0.1);

    // ── Torch flicker ──────────────────────────────────────────────
    for (const light of this.torchLights) {
      light.intensity = Phaser.Math.FloatBetween(0.13, 0.22);
    }
  }

  // ─────────────────────────────────────────────────────────────────
  // PRIVATE — world building
  // ─────────────────────────────────────────────────────────────────

  /**
   * AABB test: returns true if the player body overlaps any ladder zone.
   * Evaluated fresh every frame — no flag-latency issues.
   */
  private detectLadder(pb: Phaser.Physics.Arcade.Body): boolean {
    for (const child of this.ladderGroup.getChildren()) {
      const lb = (child as Phaser.Physics.Arcade.Sprite)
        .body as Phaser.Physics.Arcade.StaticBody;
      if (
        pb.x < lb.x + lb.width &&
        pb.x + pb.width > lb.x &&
        pb.y < lb.y + lb.height &&
        pb.y + pb.height > lb.y
      ) {
        return true;
      }
    }
    return false;
  }

  /**
   * TileSprite visual (depth 4) + invisible StaticGroup body for collision.
   */
  private spawnPlatform(
    cx: number,
    cy: number,
    width: number,
    height = PLATFORM_H,
  ): void {
    this.add
      .tileSprite(cx, cy, width, height, "ground")
      .setOrigin(0.5, 0.5)
      .setDepth(4);

    const spr = this.platformGroup.create(cx, cy, "ground") as Phaser.Physics.Arcade.Sprite;
    spr.setAlpha(0);
    // Explicitly size the static body to match the visual platform, then reposition it.
    const sb = spr.body as Phaser.Physics.Arcade.StaticBody;
    sb.setSize(width, height);
    sb.reset(cx, cy);
  }

  /**
   * Image visual (depth 3) + invisible StaticGroup body used for AABB
   * ladder detection only — no collider registered, player passes through.
   */
  private spawnLadder(cx: number, cy: number, height: number): void {
    this.add
      .image(cx, cy, "ladder")
      .setDisplaySize(40, height)
      .setOrigin(0.5, 0.5)
      .setDepth(3);

    const spr = this.ladderGroup.create(cx, cy, "ladder") as Phaser.Physics.Arcade.Sprite;
    spr.setAlpha(0);
    const sb = spr.body as Phaser.Physics.Arcade.StaticBody;
    sb.setSize(40, height);
    sb.reset(cx, cy);
  }

  /**
   * Torch sprite at explicit display size + PointLight at same position.
   */
  private spawnTorch(x: number, y: number): void {
    this.add.image(x, y, "torch").setDisplaySize(TORCH_W, TORCH_H).setDepth(6);

    const light = this.add.pointlight(x, y, 0xff5500, 40, 0.18);
    light.setDepth(7);
    this.torchLights.push(light);
  }

  /**
   * 3-floor building (4 for tall variants), ladders between each pair
   * of consecutive floors, torch on floor-2 surface.
   */
  private spawnBuilding(bx: number): void {
    const floors: PlatformDef[] = [
      { cx: bx,      cy: 1500, width: 400 },
      { cx: bx + 50, cy: 1300, width: 350 },
      { cx: bx,      cy: 1100, width: 300 },
    ];
    if (TALL_SET.has(bx)) {
      floors.push({ cx: bx + 50, cy: 900, width: 250 });
    }

    for (const f of floors) {
      this.spawnPlatform(f.cx, f.cy, f.width);
    }

    for (let i = 0; i < floors.length - 1; i++) {
      const lower = floors[i];
      const upper = floors[i + 1];
      const ladX  = lower.cx + lower.width / 2;
      const ladY  = (lower.cy + upper.cy) / 2;
      const ladH  = lower.cy - upper.cy;
      this.spawnLadder(ladX, ladY, ladH);
    }

    const f2 = floors[1];
    this.spawnTorch(f2.cx, f2.cy - PLATFORM_H / 2 - TORCH_H / 2);
  }

  // ─────────────────────────────────────────────────────────────────
  // PRIVATE — animations
  // 15 frames total (indices 0-14): 5 cols × 3 rows in vorryn-sheet.png
  //   Row 0 (0–4)  → idle / breathing cycle
  //   Row 1 (5–9)  → walk cycle
  //   Row 2 (10–14)→ jump / climb
  // ─────────────────────────────────────────────────────────────────

  private buildAnimations(): void {
    const defs = [
      { key: "idle",  start: 0,  end: 4,  rate: 6,  repeat: -1 },
      { key: "walk",  start: 5,  end: 9,  rate: 12, repeat: -1 },
      { key: "jump",  start: 10, end: 12, rate: 10, repeat: 0  },
      { key: "climb", start: 12, end: 14, rate: 8,  repeat: -1 },
    ] as const;

    for (const def of defs) {
      if (!this.anims.exists(def.key)) {
        this.anims.create({
          key:       def.key,
          frames:    this.anims.generateFrameNumbers("vorryn", {
            start: def.start,
            end:   def.end,
          }),
          frameRate: def.rate,
          repeat:    def.repeat,
        });
      }
    }
  }
}
