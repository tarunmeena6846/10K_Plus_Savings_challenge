import mongoose, { Document, Schema } from "mongoose";
import SwotDetailsModel, { SwotDetails } from "./swotModel";

export interface Admin extends Document {
  username: string;
  email: string;
  password: string;
  isAdmin: Boolean;
  resetPasswordToken: String;
  resetPasswordTokenUsed: Boolean;
  imageUrl?: string;
  verified: Boolean;
  // subscriptions: Schema.Types.ObjectId[];
  stripePlanId?: string;
  stripeUserId?: string;
  isSubscribed?: Boolean;
  isTopTier: Boolean;
  verificationToken: string;
  myWhy: string;
  swotSessionTime: Date;
  bookmarkedPosts: Schema.Types.ObjectId[];
  swotTasksDetails: Schema.Types.ObjectId | null;
  myPosts: Schema.Types.ObjectId[];
  myDrafts: Schema.Types.ObjectId[];
}

const adminSchema = new Schema<Admin>({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: { type: Boolean, default: false },
  resetPasswordToken: { type: String },
  resetPasswordTokenUsed: { type: Boolean },
  imageUrl: String,
  stripePlanId: String,
  stripeUserId: String,
  isSubscribed: Boolean,
  verified: { type: Boolean, default: false },
  verificationToken: { type: String },
  isTopTier: { type: Boolean, default: false },
  myWhy: { type: String, default: "" },
  swotSessionTime: Date,
  bookmarkedPosts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  swotTasksDetails: {
    type: Schema.Types.ObjectId,
    ref: "SwotDetails",
    default: null,
  },
  myPosts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
  myDrafts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
});

const AdminModel = mongoose.model<Admin>("Admin", adminSchema);

export default AdminModel;
