import express, { Router } from "express";
import {
  getAllPosts,
  getPost,
  createPost,
  addComment,
  deleteComment,
  editComment,
  getTags,
  getPostByTag,
  // getDraftPosts,
} from "../controllers/postController";
import { detokenizeAdmin } from "../middleware";
const router: Router = express.Router();

// Routes for posts
router.get("/", detokenizeAdmin, getAllPosts);
router.get("/tags", detokenizeAdmin, getTags);
router.get("/tags/:tagId", detokenizeAdmin, getPostByTag);
router.get("/:id", detokenizeAdmin, getPost);
router.post("/", detokenizeAdmin, createPost);
router.post("/:id/comments", detokenizeAdmin, addComment);
router.delete("/:postId/:id", detokenizeAdmin, deleteComment);
router.post("/:id", detokenizeAdmin, editComment);

function logRequest(req: any, res: any, next: any) {
  console.log("Received request to /tags:", new Date().toISOString());
  next(); // Call next() to proceed to the next middleware/route handler
}
export default router;
