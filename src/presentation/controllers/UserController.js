/**
 * User Controller
 * Handles HTTP requests for user management endpoints
 */
class UserController {
  /**
   * @param {Object} dependencies - Injected dependencies
   * @param {Object} dependencies.getUserProfile - GetUserProfile use case
   * @param {Object} dependencies.updateUserProfile - UpdateUserProfile use case
   * @param {Object} dependencies.getAllUsers - GetAllUsers use case
   * @param {Object} dependencies.updateUserRole - UpdateUserRole use case
   * @param {Object} dependencies.deactivateUser - DeactivateUser use case
   * @param {Object} dependencies.logger - Logger instance
   */
  constructor({ getUserProfile, updateUserProfile, getAllUsers, updateUserRole, deactivateUser, logger }) {
    this.getUserProfile = getUserProfile;
    this.updateUserProfile = updateUserProfile;
    this.getAllUsers = getAllUsers;
    this.updateUserRole = updateUserRole;
    this.deactivateUser = deactivateUser;
    this.logger = logger;

    // Bind methods to preserve context
    this.getProfile = this.getProfile.bind(this);
    this.updateProfile = this.updateProfile.bind(this);
    this.listUsers = this.listUsers.bind(this);
    this.changeUserRole = this.changeUserRole.bind(this);
    this.deactivateUserAccount = this.deactivateUserAccount.bind(this);
  }

  /**
   * GET /api/v1/users/profile
   * Get current user's profile
   */
  async getProfile(req, res, next) {
    try {
      const userId = req.user.id;

      this.logger.http('GET /api/v1/users/profile', { userId });

      const profile = await this.getUserProfile.execute(userId);

      return res.status(200).json({
        success: true,
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/v1/users/profile
   * Update current user's profile
   */
  async updateProfile(req, res, next) {
    try {
      const userId = req.user.id;
      const updateData = req.body;

      this.logger.http('PUT /api/v1/users/profile', {
        userId,
        fields: Object.keys(updateData),
      });

      const updatedProfile = await this.updateUserProfile.execute(userId, updateData);

      return res.status(200).json({
        success: true,
        data: updatedProfile,
        message: 'Profile updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/users
   * Get all users (admin only)
   */
  async listUsers(req, res, next) {
    try {
      const { page, limit, role, isActive } = req.query;

      this.logger.http('GET /api/v1/users', {
        adminId: req.user.id,
        page,
        limit,
        role,
        isActive,
      });

      const result = await this.getAllUsers.execute({
        page: page ? parseInt(page, 10) : undefined,
        limit: limit ? parseInt(limit, 10) : undefined,
        role,
        isActive: isActive !== undefined ? isActive === 'true' : undefined,
      });

      return res.status(200).json({
        success: true,
        data: result.users,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/v1/users/:id/role
   * Update user role (admin only)
   */
  async changeUserRole(req, res, next) {
    try {
      const { id: userId } = req.params;
      const { role: newRole } = req.body;
      const adminId = req.user.id;

      this.logger.http('PUT /api/v1/users/:id/role', {
        userId,
        newRole,
        adminId,
      });

      const updatedUser = await this.updateUserRole.execute(userId, newRole, adminId);

      return res.status(200).json({
        success: true,
        data: updatedUser,
        message: 'User role updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/users/:id
   * Deactivate user (admin only)
   */
  async deactivateUserAccount(req, res, next) {
    try {
      const { id: userId } = req.params;
      const adminId = req.user.id;

      this.logger.http('DELETE /api/v1/users/:id', {
        userId,
        adminId,
      });

      const result = await this.deactivateUser.execute(userId, adminId);

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
