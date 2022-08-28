import express from "express";
import {
  createComment,
  updateComment,
  likeComment,
  unLikeComment,
  deleteComment,
} from "../controllers/comment.controller.js";
import auth from "../middleware/auth.js";

const router = express.Router();
// /api/comment
router.post("/create", auth, createComment);
router.patch("/:id", auth, updateComment);
router.patch("/:id/like", auth, likeComment);
router.patch("/:id/unlike", auth, unLikeComment);
router.delete("/:id", auth, deleteComment);

export default router;
