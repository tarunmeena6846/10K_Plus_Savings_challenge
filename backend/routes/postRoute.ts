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
  getBookmarkPosts,
  bookmarkedPosts,
  getUserPosts,
} from "../controllers/postController";

import { detokenizeAdmin } from "../middleware";
const router: Router = express.Router();

// Routes for posts
router.get("/", detokenizeAdmin, getAllPosts);
router.get("/userPosts", detokenizeAdmin, getUserPosts);
router.get("/tags", detokenizeAdmin, getTags);
router.get("/getBookmarkPosts", detokenizeAdmin, getBookmarkPosts);
router.get("/tags/:tagId", detokenizeAdmin, getPostByTag);
router.get("/:id", detokenizeAdmin, getPost);
// router.get("/:id", detokenizeAdmin, (req, res) => {
//   console.log("inside id", req.params.id);
// });
router.post("/bookmarkPost", detokenizeAdmin, bookmarkedPosts);
router.post("/", detokenizeAdmin, createPost);
router.post("/:id/comments", detokenizeAdmin, addComment);
router.delete("/:postId/:id", detokenizeAdmin, deleteComment);
// router.post("/:id", detokenizeAdmin, editComment);

export default router;
