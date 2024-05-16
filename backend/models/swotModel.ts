// swotDetailsModel.ts
import mongoose, { Document, Schema } from "mongoose";

export interface Task extends Document {
  title: string;
  isComplete: boolean;
  dueDate?: string;
}

export interface SwotDetails extends Document {
  userId: string;
  tasks: Task[];
  isReminderSet: boolean;
  email: string;
}

const swotDetailsSchema = new Schema<SwotDetails>({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  tasks: [{ title: String, isComplete: Boolean, dueDate: String }],
  isReminderSet: { type: Boolean, default: false },
  email: { type: String, required: true },
});

const SwotDetailsModel = mongoose.model<SwotDetails>(
  "SwotDetails",
  swotDetailsSchema
);

export default SwotDetailsModel;
