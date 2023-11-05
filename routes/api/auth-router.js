import express from "express";
import authController from "../../controllers/auth-controller.js";

import { validateBody } from "../../decorators/index.js";

import { userSignUpSchema, userSignInSchema } from "../../models/User.js";
import { authenticate } from "../../middleware/index.js"; //мідлвара, що перевірає чи є токін
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

authRouter.post("/signout", authenticate, authController.signout);
authRouter.get("/current", authenticate, authController.getCurrent);

export default authRouter;
