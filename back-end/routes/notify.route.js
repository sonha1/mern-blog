import express from "express";
import {
  createNotify,
  removeNotify,
  getNotifies,
  isReadNotify,
  deleteAllNotifies,
} from "../controllers/notify.controller.js";
import auth from "../middleware/auth.js";
const router = express.Router();
// /api/notify
router.post("/create", auth, createNotify);
router.delete("/deleteAllNotify", auth, deleteAllNotifies);
router.get("/all", auth, getNotifies);
router.patch("/isReadNotify/:id", auth, isReadNotify);
router.delete("/:id", auth, removeNotify);

export default router;
