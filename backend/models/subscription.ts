import mongoose, { Document, Schema } from "mongoose";

export interface Subscription extends Document {
  planId: string;
  userId: string;
  isSubscribed: Boolean;
  // Add more fields as needed
}

const subscriptionSchema = new Schema<Subscription>({
  planId: {
    type: String,
    // ref: "Plan", // Assuming you have a Plan schema for storing plan details
    required: true,
  },
  userId: {
    type: String,
    // ref: "User", // Assuming you have a User schema for storing user details
    required: true,
  },
  isSubscribed: {
    type: Boolean,
    default: false, // You can update the status based on subscription events
  },
  // Add more fields as needed
});

const SubscriptionModel = mongoose.model<Subscription>(
  "Subscription",
  subscriptionSchema
);

export default SubscriptionModel;
