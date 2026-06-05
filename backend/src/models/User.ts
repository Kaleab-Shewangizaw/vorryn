import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  username: string;
  email: string;
  passwordHash: string;
  characterName: string;
  faction: "ashen" | "iron" | "eclipse" | null;
  characterStage: 1 | 2 | 3 | 4 | 5;
  hasSeenIntro: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Instance method
  comparePassword(candidate: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 2,
      maxlength: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    characterName: {
      type: String,
      default: "",
    },
    faction: {
      type: String,
      enum: ["ashen", "iron", "eclipse", null],
      default: null,
    },
    characterStage: {
      type: Number,
      enum: [1, 2, 3, 4, 5],
      default: 1,
    },
    hasSeenIntro: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("passwordHash")) return next();
  const salt = await bcrypt.genSalt(12);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  next();
});

// Compare plain password against stored hash
UserSchema.methods.comparePassword = async function (
  candidate: string
): Promise<boolean> {
  return bcrypt.compare(candidate, this.passwordHash);
};

// Never expose passwordHash in JSON responses
UserSchema.set("toJSON", {
  transform: (_doc, ret) => {
    delete ret.passwordHash;
    return ret;
  },
});

export const User = mongoose.model<IUser>("User", UserSchema);
export default User;
