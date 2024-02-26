import express, { Router } from "express";
import {
  getAllPosts,
  getPost,
  createPost,
  addComment,
} from "../controllers/postController";
import { detokenizeAdmin } from "../middleware";
const router: Router = express.Router();

// Routes for posts
router.get("/", getAllPosts);
router.get("/:id", getPost);
// router.get("/:id/comments", showComments);

router.post("/", createPost);
router.post("/:id/comments", addComment);

export default router;
