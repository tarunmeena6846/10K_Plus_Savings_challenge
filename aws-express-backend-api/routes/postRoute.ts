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
  upvoteComment,
  editOrPublishPost,
  deletePostFromDbOrAdmin,
  approveOrDeclinePost,
} from "../controllers/postController";

import { detokenizeAdmin, isAdmin } from "../middleware";
const router: Router = express.Router();
// scheduleWeeklyReminderEmail();
// Routes for posts
router.get("/", detokenizeAdmin, getAllPosts);
router.get("/userPosts", detokenizeAdmin, getUserPosts);
router.get("/tags", detokenizeAdmin, getTags);
router.get("/getBookmarkPosts", detokenizeAdmin, getBookmarkPosts);
router.get("/tags/:tagId", detokenizeAdmin, getPostByTag);
router.get("/:id", detokenizeAdmin, getPost);
router.post("/:id/upvote", detokenizeAdmin, upvoteComment);
router.post("/bookmarkPost", detokenizeAdmin, bookmarkedPosts);
router.post("/", detokenizeAdmin, createPost);
router.post("/approvePost/:id", isAdmin, approveOrDeclinePost);
router.post("/:id/comments", detokenizeAdmin, addComment);
router.post("/:id", detokenizeAdmin, editComment);
router.post("/editPost/:id", detokenizeAdmin, editOrPublishPost);
router.delete(
  "/deletepost/:id/:type",
  detokenizeAdmin,
  deletePostFromDbOrAdmin
);
router.delete("/:postId/:id", detokenizeAdmin, deleteComment);

export default router;
