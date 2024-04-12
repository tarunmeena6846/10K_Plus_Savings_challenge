import mongoose, { Schema } from "mongoose";
import Post from "./postSchema";

export interface tagDataType extends Document {
  tag: string;
  posts: mongoose.Schema.Types.ObjectId[];
}

const tagSchema = new Schema({
  tag: { type: String, required: true },
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
});

export const TagModel = mongoose.model("tag", tagSchema);
