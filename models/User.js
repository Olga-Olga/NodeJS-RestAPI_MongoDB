import Joi from "joi";
import { Schema, model } from "mongoose";
import { handleSaveError, preUpdate } from "./hooks.js";

const emailRegexp =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const userSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, "Set password for user"],
      minlength: 6,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: emailRegexp,
    },
    token: {
      type: String,
    },
    avatar: { type: String },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", handleSaveError);
userSchema.post("findOneAndUpdate", handleSaveError);
userSchema.pre("findOneAndUpdate", preUpdate);

export const userSignUpSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
  avatar: Joi.string(),
});

export const userSignInSchema = Joi.object({
  email: Joi.string().email().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
});

export const contactPatchSchema = Joi.object({
  favorite: Joi.boolean().required().messages({
    "any.required": `missing field favorite`,
  }),
});

export const userVerifySchema = Joi.object({
  email: Joi.string().min(3).required().pattern(emailRegexp),
});

const User = model("user", userSchema);

export default User;
