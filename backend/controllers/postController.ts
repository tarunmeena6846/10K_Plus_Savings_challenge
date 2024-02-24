import { AuthenticatedRequest } from "../middleware";
import Post from "../models/postSchema";
import Comment from "../models/commentSchema";
import { Model } from "mongoose";
import { Response, Request } from "express";

export const getAllPosts = async (req: Request, res: Response) => {
  console.log("inside getAllpost");
  try {
    const offset = parseInt(req.query.offset as string) || 0;
    const limit = parseInt(req.query.limit as string) || 10;

    // Fetch posts from the database with pagination
    const posts = await Post.find({})
      .skip(offset) // Skip the specified number of posts
      .limit(limit); // Limit the number of posts returned
    console.log("inside post", posts);

    res.status(200).json({ posts });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getPost = async (req: Request, res: Response) => {
  console.log("inside getpost");
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "username")
      .populate({
        path: "comments",
        populate: { path: "author", select: "username" },
      });
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createPost = async (req: Request, res: Response) => {
  console.log("inside creatapost");
  const { title, content, author } = req.body;
  console.log(title, content, author);
  try {
    const post = new Post({
      title,
      content,
      author: author,
      createdAt: new Date(),
      comments: [],
    });
    await post.save();
    console.log("post", post);
    res.status(201).json(post);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const addComment = async (req: Request, res: Response) => {
  const { content, authorId } = req.body;
  console.log("inside creatapost");
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    const comment = new Comment({ content, author: authorId });
    await comment.save();
    post.comments.push(comment.id);
    await post.save();
    res.status(201).json(comment);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
