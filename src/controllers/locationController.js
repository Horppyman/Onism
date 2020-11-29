import Response from "../utils/response";
import locationService from "../services/locationService";

class Location {
  /**
   * Request to get all locations
   * @param {object} req - request object
   * @param {object} res - response object
   * @param {object} next - next middleware
   * @returns {object} response object
   */
  static async getLocations(req, res, next) {
    try {
      const locations = await locationService.getLocations();
      return Response.customResponse(
        res,
        200,
        "Locations fetched successfully",
        locations
      );
    } catch (error) {
      return next(error);
    }
  }
}

export default Location;
