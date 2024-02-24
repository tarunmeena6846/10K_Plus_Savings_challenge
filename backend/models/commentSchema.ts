import mongoose, { Document, Schema } from "mongoose";
import { Admin } from "./admin";

export interface CommentDocument extends Document {
  id: string; // Define the _id property
  content: string;
  author: Admin["_id"];
  createdAt: Date;
  likes: Number;
  imageLink: string;
}
const commentSchema = new mongoose.Schema({
  id: { type: String, required: true },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin", // Reference to the User model
    required: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post", // Reference to the Post model
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  likes: {
    type: Number,
    default: 0,
  },
  imageLink: {
    type: String,
    default: "",
  },
});

const Comment = mongoose.model<CommentDocument>("Comment", commentSchema);

export default Comment;
