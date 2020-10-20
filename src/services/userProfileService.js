import database from "../database/models";

const { UserProfile, Users, ProfilePictures } = database;

/** Class that handles user profile service */

class UserProfileService {
  /**
   * Creates or updates user profile
   * @param {number} userId - user id
   * @param {object} profileData - user profile
   * @returns {object} updated profile
   */
  static async updateOrCreate(userId, profileData = null) {
    try {
      const profileFound = await UserProfile.findOne({ where: { userId } });

      if (!profileFound) await UserProfile.create({ userId });

      const updatedProfile = await UserProfile.update(profileData, {
        where: { userId },
      });
      return updatedProfile;
    } catch (error) {
      throw error;
    }
  }

  /**
   * gets user profile
   * @param {number} userId - user id
   * @returns {object} user profile
   */
  static async getProfile(userId) {
    try {
      const profile = await Users.findOne({
        attributes: ["firstName", "lastName", "userEmail", "userRoles"],
        where: { id: userId },
        include: [{ model: UserProfile, as: "userProfile" }],
      });

      return profile;
    } catch (error) {
      throw error;
    }
  }
}
