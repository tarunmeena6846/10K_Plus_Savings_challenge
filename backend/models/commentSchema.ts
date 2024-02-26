import mongoose, { Document, Schema, Types } from "mongoose";
import { Admin } from "./admin";

// Define the interface for a comment document
export interface CommentDocument extends Document {
  content: string;
  author: string;
  post: String;
  createdAt: Date;
  likes: number;
  imageLink: string;
  parentId: string;
}

// Define the schema for a comment
const commentSchema = new mongoose.Schema<CommentDocument>({
  content: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId, // Change the type to ObjectId
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
  parentId: {
    type: String,
    default: null,
  },
});

// Define the model for a comment
const Comment = mongoose.model<CommentDocument>("Comment", commentSchema);

export default Comment;
