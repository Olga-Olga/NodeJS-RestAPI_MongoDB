import User from "../models/User.js";
import { HttpError, sendEmail } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";
const { JWT_SECRET, BASE_URL } = process.env;
import fs from "fs/promises";

import gravatar from "gravatar";
import Jimp from "jimp";

import path from "path";
const avatarPath = path.resolve("public", "avatars");
import { nanoid } from "nanoid";

const signup = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email already is used");
  }

  const hashPassword = await bcryptjs.hash(password, 10);

  const newEmail = email.trim().toLowerCase();
  const avatar = `${gravatar.url(newEmail, { s: "80", r: "pg", d: "mp" })}`;
  const verificationToken = nanoid();
  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatar,
    verificationToken,
  });
  const massage = {
    userEmail: email,
    title: "Email verification.",
    bodyContent: `<a target="_blank" href="${BASE_URL}/users/verify/${verificationToken}">Click here to verify email</a>`,
  };
  sendEmail(massage);
  res
    .status(201)
    .json({ username: newUser.username, email: newUser.email, avatar });
  // res.json(newUser);
};

const signin = async (req, res) => {
  const { email, password } = req.body;
  const userFormDB = await User.findOne({ email });

  if (!userFormDB) {
    throw HttpError(401, "Email or password invalid");
  }
  const comparePassword = await bcryptjs.compare(password, userFormDB.password);
  if (!comparePassword) {
    throw HttpError(401, "Email or password invalid");
  }

  const payload = { id: userFormDB._id }; //{ id: userFormDB._id };
  // console.log("payload", payload);
  // console.log("JWT_SECRET", JWT_SECRET);

  // const token = "135@#$\nw45ywse5yrZE"; // token прикріплюється до запитів на приватні роути
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" }); // token прикріплюється до запитів на приватні роути
  await User.findByIdAndUpdate(userFormDB._id, { token }); //зберігаємо токін в базі
  res.json({ token });
};

// тут надо видалити токін з обекту користувача з бази
const signout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });
  res.json({
    message: "Signout has been successfull",
  });
};

const getCurrent = async (req, res) => {
  const { username, email } = req.user; //дістаємо з реквест Юзера імейл і нейм без запиту до бази і відсилаємо на фронтенд
  res.json({ username, email });
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: oldPath, filename } = req.file;
  const newPath = path.join(avatarPath, filename);
  Jimp.read(oldPath, function (err, avatar) {
    if (err) throw err.massage;
    avatar.resize(250, 250).quality(60).write(newPath);
  });
  await fs.unlink(oldPath);
  const avatar = path.join("avatars", filename);
  const user = await User.findByIdAndUpdate(_id, { avatar });
  res.status(200).json({
    avatar: user.avatar,
  });
};

const verificationRequest = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await Users.findOne({ verificationToken });
  if (!user) {
    throw HttpError(404, "Not found!");
  }
  await Users.findOneAndUpdate({ verificationToken: null, verify: true });
  res.status(200).json({
    message: "Verification successful",
  });
};

const reverify = async (req, res) => {
  const { email } = req.body;
  const user = await Users.findOne({ email });
  if (!user) {
    throw HttpError(404, "User with this email not found");
  }
  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }
  const verificationToken = nanoid();
  const newUser = await Users.findOneAndUpdate(
    { email },
    { verificationToken }
  );
  const massage = {
    userEmail: email,
    title: "Email ReVerification!",
    bodyContent: `<a target="_blank" href="${BASE_URL}/users/verify/${verificationToken}">Click here to verify email</a>`,
  };

  sendEmail(massage);

  res.status(200).json({
    message: "Verification email sent",
  });
};

export default {
  signup: ctrlWrapper(signup),
  signin: ctrlWrapper(signin),
  signout: ctrlWrapper(signout),
  getCurrent: ctrlWrapper(getCurrent),
  updateAvatar: ctrlWrapper(updateAvatar),
  verificationRequest: ctrlWrapper(verificationRequest),
  reverify: ctrlWrapper(reverify),
};
