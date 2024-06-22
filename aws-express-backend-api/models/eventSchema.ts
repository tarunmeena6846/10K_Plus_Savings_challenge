import mongoose, { Schema, Document } from "mongoose";

export interface EventType {
  // id: string;
  title: string;
  startTime: String;
  endTime: String;
  // allDay:Boolean,
  description: String;
}

const eventSchema = new Schema({
  // id: { type: String, unique: true, required: true },
  title: { type: String },
  startTime: { type: String },
  endTime: { type: String },
  description: { type: String },
});

const EventModal = mongoose.model("EventModal", eventSchema);

export default EventModal;
