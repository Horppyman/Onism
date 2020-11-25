import Response from "../utils/response";
import Password from "../utils/generatePassword";
import SessionManager from "../utils/sessionManager";
import UserService from "../services/userService";
import UserProfileService from "../services/userProfileService";
import Email from "../utils/mails/email";
import VerifyEmail from "../utils/mails/verify.email";
import ResetPasswordEmail from "../utils/mails/resetPassword.email";
import { FRONTEND_URL } from "../config";
import Emitter from "../utils/eventEmitter";

/** Class that handles user */
class Users {
  /**
   * creates a new user
   * @param {object} req -request object
   * @param {object} res - response object
   * @param {object} next - next middleware
   * @returns {object} custom response
   */
  async createUser(req, res, next) {
    const rawData = req.body;
    try {
      const obj = new Password(rawData);
      const newPassword = await obj.encryptPassword();

      rawData.userPassword = newPassword;
      const data = await UserService.createUser(rawData);

      const token = SessionManager.generateToken({
        id: data.id,
        firstName: data.firstName,
        lastName: data.lastName,
        userEmail: data.userEmail,
        userRoles: data.userRoles,
        accountVerified: data.accountVerified,
        emailAllowed: data.emailAllowed,
      });
      data.dataValues.userToken = token;
      delete data.dataValues.userPassword;
      delete data.dataValues.accountVerified;
      delete data.dataValues.createdAt;
      delete data.dataValues.updatedAt;

      const link = `${FRONTEND_URL}/verify/?token=${token}`;
      let verification;
      try {
        const headers = Email.header({
          to: data.dataValues.userEmail,
          subject: "Onism email verification link",
        });
        const msg = VerifyEmail.verificationLinkTemplate(link, data.dataValues);
        await Email.sendMail(res, headers, msg);
        verification = "verification link sent";
      } catch (error) {
        verification = "verification link not sent";
      }
      return Response.customResponse(
        res,
        201,
        "Account has been created successfully",
        { ...data.dataValues, verification: { message: verification, link } }
      );
    } catch (error) {
      return next(error);
    }
  }

  /**
   * logs in a user
   * @param {object} req - request object
   * @param {object} res - response object
   * @param {object} next - next object
   * @param {object} - custom response
   */
  async login(req, res, next) {
    try {
      const { userEmail, userPassword } = req.body;

      const userExists = await UserService.findUser({ userEmail });

      if (!userExists) {
        return Response.authenticationError(
          res,
          "Invalid email or password entered"
        );
      }
      if (userExists.accountVerified === false) {
        return Response.authenticationError(res, "Email not verified");
      }
      const user = userExists.dataValues;

      const match = await Password.checkPasswordMatch(
        userPassword,
        user.userPassword
      );
      if (!match) {
        return Response.authenticationError(res, "Invalid email or password");
      }
      user.userToken = await SessionManager.createSession(user, res);
      delete user.userPassword;
      delete user.accountVerified;
      delete user.createdAt;
      delete user.updatedAt;

      const profile = await UserProfileService.getProfile(user.id);
      if (profile.dataValues.userProfile) {
        const profileData = profile.dataValues.userProfile.dataValues;
        res.cookie("passportNumber", profileData.passportNumber);
        res.cookie("passportName", profileData.passportName);
        res.cookie("gender", profileData.gender);
      }
      await Emitter.emit("new-user", user);
      return Response.customResponse(
        res,
        200,
        "User signed in successfully",
        user
      );
    } catch (error) {
      return next(error);
    }
  }

  /**
   * logs out a user
   * @param {object} req - request object
   * @param {object} res - response object
   * @returns {object} response
   */
  async logout(req, res) {
    SessionManager.destroyToken(req.user);

    return Response.customResponse(res, 200, "User logged out successfully");
  }

  /**
   * login a user via social account
   * @param {object} req - response object
   * @param {object} res -response object
   * @returns {string} redirect url
   */
  async socialLogin(req, res) {
    const { firstName, lastName, email: userEmail } = req.user;
    let data;
    data = await UserService.findUser({ userEmail });
    if (!data) {
      data = await UserService.createUser({
        firstName,
        lastName,
        userEmail,
      });
    }
    const token = await SessionManager.createSession({
      id: data.id,
      firstName: data.firstName,
      lastName: data.lastName,
      userEmail: data.userEmail,
      userRoles: data.userRoles,
      emailAllowed: data.emailAllowed,
    });
    const apiResponse = {
      status: 200,
      message: "Successfully logged in",
      data: token,
    };
    await Emitter.emit("new-user", data);
    const responseBuffer = Buffer.from(JSON.stringify(apiResponse));
    return res.redirect(
      `${FRONTEND_URL}/login?code=${responseBuffer.toString("base64")}`
    );
  }

  /**
   * check the user token
   * @param {object} req - request object
   * @param {object} res - response object
   * @param {object} next - next middleware
   * @returns {object} custom response
   */
  async checkToken(req, res, next) {
    try {
      return Response.customResponse(res, 200, "current user", req.user);
    } catch (error) {
      return next(error);
    }
  }

  /**
   * verifies email
   * @param {object} req - request object
   * @param {object} res - response object
   * @param {object} next - next middleware
   * @returns {object} custom response
   */
  async verify(req, res, next) {
    const { token } = req.query;

    try {
      const { userEmail } = await SessionManager.verifyToken(token);
      const user = await UserService.findUser({ userEmail });
      if (user.accountVerified) {
        return Response.conflictError(res, "Email already verified");
      }
      await UserService.updateUser({ userEmail }, { accountVerified: true });
      const userExists = user.dataValues;
      userExists.accountVerified = true;
      const userToken = await SessionManager.createSession(userExists, res);
      return Response.customResponse(res, 201, "Email verified successfully", {
        userEmail,
        userToken,
      });
    } catch (error) {
      return next({
        message: "error.message",
        stack: error.stack,
        status: 401,
      });
    }
  }
}

export default new Users();