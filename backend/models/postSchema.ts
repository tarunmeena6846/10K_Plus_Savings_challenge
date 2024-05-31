import mongoose, { Document, Schema, Types } from "mongoose";
import { Admin } from "./admin";
import { CommentDocument } from "./commentSchema";

export interface PostSchema extends Document {
  title: string;
  content: string;
  author: String;
  createdAt: Date;
  comments: mongoose.Types.ObjectId[] | CommentDocument[];
  isPublished: Boolean;
  tag: string;
  userImage?: string;
  status: string;
  _id: mongoose.Types.ObjectId; // Add this line

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
  isPublished: { type: Boolean, default: true },
  tag: { type: String, required: true },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  userImage: { type: String },
  status: {
    type: String,
    enum: ["approvalPending", "approved", "rejected"],
    default: "approvalPending",
  },
});

// Define the model for a post
const Post = mongoose.model<PostSchema>("Post", postSchema);

// Define the model for a comment
Post.collection.createIndex({ isPublished: 1 });
// Post.collection.createIndex({ title: 1 });
Post.collection.createIndex({ author: 1 });
Post.collection.createIndex({ status: 1 });
// Post.collection.createIndex({ createdAt: 1 });
export default Post;
