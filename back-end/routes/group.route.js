import express from "express";
import {
  createGroup,
  getGroup,
  deleteGroup,
  getGroups,
  joinGroup,
  leaveGroup,
  getUserGroups,
  suggestionsGroup,
  addAdmin,
  removeAdmin,
  addRequest,
  addToGroup,
  denyRequest,
  inviteUser,
  rejectInvite,
  incrementDelete,
} from "../controllers/group.controller.js";
import auth from "../middleware/auth.js";

const router = express.Router();
//api/group
router.post("/create", auth, createGroup);
router.get("/", auth, getGroups);

router.get("/suggestionsGroup", auth, suggestionsGroup);

router.patch("/:id/join", auth, joinGroup);
router.patch("/:id/leave", auth, leaveGroup);
router.get("/user_groups/:id", auth, getUserGroups);
router.patch("/admin/:id", auth, addAdmin);
router.patch("/removeAdmin/:id", auth, removeAdmin);
router.patch("/incrementDelete/:id", incrementDelete);
router.patch("/addRequest/:id", addRequest);
router.patch("/:id/add", addToGroup);
router.patch("/:id/deny", denyRequest);
router.patch("/inviteUser/:id", inviteUser);
router.patch("/rejectInvite/:id", rejectInvite);
router.get("/:id", auth, getGroup);
router.delete("/:id", auth, deleteGroup);

export default router;
