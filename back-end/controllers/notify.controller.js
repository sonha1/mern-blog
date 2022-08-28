import Notifies from "../models/notify.model.js";

export const createNotify = async (req, res, next) => {
  try {
    const { id, recipients, url, text, content, image } = req.body;

    if (recipients.includes(req.user._id.toString())) return;

    const notify = new Notifies({
      id,
      recipients,
      url,
      text,
      content,
      image,
      user: req.user._id,
    });

    await notify.save();
    return res.json({ notify });
  } catch (err) {
    console.error(err);
    next(err);
  }
};
export const removeNotify = async (req, res, next) => {
  try {
    const notify = await Notifies.findOneAndDelete({
      id: req.params.id,
      url: req.query.url,
    });

    return res.json({ notify });
  } catch (err) {
    console.error(err);
    next(err);
  }
};
export const getNotifies = async (req, res, next) => {
  try {
    const notifies = await Notifies.find({ recipients: req.user._id })
      .sort("-createdAt")
      .populate("user", "avatar username");

    return res.json({ notifies });
  } catch (err) {
    console.error(err);
    next(err);
  }
};
export const isReadNotify = async (req, res, next) => {
  try {
    const notifies = await Notifies.findOneAndUpdate(
      { _id: req.params.id },
      {
        isRead: true,
      }
    );

    return res.json({ notifies });
  } catch (err) {
    console.error(err);
    next(err);
  }
};
export const deleteAllNotifies = async (req, res, next) => {
  try {
    const notifies = await Notifies.deleteMany({ recipients: req.user._id });

    return res.json({ notifies });
  } catch (err) {
    console.error(err);
    next(err);
  }
};
