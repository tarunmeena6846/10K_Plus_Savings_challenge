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
}

const swotDetailsSchema = new Schema<SwotDetails>({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  tasks: [{ title: String, isComplete: Boolean, dueDate: String }],
  isReminderSet: { type: Boolean, default: false },
});

const SwotDetailsModel = mongoose.model<SwotDetails>(
  "SwotDetails",
  swotDetailsSchema
);

export default SwotDetailsModel;
