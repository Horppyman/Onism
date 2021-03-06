import Joi from "@hapi/joi";
import Schema from "./schema";
import validator from "../utils/validator";

/**
 * @class notificationValidator
 */
export default class notificationValidator {
  /** validates the id input
   * @param {Object} req  request details.
   * @param {Object} res  response details.
   * @param {Object} next middleware details
   * @returns {Object} schema validation
   */
  static async markAsRead(req, res, next) {
    const schema = Joi.object()
      .keys({
        id: Schema.idOptional,
      })
      .options({ allowUnknown: false });
    validator(schema, req.query, res, next);
  }
}
