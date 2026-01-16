/**
 * Use Case: Get User Activity
 * Retrieves audit logs for a specific user
 */
const AuthorizationError = require('../../../domain/errors/AuthorizationError');

class GetUserActivity {
  constructor({ auditLogRepository, logger }) {
    this.auditLogRepository = auditLogRepository;
    this.logger = logger;
  }

  async execute(targetUserId, currentUserId, currentUserRole, options = {}) {
    try {
      this.logger.debug('Getting user activity', { targetUserId, currentUserId });

      // Authorization: Users can only see their own activity, admins can see all
      if (currentUserRole !== 'admin' && targetUserId !== currentUserId) {
        throw new AuthorizationError('You can only view your own activity');
      }

      // Get audit logs
      const { limit = 50, skip = 0, entityType = null } = options;
      const logs = await this.auditLogRepository.findByUser(targetUserId, {
        limit,
        skip,
        entityType,
      });

      const filter = { userId: targetUserId };
      if (entityType) filter.entityType = entityType;
      const total = await this.auditLogRepository.count(filter);

      this.logger.info('User activity retrieved', {
        userId: targetUserId,
        count: logs.length,
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
      this.logger.error('Error in GetUserActivity use case', {
        error: error.message,
        targetUserId,
      });
      throw error;
    }
  }
}

module.exports = GetUserActivity;
