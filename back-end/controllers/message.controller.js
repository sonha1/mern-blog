import Conversations from "../models/conversation.model.js";
import Messages from "../models/message.model.js";
import APIfeatures from "../utils/features.js";

export const createMessage = async (req, res, next) => {
  try {
    const { sender, recipient, text, media } = req.body;

    if (!recipient || (!text.trim() && media.length === 0)) return;

    const newConversation = await Conversations.findOneAndUpdate(
      {
        $or: [
          { recipients: [sender, recipient] },
          { recipients: [recipient, sender] },
        ],
      },
      {
        recipients: [sender, recipient],
        text,
        media,
      },
      { new: true, upsert: true }
    );

    const newMessage = new Messages({
      conversation: newConversation._id,
      sender,
      recipient,
      text,
      media,
    });

    await newMessage.save();

    res.json({ msg: "Create Success!" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};
export const getConversations = async (req, res, next) => {
  try {
    const features = new APIfeatures(
      Conversations.find({
        recipients: req.user._id,
      }),
      req.query
    ).paginating();

    const conversations = await features.query
      .sort("-updatedAt")
      .populate("recipients", "avatar username fullname");

    res.json({
      conversations,
      result: conversations.length,
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const features = new APIfeatures(
      Messages.find({
        $or: [
          { sender: req.user._id, recipient: req.params.id },
          { sender: req.params.id, recipient: req.user._id },
        ],
      }),
      req.query
    ).paginating();

    const messages = await features.query.sort("-createdAt");

    res.json({
      messages,
      result: messages.length,
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

export const deleteMessages = async (req, res, next) => {
  try {
    await Messages.findOneAndDelete({
      _id: req.params.id,
      sender: req.user._id,
    });
    res.json({ msg: "Delete Success!" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

export const deleteConversation = async (req, res, next) => {
  try {
    const newConver = await Conversations.findOneAndDelete({
      $or: [
        { recipients: [req.user._id, req.params.id] },
        { recipients: [req.params.id, req.user._id] },
      ],
    });
    await Messages.deleteMany({ conversation: newConver._id });

    res.json({ msg: "Delete Success!" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};
