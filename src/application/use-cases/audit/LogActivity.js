/**
 * Use Case: Log Activity
 * Records an audit log entry for system activities
 */
class LogActivity {
  constructor({ auditLogRepository, logger }) {
    this.auditLogRepository = auditLogRepository;
    this.logger = logger;
  }

  async execute(logData) {
    try {
      const { entityType, entityId, action, userId, changes, ipAddress, userAgent } = logData;

      this.logger.debug('Creating audit log', { entityType, entityId, action, userId });

      // Create audit log
      const auditLog = await this.auditLogRepository.create({
        entityType,
        entityId,
        action,
        userId,
        changes: changes || {},
        ipAddress: ipAddress || null,
        userAgent: userAgent || null,
      });

      this.logger.info('Audit log created', {
        id: auditLog.id,
        entityType,
        action,
      });

      return auditLog;
    } catch (error) {
      this.logger.error('Error in LogActivity use case', {
        error: error.message,
        entityType: logData.entityType,
      });
      throw error;
    }
  }
}

module.exports = LogActivity;
