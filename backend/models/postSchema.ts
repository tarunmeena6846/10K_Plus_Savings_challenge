import mongoose, { Document, Schema, Types } from "mongoose";
import { Admin } from "./admin";
import { CommentDocument } from "./commentSchema";

export interface PostSchema extends Document {
  id: String;
  title: string;
  content: string;
  author: String;
  createdAt: Date;
  comments: mongoose.Types.ObjectId[] | CommentDocument[];
  //   comments: CommentDocument["_id"][];
  // Add more fields as needed
}

// Define the schema for a discussion forum post
const postSchema = new mongoose.Schema<PostSchema>({
  //   id: { type: String, required: true },
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

// Define the model for a post
const Post = mongoose.model<PostSchema>("Post", postSchema);

// Define the model for a comment

export default Post;
