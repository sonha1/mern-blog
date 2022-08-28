import express from "express";
import {
  createPost,
  getPosts,
  updatePost,
  getPost,
  deletePost,
  likePost,
  unLikePost,
  getUserPosts,
  hidePost,
  flagPost,
  unFlagPost,
} from "../controllers/post.controller.js";
import auth from "../middleware/auth.js";

const router = express.Router();
// /api/post
router.post("/create", auth, createPost);
router.get("/", auth, getPosts);
router
  .route("/:id")
  .patch(auth, updatePost)
  .get(auth, getPost)
  .delete(auth, deletePost);
router.patch("/:id/like", auth, likePost);
router.patch("/:id/unlike", auth, unLikePost);
router.get("/user_posts/:id", auth, getUserPosts);
router.patch("/hidePost/:id", auth, hidePost);
router.patch("/flagPost/:id", auth, flagPost);
router.patch("/unflagPost/:id", auth, unFlagPost);

export default router;
