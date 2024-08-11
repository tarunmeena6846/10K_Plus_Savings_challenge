// swotDetailsModel.ts
import mongoose, { Document, Schema, Types } from "mongoose";

export interface Task extends Document {
  title: string;
  isComplete: boolean;
  dueDate?: string;
  _id: Schema.Types.ObjectId;
}

export interface SwotDetails extends Document {
  userId: string;
  tasks: Task[];
  isReminderSet: boolean;
  // email: string;
  _id: Schema.Types.ObjectId;
}

const swotDetailsSchema = new Schema<SwotDetails>({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  tasks: [{ title: String, isComplete: Boolean, dueDate: String }],
  isReminderSet: { type: Boolean, default: false },
  // email: { type: String, required: true },
});

const SwotDetailsModel = mongoose.model<SwotDetails>(
  "SwotDetails",
  swotDetailsSchema
);

export default SwotDetailsModel;
