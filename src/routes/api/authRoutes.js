import express from "express";
import passport from "passport";
import "../../config/passport";
import Users from "../../controllers/userController";
import userValidation from "../../validation/userValidation";
import method from "../../utils/method";
import verify from "../../middlewares/auth";
import Access from "../../middlewares/userRoles";

const router = express.Router();

router.use(passport.initialize());
router.use(passport.session());

router
  .route("/signup")
  .post(userValidation.validateSignup, Users.createUser)
  .all(method);

router
  .route("/signin")
  .post(userValidation.validateSignin, Users.login)
  .all(method);

router.route("/signout").post(verify, Users.logout).all(method);

router.route("/facebook").get(
  passport.authenticate("facebook", {
    scope: ["email"],
  })
);

router
  .route("/facebook/redirect")
  .get(passport.authenticate("facebook"), Users.socialLogin)
  .all(method);

router.route("/google").get(
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
  })
);

router
  .route("/google/redirect")
  .get(passport.authenticate("google"), Users.socialLogin)
  .all(method);

router.route("/check-user").get(verify, Users.checkToken).all(method);

router
  .route("/create-link")
  .post(userValidation.validateSendLink, Users.sendLink)
  .all(method);

router
  .route("/verify")
  .patch(userValidation.validateVerifyLink, Users.verify)
  .all(method);

router.route("/forgot-password").post(Users.requestPasswordReset).all(method);

router
  .route("/reset-password/:userId/:token")
  .put(userValidation.resetPassword, Users.resetPassword)
  .all(method);
