import express from "express";
const router = express.Router();
import postController from "./controllers/postController";

// Routes for posts
router.get("/posts", postController.getAllPosts);
router.get("/posts/:id", postController.getPost);
router.post("/posts", postController.createPost);
router.post("/posts/:id/comments", postController.addComment);

module.exports = router;
