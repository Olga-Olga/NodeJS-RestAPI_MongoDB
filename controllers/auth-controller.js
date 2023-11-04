import Contact from "../models/Contact.js";
import User from "../models/User.js";
import { HttpError } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";
const { JWT_SECRET } = process.env;
console.log(JWT_SECRET);
// const JWT_SECRET = "cjyPvS7w7sCBSIWHn0ljiOgYQK84Xm2";

const signup = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email already is used");
  }

  const hashPassword = await bcryptjs.hash(password, 10);

  const newUser = await User.create({ ...req.body, password: hashPassword });
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

  res.json({ token });
};

const postOne = async (req, res) => {
  const newUser = await User.create(req.body);
  res.status(201).json(newUser);
};

export default {
  signup: ctrlWrapper(signup),
  signin: ctrlWrapper(signin),
};
