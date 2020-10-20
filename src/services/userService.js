import database from "../database/models";
import UserProfile from './userProfileService';

const { Users } = database;

/** Class representing UserService */
class UserService {
  /**
   * Creates a new user.
   * @param {object} user - user object.
   * @returns {object} - created user object
   */
  static async createUser(user) {
    try {
      const createdUser = await Users.create(user);

      // Create user profile
      await UserProfile.updateOrCreate(createdUser.id);

      return createdUser;
    } catch (error) {
      throw error;
    }
  }
}
