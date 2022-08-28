import Users from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validationPassword } from "../utils/validation.js";
import { createAccessToken, createRefreshToken } from "../utils/token.js";

export const register = async (req, res, next) => {
  try {
    const { fullname, username, email, password, gender, isActive } = req.body;
    let newUserName = username.toLowerCase().replace(/ /g, "");

    const userName = await Users.findOne({ username: newUserName });
    if (userName)
      return res.status(400).json({ msg: "This user name already exists." });

    const userEmail = await Users.findOne({ email });
    if (userEmail)
      return res.status(400).json({ msg: "This email already exists." });

    if (password.length < 6)
      return res
        .status(400)
        .json({ msg: "Password must be at least 6 characters." });

    const passwordHash = await bcrypt.hash(password, 12);

    const newUser = new Users({
      fullname,
      username: newUserName,
      email,
      password: passwordHash,
      gender,
      isActive,
    });

    await newUser.save();

    res.json({
      msg: "Register Success!",
      //   accessToken,
      user: {
        ...newUser._doc,
        password: "",
      },
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;

    const user = await Users.findOne({ email });

    if (!user)
      return res.status(400).json({ msg: "This email does not exist." });

    if (!user.isActive || user.isActive === "false")
      return res.status(400).json({
        msg: "This account has been deactivated. Log in with or create a new account.",
      });

    const isMatch2 = user.username === username;
    if (!isMatch2) return res.status(400).json({ msg: "Wrong username" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({
        msg: "Password is incorrect. Cannot login after 3 incorrect trials",
      });

    const access_token = createAccessToken({ id: user._id });
    const refreshToken = createRefreshToken({ id: user._id });

    res.cookie("refreshtoken", refreshToken, {
      httpOnly: true,
      path: "/api/refresh_token",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30days
    });

    res.json({
      msg: "Login Success!",
      access_token,
      user: {
        ...user._doc,
        password: "",
      },
    });
  } catch (err) {}
};

export const logout = async (req, res, next) => {
  try {
    res.clearCookie("refreshtoken", { path: "/api/refresh_token" });
    return res.json({ msg: "Logged out!" });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const generateAccessToken = async (req, res, next) => {
  try {
    const rfToken = req.cookies.refreshtoken;
    if (!rfToken) return res.status(400).json({ msg: "Please login now." });

    jwt.verify(
      rfToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, result) => {
        if (err) return res.status(400).json({ msg: "Please login now." });

        const user = await Users.findById(result.id).select("-password");

        if (!user) return res.status(400).json({ msg: "This does not exist." });

        const accessToken = createAccessToken({ id: result.id });
        const refreshToken = createRefreshToken({ id: user._id });

        res.cookie("refreshtoken", refreshToken, {
          httpOnly: true,
          path: "/api/refresh_token",
          maxAge: 30 * 24 * 60 * 60 * 1000, // 30days
        });

        res.json({
          accessToken,
          user,
        });
      }
    );
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const searchUser = async (req, res) => {
  try {
    console.log(req.query.username);
    const users = await Users.find({ username: { $regex: req.query.username } })
      .limit(10)
      .select("fullname username avatar");

    res.json({ users });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await Users.findById(req.params.id).select("-password");

    if (!user) return res.status(400).json({ msg: "User does not exist." });

    res.json({ user });
  } catch (err) {
    console.error(err);
    next(err);
  }
};
export const updateUserPassword = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    if (!email) return res.status(400).json({ msg: "Please add your email." });

    if (!username)
      return res.status(400).json({ msg: "Please add your username." });

    if (!password)
      return res.status(400).json({ msg: "Please add your new password." });
    if (!validationPassword(password))
      return res.status(400).json({
        msg: "Password must be at least 6 characters, and contain at least one uppercase letter, one lowercase letter, and one number.",
      });
    const passwordHash = await bcrypt.hash(password, 12);

    await Users.findOneAndUpdate(
      { _id: req.user._id },
      {
        password: passwordHash,
      }
    );

    res.json({ msg: "Update Success!" });
  } catch {
    console.error(err);
    next(err);
  }
};
export const updateUserProfile = async (req, res, next) => {
  try {
    const { avatar, fullname, mobile, address, gender, isActive } = req.body;
    if (!fullname)
      return res.status(400).json({ msg: "Please add your full name." });

    await Users.findOneAndUpdate(
      { _id: req.user._id },
      {
        avatar,
        fullname,
        mobile,
        address,
        gender,
        isActive,
      }
    );
    res.json({ msg: "Update Success!" });
  } catch (err) {
    console.error(err);
    next(err);
  }
};
