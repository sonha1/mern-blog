import Comments from "../models/comment.model.js";
import Posts from "../models/post.model.js";

export const createComment = async (req, res, next) => {
  try {
    const { postId, content, tag, reply, postUserId } = req.body;

    const post = await Posts.findById(postId);
    if (!post)
      return res.status(400).json({ msg: "This post does not exist." });

    if (reply) {
      const cm = await Comments.findById(reply);
      if (!cm)
        return res.status(400).json({ msg: "This comment does not exist." });
    }

    const newComment = new Comments({
      user: req.user._id,
      content,
      tag,
      reply,
      postUserId,
      postId,
    });

    await Posts.findOneAndUpdate(
      { _id: postId },
      {
        $push: { comments: newComment._id },
      },
      { new: true }
    );

    await newComment.save();

    res.json({ newComment });
  } catch (err) {
    console.error(err);
    next(err);
  }
};
export const updateComment = async (req, res, next) => {
  try {
    const { content } = req.body;

    await Comments.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id,
      },
      { content }
    );

    res.json({ msg: "Update Success!" });
  } catch (err) {
    console.error(err);
    next(err);
  }
};
export const likeComment = async (req, res, next) => {
  try {
    const comment = await Comments.find({
      _id: req.params.id,
      likes: req.user._id,
    });
    if (comment.length > 0)
      return res.status(400).json({ msg: "You liked this post." });

    await Comments.findOneAndUpdate(
      { _id: req.params.id },
      {
        $push: { likes: req.user._id },
      },
      { new: true }
    );

    res.json({ msg: "Liked Comment!" });
  } catch (err) {
    console.error(err);
    next(err);
  }
};
export const unLikeComment = async (req, res, next) => {
  try {
    await Comments.findOneAndUpdate(
      { _id: req.params.id },
      {
        $pull: { likes: req.user._id },
      },
      { new: true }
    );

    res.json({ msg: "UnLiked Comment!" });
  } catch (err) {
    console.error(err);
    next(err);
  }
};
export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comments.findOneAndDelete({
      _id: req.params.id,
      $or: [{ user: req.user._id }, { postUserId: req.user._id }],
    });

    await Posts.findOneAndUpdate(
      { _id: comment.postId },
      {
        $pull: { comments: req.params.id },
      }
    );

    res.json({ msg: "Deleted Comment!" });
  } catch (err) {
    console.error(err);
    next(err);
  }
};
