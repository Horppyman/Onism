import sequelize from "sequelize";
import database from "../database/models";

const {
  Rooms,
  Accommodations,
  Location,
  Likes,
  Feedbacks,
  Users,
  ProfilePictures,
  Ratings,
  Requests,
} = database;

/** Class that handles accommodation services */
class accommodationService {
  /**
   * creates a new accommodation
   * @param {object} accommodation - accommodation object
   * @returns {object} - created accommodation object
   */
  static async createAccommodation(accommodation) {
    try {
      const createdAccommodation = await Accommodations.create(accommodation);

      return createdAccommodation;
    } catch (error) {
      throw error;
    }
  }

  /**
   * get an accommodation by a parameter
   * @param {id} params to check by
   * @returns {object} accommodation object
   */
  static async getAccommodation(params) {
    try {
      const singleAccommodation = await Accommodations.findOne({
        where: [params],
        include: [
          {
            model: Rooms,
            as: "rooms",
            attributes: [
              "id",
              "name",
              "type",
              "accommodationId",
              "status",
              "price",
            ],
          },
          {
            model: Location,
            attributes: ["id", "city", "country"],
          },
          {
            model: Likes,
            as: "likes",
            attributes: ["accommodationId"],
          },
          {
            model: Feedbacks,
            include: [
              {
                model: Users,
                attributes: [
                  "id",
                  "firstName",
                  "lastName",
                  "userEmail",
                  "userRoles",
                ],
                include: [
                  {
                    model: ProfilePictures,
                  },
                ],
              },
            ],
          },
          {
            model: Requests,
            as: "requests",
          },
          {
            model: Ratings,
            as: "rating",
          },
        ],
      });
      return singleAccommodation;
    } catch (error) {
      throw error;
    }
  }
}

export default accommodationService;
