import express from "express";
import authController from "../../controllers/auth-controller.js";

import { validateBody } from "../../decorators/index.js";

import { userSignUpSchema, userSignInSchema } from "../../models/User.js";

const authRouter = express.Router();

authRouter.post(
  "/signup",
  validateBody(userSignUpSchema),
  authController.signup
);

authRouter.post(
  "/signin",
  validateBody(userSignInSchema),
  authController.signin
);

export default authRouter;
