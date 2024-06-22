import mongoose, { Schema, Document } from "mongoose";

export interface EventType {
  // id: string;
  title: string;
  start: String;
  end: String;
  // allDay:Boolean,
  description: String;
}

const eventSchema = new Schema({
  // id: { type: String, unique: true, required: true },
  title: { type: String },
  start: { type: String },
  end: { type: String },
  description: { type: String },
});

const EventModal = mongoose.model("EventModal", eventSchema);

export default EventModal;
