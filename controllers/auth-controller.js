import User from "../models/User.js";
import { HttpError } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";
const { JWT_SECRET } = process.env;
// console.log(JWT_SECRET);
import gravatar from "gravatar";
import Jimp from "jimp";
// const JWT_SECRET = "cjyPvS7w7sCBSIWHn0ljiOgYQK84Xm2";
import path from "path";
const avatarPath = path.resolve("public", "avatars");

const signup = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email already is used");
  }

  const hashPassword = await bcryptjs.hash(password, 10);

  const newEmail = email.trim().toLowerCase();
  const avatarURL = `${gravatar.url(newEmail, { s: "80", r: "pg", d: "mp" })}`;

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
  });
  res.status(201).json({ username: newUser.username, email: newUser.email });
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
  await fs.rename(oldPath, newPath);

  await Jimp.read(newPath)
    .then((avatar) => avatar.resize(250, 250).writeAsync(newPath))
    .catch((err) => {
      throw HttpError(404, err.message);
    });

  const avatarURL = path.join("avatars", filename);
  await User.findByIdAndUpdate(_id, { avatarURL });
  res.status(200).json({ avatarURL: avatarURL });
};

export default {
  signup: ctrlWrapper(signup),
  signin: ctrlWrapper(signin),
  signout: ctrlWrapper(signout),
  getCurrent: ctrlWrapper(getCurrent),
  updateAvatar: ctrlWrapper(updateAvatar),
};
