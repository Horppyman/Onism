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
