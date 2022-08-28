import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    tags: {
      type: [String],
    },
    privacy: {
      type: Boolean,
      required: true,
    },
    creator: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true,
    },
    admins: {
      type: [{ type: mongoose.Types.ObjectId, ref: "user" }],
    },
    users: {
      type: [{ type: mongoose.Types.ObjectId, ref: "user" }],
    },
    posts: {
      type: [{ type: mongoose.Types.ObjectId, ref: "post" }],
    },
    deletedPosts: {
      type: [String],
      default: [],
      required: true,
    },
    joinRequests: {
      type: [{ type: mongoose.Types.ObjectId, ref: "user" }],
      default: [],
    },
    invitedUsers: {
      type: [{ type: mongoose.Types.ObjectId, ref: "user" }],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("group", groupSchema);
