import mongoose, { Document, Schema } from "mongoose";

export interface IUserProfile extends Document {
  userId: string; // Better Auth user id
  warriorName: string;
  stage: 1 | 2 | 3 | 4 | 5;
  totalDefeated: number;
  joinedAt: Date;
}

const UserProfileSchema = new Schema<IUserProfile>({
  userId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  warriorName: {
    type: String,
    default: "",
    maxlength: 24,
  },
  stage: {
    type: Number,
    enum: [1, 2, 3, 4, 5],
    default: 1,
  },
  totalDefeated: {
    type: Number,
    default: 0,
    min: 0,
  },
  joinedAt: {
    type: Date,
    default: () => new Date(),
  },
});

export const UserProfile =
  (mongoose.models.UserProfile as mongoose.Model<IUserProfile> | undefined) ??
  mongoose.model<IUserProfile>("UserProfile", UserProfileSchema);
