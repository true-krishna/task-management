/**
 * AuditLog Repository
 * Handles audit log data persistence
 */
const AuditLog = require('../../domain/entities/AuditLog');
const AuditLogModel = require('../database/mongoose/schemas/AuditLogSchema');

class AuditLogRepository {
  constructor({ logger }) {
    this.logger = logger;
  }

  /**
   * Create an audit log entry
   */
  async create(auditLogData) {
    try {
      const auditLog = new AuditLogModel(auditLogData);
      const savedLog = await auditLog.save();
      
      this.logger.debug('Audit log created', { id: savedLog._id });
      
      return this._mapToEntity(savedLog);
    } catch (error) {
      this.logger.error('Error creating audit log', { error: error.message });
      throw error;
    }
  }

  /**
   * Find audit logs by entity
   */
  async findByEntity(entityType, entityId, options = {}) {
    try {
      const { limit = 50, skip = 0 } = options;

      const logs = await AuditLogModel.find({ entityType, entityId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip)
        .populate('userId', 'firstName lastName email')
        .lean();

      return logs.map(log => this._mapToEntity(log));
    } catch (error) {
      this.logger.error('Error finding audit logs by entity', { error: error.message });
      throw error;
    }
  }

  /**
   * Find audit logs by user
   */
  async findByUser(userId, options = {}) {
    try {
      const { limit = 50, skip = 0, entityType = null } = options;

      const query = { userId };
      if (entityType) {
        query.entityType = entityType;
      }

      const logs = await AuditLogModel.find(query)
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip)
        .lean();

      return logs.map(log => this._mapToEntity(log));
    } catch (error) {
      this.logger.error('Error finding audit logs by user', { error: error.message });
      throw error;
    }
  }

  /**
   * Find all audit logs (admin only)
   */
  async findAll(options = {}) {
    try {
      const { limit = 100, skip = 0, entityType = null, action = null, startDate = null, endDate = null } = options;

      const query = {};
      if (entityType) query.entityType = entityType;
      if (action) query.action = action;
      if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = new Date(startDate);
        if (endDate) query.createdAt.$lte = new Date(endDate);
      }

      const logs = await AuditLogModel.find(query)
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip)
        .populate('userId', 'firstName lastName email')
        .lean();

      return logs.map(log => this._mapToEntity(log));
    } catch (error) {
      this.logger.error('Error finding all audit logs', { error: error.message });
      throw error;
    }
  }

  /**
   * Count audit logs
   */
  async count(filter = {}) {
    try {
      return await AuditLogModel.countDocuments(filter);
    } catch (error) {
      this.logger.error('Error counting audit logs', { error: error.message });
      throw error;
    }
  }

  /**
   * Get statistics
   */
  async getStatistics(options = {}) {
    try {
      const { startDate, endDate } = options;
      
      const matchStage = {};
      if (startDate || endDate) {
        matchStage.createdAt = {};
        if (startDate) matchStage.createdAt.$gte = new Date(startDate);
        if (endDate) matchStage.createdAt.$lte = new Date(endDate);
      }

      const stats = await AuditLogModel.aggregate([
        ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
        {
          $group: {
            _id: '$action',
            count: { $sum: 1 },
          },
        },
      ]);

      return stats.map(stat => ({
        action: stat._id,
        count: stat.count,
      }));
    } catch (error) {
      this.logger.error('Error getting audit log statistics', { error: error.message });
      throw error;
    }
  }

  /**
   * Map database model to domain entity
   */
  _mapToEntity(log) {
    if (!log) return null;

    return new AuditLog({
      id: log._id ? log._id.toString() : log.id,
      entityType: log.entityType,
      entityId: log.entityId.toString(),
      action: log.action,
      userId: log.userId._id ? log.userId._id.toString() : log.userId.toString(),
      changes: log.changes,
      createdAt: log.createdAt,
      ipAddress: log.ipAddress,
      userAgent: log.userAgent,
    });
  }
}

module.exports = AuditLogRepository;
