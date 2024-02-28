import express, { Router } from "express";
import {
  getAllPosts,
  getPost,
  createPost,
  addComment,
  deleteComment,
  editComment,
  getDraftPosts,
} from "../controllers/postController";
import { detokenizeAdmin } from "../middleware";
const router: Router = express.Router();

// Routes for posts
router.get("/", detokenizeAdmin, getAllPosts);
router.get("/:id", getPost);
// router.get("/", detokenizeAdmin, getDraftPosts);

// router.get("/:id/comments", showComments);

router.post("/", createPost);
router.post("/:id/comments", addComment);
router.delete("/:postId/:id", deleteComment);
router.post("/:id", editComment);

export default router;
