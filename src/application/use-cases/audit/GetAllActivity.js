/**
 * Use Case: Get All Activity (Admin Only)
 * Retrieves all audit logs with filtering
 */
const AuthorizationError = require('../../../domain/errors/AuthorizationError');

class GetAllActivity {
  constructor({ auditLogRepository, logger }) {
    this.auditLogRepository = auditLogRepository;
    this.logger = logger;
  }

  async execute(userRole, options = {}) {
    try {
      this.logger.debug('Getting all activity', { userRole });

      // Authorization: Admin only
      if (userRole !== 'admin') {
        throw new AuthorizationError('Only admins can view all activity');
      }

      // Get audit logs
      const {
        limit = 100,
        skip = 0,
        entityType = null,
        action = null,
        startDate = null,
        endDate = null,
      } = options;

      const logs = await this.auditLogRepository.findAll({
        limit,
        skip,
        entityType,
        action,
        startDate,
        endDate,
      });

      const filter = {};
      if (entityType) filter.entityType = entityType;
      if (action) filter.action = action;
      if (startDate || endDate) {
        filter.createdAt = {};
        if (startDate) filter.createdAt.$gte = new Date(startDate);
        if (endDate) filter.createdAt.$lte = new Date(endDate);
      }

      const total = await this.auditLogRepository.count(filter);

      this.logger.info('All activity retrieved', {
        count: logs.length,
        filters: { entityType, action, startDate, endDate },
      });

      return {
        logs,
        pagination: {
          total,
          limit,
          skip,
          hasMore: skip + logs.length < total,
        },
      };
    } catch (error) {
      this.logger.error('Error in GetAllActivity use case', {
        error: error.message,
      });
      throw error;
    }
  }
}

module.exports = GetAllActivity;
