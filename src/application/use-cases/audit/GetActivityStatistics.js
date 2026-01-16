/**
 * Use Case: Get Activity Statistics (Admin Only)
 * Retrieves aggregated statistics about audit logs
 */
const AuthorizationError = require('../../../domain/errors/AuthorizationError');

class GetActivityStatistics {
  constructor({ auditLogRepository, logger }) {
    this.auditLogRepository = auditLogRepository;
    this.logger = logger;
  }

  async execute(userRole, options = {}) {
    try {
      this.logger.debug('Getting activity statistics', { userRole });

      // Authorization: Admin only
      if (userRole !== 'admin') {
        throw new AuthorizationError('Only admins can view activity statistics');
      }

      const { startDate = null, endDate = null } = options;

      // Get statistics by action
      const actionStats = await this.auditLogRepository.getStatistics({
        startDate,
        endDate,
      });

      // Get total count
      const filter = {};
      if (startDate || endDate) {
        filter.createdAt = {};
        if (startDate) filter.createdAt.$gte = new Date(startDate);
        if (endDate) filter.createdAt.$lte = new Date(endDate);
      }
      const totalLogs = await this.auditLogRepository.count(filter);

      // Calculate percentages
      const actionStatsWithPercentage = actionStats.map(stat => ({
        action: stat.action,
        count: stat.count,
        percentage: totalLogs > 0 ? Math.round((stat.count / totalLogs) * 100) : 0,
      }));

      this.logger.info('Activity statistics retrieved', {
        totalLogs,
        actionCount: actionStats.length,
      });

      return {
        totalLogs,
        byAction: actionStatsWithPercentage,
        dateRange: {
          startDate: startDate || null,
          endDate: endDate || null,
        },
      };
    } catch (error) {
      this.logger.error('Error in GetActivityStatistics use case', {
        error: error.message,
      });
      throw error;
    }
  }
}

module.exports = GetActivityStatistics;
