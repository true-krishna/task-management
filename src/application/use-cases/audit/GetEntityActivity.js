/**
 * Use Case: Get Entity Activity
 * Retrieves audit logs for a specific entity
 */
const NotFoundError = require('../../../domain/errors/NotFoundError');

class GetEntityActivity {
  constructor({ auditLogRepository, projectRepository, taskRepository, logger }) {
    this.auditLogRepository = auditLogRepository;
    this.projectRepository = projectRepository;
    this.taskRepository = taskRepository;
    this.logger = logger;
  }

  async execute(entityType, entityId, userId, userRole, options = {}) {
    try {
      this.logger.debug('Getting entity activity', { entityType, entityId, userId });

      // Verify entity exists and user has access
      await this._verifyAccess(entityType, entityId, userId, userRole);

      // Get audit logs
      const { limit = 50, skip = 0 } = options;
      const logs = await this.auditLogRepository.findByEntity(entityType, entityId, {
        limit,
        skip,
      });

      const total = await this.auditLogRepository.count({ entityType, entityId });

      this.logger.info('Entity activity retrieved', {
        entityType,
        entityId,
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
      this.logger.error('Error in GetEntityActivity use case', {
        error: error.message,
        entityType,
        entityId,
      });
      throw error;
    }
  }

  async _verifyAccess(entityType, entityId, userId, userRole) {
    if (entityType === 'project') {
      const project = await this.projectRepository.findById(entityId);
      if (!project) {
        throw new NotFoundError('Project not found');
      }
      
      // Check if user has access to this project
      const hasAccess = 
        userRole === 'admin' ||
        project.ownerId === userId ||
        project.members.includes(userId) ||
        project.visibility === 'public';
      
      if (!hasAccess) {
        throw new NotFoundError('Project not found');
      }
    } else if (entityType === 'task') {
      const task = await this.taskRepository.findById(entityId);
      if (!task) {
        throw new NotFoundError('Task not found');
      }
      
      // Verify access through project
      const project = await this.projectRepository.findById(task.projectId);
      if (!project) {
        throw new NotFoundError('Project not found');
      }
      
      const hasAccess = 
        userRole === 'admin' ||
        project.ownerId === userId ||
        project.members.includes(userId) ||
        project.visibility === 'public';
      
      if (!hasAccess) {
        throw new NotFoundError('Task not found');
      }
    }
  }
}

module.exports = GetEntityActivity;
