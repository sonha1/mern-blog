import Posts from "../models/post.model.js";
import Comments from "../models/comment.model.js";
import Groups from "../models/group.model.js";
import APIfeatures from "../utils/features.js";

export const createPost = async (req, res, next) => {
  try {
    const { content, images, groupId } = req.body;

    const group = await Groups.findById(groupId);
    if (!group)
      return res.status(400).json({ msg: "This group does not exist." });

    if (content.length > 500 || content.length === 0)
      return res
        .status(400)
        .json({ msg: "Content should be between 1 and 500 characters." });

    const newPost = new Posts({
      content,
      images,
      user: req.user._id,
      groupId,
      isHidden: false,
    });

    await Groups.findOneAndUpdate(
      { _id: groupId },
      {
        $push: { posts: newPost._id },
      },
      { new: true }
    );

    await newPost.save();

    res.json({
      msg: "Created Post!",
      newPost: {
        ...newPost._doc,
        user: req.user,
      },
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const getPosts = async (req, res, next) => {
  try {
    const features = new APIfeatures(Posts.find({}), req.query);

    const posts = await features.query
      .sort("-createdAt")
      .populate("user likes", "avatar username fullname")
      .populate({
        path: "comments",
        populate: {
          path: "user likes",
          select: "-password",
        },
      });

    res.json({
      msg: "Success!",
      result: posts.length,
      posts,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const hidePost = async (req, res, next) => {
  try {
    const post = await Posts.findOneAndUpdate(
      { _id: req.params.id },
      {
        isHidden: true,
      }
    )
      .populate("user likes", "avatar username fullname")
      .populate({
        path: "comments",
        populate: {
          path: "user likes",
          select: "-password",
        },
      });
    res.json(post);
  } catch {
    console.error(err);
    next(err);
  }
};

export const flagPost = async (req, res, next) => {
  try {
    const post = await Posts.findOneAndUpdate(
      { _id: req.params.id },
      {
        isFlagged: true,
      }
    )
      .populate("user likes", "avatar username fullname")
      .populate({
        path: "comments",
        populate: {
          path: "user likes",
          select: "-password",
        },
      });
  } catch {
    console.error(err);
    next(err);
  }
};

export const unFlagPost = async (req, res, next) => {
  try {
    const post = await Posts.findOneAndUpdate(
      { _id: req.params.id },
      {
        isFlagged: false,
      }
    )
      .populate("user likes", "avatar username fullname")
      .populate({
        path: "comments",
        populate: {
          path: "user likes",
          select: "-password",
        },
      });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const updatePost = async (req, res, next) => {
  try {
    const { content, images } = req.body;

    const post = await Posts.findOneAndUpdate(
      { _id: req.params.id },
      {
        content,
        images,
      }
    )
      .populate("user likes", "avatar username fullname")
      .populate({
        path: "comments",
        populate: {
          path: "user likes",
          select: "-password",
        },
      });

    res.json({
      msg: "Updated Post!",
      newPost: {
        ...post._doc,
        content,
        images,
      },
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const likePost = async (req, res, next) => {
  try {
    const post = await Posts.find({
      _id: req.params.id,
      likes: req.user._id,
    });
    if (post.length > 0)
      return res.status(400).json({ msg: "You liked this post." });

    const like = await Posts.findOneAndUpdate(
      { _id: req.params.id },
      {
        $push: { likes: req.user._id },
      },
      { new: true }
    );

    if (!like)
      return res.status(400).json({ msg: "This post does not exist." });

    res.json({ msg: "Liked Post!" });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const unLikePost = async (req, res, next) => {
  try {
    const like = await Posts.findOneAndUpdate(
      { _id: req.params.id },
      {
        $pull: { likes: req.user._id },
      },
      { new: true }
    );

    if (!like)
      return res.status(400).json({ msg: "This post does not exist." });

    res.json({ msg: "UnLiked Post!" });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const getUserPosts = async (req, res, next) => {
  try {
    const features = new APIfeatures(
      Posts.find({ user: req.params.id }),
      req.query
    );
    const posts = await features.query.sort("-createdAt");

    res.json({
      posts,
      result: posts.length,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const getPost = async (req, res, next) => {
  try {
    const post = await Posts.findById(req.params.id)
      .populate("user likes", "avatar username fullname")
      .populate({
        path: "comments",
        options: {
          sort: {
            "created-at": -1,
          },
        },
        populate: {
          path: "user likes",
          select: "-password",
        },
      });

    if (!post)
      return res.status(400).json({ msg: "This post does not exist." });

    res.json({
      post,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const post = await Posts.findOneAndDelete({ _id: req.params.id });
    await Comments.deleteMany({ _id: { $in: post.comments } });
    res.json({
      msg: "Your post was deleted!",
      newPost: {
        ...post,
        user: req.user,
      },
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};
