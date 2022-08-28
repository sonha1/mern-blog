import express from "express";
import {
  createMessage,
  getConversations,
  getMessages,
  deleteMessages,
  deleteConversation,
} from "../controllers/message.controller.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/create", auth, createMessage);
router.get("/conversations", auth, getConversations);
router.get("/:id", auth, getMessages);
router.delete("/:id", auth, deleteMessages);
router.delete("/conversation/:id", auth, deleteConversation);

export default router;
