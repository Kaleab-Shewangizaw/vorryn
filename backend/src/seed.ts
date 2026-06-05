/**
 * Seed script — creates the default Vorryn player.
 * Run: npm run seed
 *
 * Credentials:
 *   username : vorryn
 *   password : ember2026
 */
import "dotenv/config";
import { connectDB } from "./config/db";
import { User } from "./models/User";

async function seed() {
  await connectDB();

  const existing = await User.findOne({ username: "vorryn" });
  if (existing) {
    console.log("⚡  Seed user already exists — skipping.");
    process.exit(0);
  }

  const user = await User.create({
    username: "vorryn",
    email: "vorryn@eclipse.org",
    passwordHash: "ember2026",   // pre-save hook hashes this
    characterName: "ALDRIC",
    faction: "ashen",
    characterStage: 1,
    hasSeenIntro: false,
  });

  console.log("\n✓ Seed user created:");
  console.log(`  username  : ${user.username}`);
  console.log(`  email     : ${user.email}`);
  console.log(`  password  : ember2026`);
  console.log(`  character : ${user.characterName}`);
  console.log(`  faction   : ${user.faction}\n`);

  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
