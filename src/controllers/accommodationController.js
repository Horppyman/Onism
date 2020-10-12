import Response from '../utils/response';
import { turnArray } from '../utils/isArray';

class accommodationController {
  /**
   * @param {object} req - request object
   * @param {object} res - response object
   * @param {object} next - next middleware
   * @returns {object} custom response
   */
  static async createAccommodations(req, res, next) {
    const {
      body: { locationId, name, lat, lng, amenities, services },
      user: { id },
    } = req;

    try {
      const location = await LocationService.getLocationById(locationId);
      if (!location) {
        return Response.notFoundError(res, "Location not found");
      }
      const accommodationExist = await accommodationService.getAccommodation({
        name: name.toUpperCase(),
        locationId,
      });
      if (accommodationExist) {
        return Response.conflictError(
          res,
          "This accommodation already exist in this location"
        );
      }
      req.body.imageUrl = await manyImages(req.files);
      req.body.mapLocations = {
        lat: parseFloat(lat),
        lng: parseFloat(lng),
      };
      delete req.body.lat;
      delete req.body.lng;
      req.body.amenities = turnArray(amenities);
      req.body.services = turnArray(services);
      req.body.owner = id;
      req.body.name = name.toUpperCase();
      const accommodation = await accommodationService.createAccommodation(
        req.body
      );
      return Response.customResponse(
        res,
        "201",
        "Accommodation created successfully",
        accommodation
      );
    } catch (error) {
      return next(error);
    }
  }

  /**
   * get all accommodation
   * @param {object} req - request object
   * @param {object} res - response object
   * @param {object} next - next middleware
   * @returns {object} custom response
   */
  static async getAccommodations(req, res, next) {
    try {
      const data = await accommodationService.getAllAccommodations();
      return Response.customResponse(
        res,
        "200",
        "Accommodations fetched successfully",
        data
      );
    } catch (error) {
      return next(error);
    }
  }
}

export default accommodationController;
