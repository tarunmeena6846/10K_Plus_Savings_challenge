import mongoose, { Document, Schema, Types } from "mongoose";
import SwotDetailsModel, { SwotDetails } from "./swotModel";

export interface EmailReminder extends Document {
  // lastNotifiedDate?: Date;
  reminderEnabled: Boolean;
}
export interface VideoModalTypes {
  dashboardVideoModal: Boolean;
}
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
  swotTasksDetails: Schema.Types.ObjectId;
  myPosts: Schema.Types.ObjectId[];
  myDrafts: Schema.Types.ObjectId[];
  videoModalSettings: VideoModalTypes;
  // isSubscribedForReminder?: Boolean;
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
  videoModalSettings: { dashboardVideoModal: { type: Boolean, default: true } },
  imageUrl: String,
  stripePlanId: String,
  stripeUserId: String,
  isSubscribed: Boolean,
  // isSubscribedForReminder: Boolean,
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

// // export default AdminModel;
// const NotificationType = {
//   WEEKLY_REMINDER: "weeklyReminder",
//   SWOT_REMINDER: "swotReminder",
//   ADMIN_POST_NOTIFICATION: "adminPostNotification",
//   COMMUNITY_NOTIFICATION: "communityNotification",
// };

const NotificationSchema = new Schema({
  userEmail: { type: String, required: true, unique: true },
  type: {
    taskListReminder: { type: Boolean, default: true },
    adminPost: { type: Boolean, default: true },
    groupPost: { type: Boolean, default: true },
    monthlySwot: { type: Boolean, default: true },
  },
});

const NotificationModel = mongoose.model("Notification", NotificationSchema);

export { NotificationModel, AdminModel };
