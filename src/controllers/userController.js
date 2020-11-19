import Response from "../utils/response";
import Password from "../utils/generatePassword";
import SessionManager from "../utils/sessionManager";
import UserService from "../services/userService";
import UserProfileService from "../services/userProfileService";
import Email from "../utils/mails/email";
import VerifyEmail from "../utils/mails/verify.email";
import ResetPasswordEmail from "../utils/mails/resetPassword.email";
import { FRONTEND_URL } from "../config";
import Emitter from '../utils/eventEmitter';

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
}

export default new Users();
