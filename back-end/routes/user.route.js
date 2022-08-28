import express from "express";
import {
  login,
  register,
  logout,
  generateAccessToken,
  updateUserProfile,
  updateUserPassword,
  searchUser,
  getUser,
} from "../controllers/user.controller.js";
import auth from "../middleware/auth.js";

const router = express.Router();
// /api/user/..
router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);
router.post("/refreshtoken", generateAccessToken);
router.get("/search", auth, searchUser);
router.get("/:id", auth, getUser);
router.patch("/", auth, updateUserProfile);
router.patch("/changePassword", auth, updateUserPassword);

export default router;
