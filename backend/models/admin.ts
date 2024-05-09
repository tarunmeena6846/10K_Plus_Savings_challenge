import mongoose, { Document, Schema } from "mongoose";
import SwotDetailsModel, { SwotDetails } from "./swotModel";

export interface Admin extends Document {
  username: string;
  password: string;
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
  password: {
    type: String,
    // unique: true,
    required: true,
  },
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
// adminSchema.post("findOneAndUpdate", async function (updatedAdmin) {
//   try {
//     // Fetch the updated admin document
//     const AdminModel = this.model("Admin");
//     const admin = await AdminModel.findById(updatedAdmin._id);

//     if (admin) {
//       // Update the userImage field in the associated posts
//       const PostModel = mongoose.model("Post");
//       await PostModel.updateMany(
//         { author: admin.username },
//         { userImage: admin.imageUrl }
//       );
//     }
//   } catch (error) {
//     console.error("Error updating associated posts:", error);
//   }
// });
const AdminModel = mongoose.model<Admin>("Admin", adminSchema);

export default AdminModel;
