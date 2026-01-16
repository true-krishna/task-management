/**
 * AuditLog Controller
 * Handles audit log and activity tracking requests
 */
class AuditLogController {
  constructor({ logActivity, getEntityActivity, getUserActivity, getAllActivity, getActivityStatistics, logger }) {
    this.logActivityUseCase = logActivity;
    this.getEntityActivityUseCase = getEntityActivity;
    this.getUserActivityUseCase = getUserActivity;
    this.getAllActivityUseCase = getAllActivity;
    this.getActivityStatisticsUseCase = getActivityStatistics;
    this.logger = logger;
  }

  /**
   * Get activity logs for a specific entity
   * @route GET /api/v1/audit/:entityType/:entityId
   * @access Private
   */
  async getEntityActivity(req, res, next) {
    try {
      const { entityType, entityId } = req.params;
      const { id: userId, role: userRole } = req.user;
      const { limit, skip } = req.query;

      this.logger.info('Getting entity activity', { entityType, entityId, userId });

      const result = await this.getEntityActivityUseCase.execute(
        entityType,
        entityId,
        userId,
        userRole,
        {
          limit: limit ? parseInt(limit) : 50,
          skip: skip ? parseInt(skip) : 0,
        }
      );

      res.status(200).json({
        success: true,
        data: result.logs,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get activity logs for a specific user
   * @route GET /api/v1/audit/user/:userId
   * @access Private
   */
  async getUserActivity(req, res, next) {
    try {
      const { userId: targetUserId } = req.params;
      const { id: currentUserId, role: currentUserRole } = req.user;
      const { limit, skip, entityType } = req.query;

      this.logger.info('Getting user activity', { targetUserId, currentUserId });

      const result = await this.getUserActivityUseCase.execute(
        targetUserId,
        currentUserId,
        currentUserRole,
        {
          limit: limit ? parseInt(limit) : 50,
          skip: skip ? parseInt(skip) : 0,
          entityType: entityType || null,
        }
      );

      res.status(200).json({
        success: true,
        data: result.logs,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all activity logs (admin only)
   * @route GET /api/v1/audit
   * @access Admin
   */
  async getAllActivity(req, res, next) {
    try {
      const { role: userRole } = req.user;
      const { limit, skip, entityType, action, startDate, endDate } = req.query;

      this.logger.info('Getting all activity', { userRole });

      const result = await this.getAllActivityUseCase.execute(userRole, {
        limit: limit ? parseInt(limit) : 100,
        skip: skip ? parseInt(skip) : 0,
        entityType: entityType || null,
        action: action || null,
        startDate: startDate || null,
        endDate: endDate || null,
      });

      res.status(200).json({
        success: true,
        data: result.logs,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get activity statistics (admin only)
   * @route GET /api/v1/audit/statistics
   * @access Admin
   */
  async getActivityStatistics(req, res, next) {
    try {
      const { role: userRole } = req.user;
      const { startDate, endDate } = req.query;

      this.logger.info('Getting activity statistics', { userRole });

      const stats = await this.getActivityStatisticsUseCase.execute(userRole, {
        startDate: startDate || null,
        endDate: endDate || null,
      });

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuditLogController;
