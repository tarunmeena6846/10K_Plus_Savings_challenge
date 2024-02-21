import mongoose, { Document, Schema } from "mongoose";
import { Admin } from "./admin";

interface PostSchema extends Document {
  title: string;
  content: string;
  author: Admin["username"];
  createdAt: Date;
  comments: CommentDocument["_id"][];
  // Add more fields as needed
}
interface CommentDocument extends Document {
  _id: string; // Define the _id property
  content: string;
  author: Admin["_id"];
  createdAt: Date;
}
// Define the schema for a discussion forum post
const postSchema = new mongoose.Schema<PostSchema>({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    ref: "Admin",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
});

// Define the schema for a comment on a post
const commentSchema = new mongoose.Schema<CommentDocument>({
  content: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Define the model for a post
const Post = mongoose.model<PostSchema>("Post", postSchema);

// Define the model for a comment
const Comment = mongoose.model<CommentDocument>("Comment", commentSchema);

export default { Post, Comment };
