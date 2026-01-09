/**
 * AuditLog Entity
 * Represents an audit log entry in the system
 */
class AuditLog {
  constructor({
    id,
    entityType,
    entityId,
    action,
    userId,
    changes = {},
    createdAt = new Date(),
    ipAddress = null,
    userAgent = null,
  }) {
    this.id = id;
    this.entityType = entityType;
    this.entityId = entityId;
    this.action = action;
    this.userId = userId;
    this.changes = changes;
    this.createdAt = createdAt;
    this.ipAddress = ipAddress;
    this.userAgent = userAgent;
  }

  /**
   * Get human-readable description
   */
  getDescription() {
    return `${this.action.toUpperCase()} ${this.entityType} by user`;
  }
}

module.exports = AuditLog;
