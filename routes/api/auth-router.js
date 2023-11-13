import express from "express";
import authController from "../../controllers/auth-controller.js";

import { validateBody } from "../../decorators/index.js";
import {
  userSignUpSchema,
  userSignInSchema,
  userVerifySchema,
} from "../../models/User.js";
import { authenticate, upload } from "../../middleware/index.js"; //мідлвара, що перевірає чи є токін
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

authRouter.patch(
  "/avatars",
  upload.single("avatar"),
  authenticate,
  authController.updateAvatar
);

authRouter.get(
  "/verify/:verificationToken",
  authController.verificationRequest
);
authRouter.post(
  "/verify",
  validateBody(userVerifySchema),
  authController.reverify
);

export default authRouter;
