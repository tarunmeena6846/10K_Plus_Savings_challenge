import mongoose, { Document, Schema } from "mongoose";

export interface Admin extends Document {
  username: string;
  password: string;
  imageUrl?: string;
  subscriptions: Schema.Types.ObjectId[];
}

const adminSchema = new Schema<Admin>({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: String,
  imageUrl: String,
  subscriptions: [
    {
      type: Schema.Types.ObjectId,
      ref: "Subscription",
    },
  ],
});

const AdminModel = mongoose.model<Admin>("Admin", adminSchema);

export default AdminModel;
