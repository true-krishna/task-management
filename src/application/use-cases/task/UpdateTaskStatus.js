const NotFoundError = require('../../../domain/errors/NotFoundError');
const AuthorizationError = require('../../../domain/errors/AuthorizationError');
const ValidationError = require('../../../domain/errors/ValidationError');

/**
 * Use Case: Update Task Status
 * Moves task between Kanban columns (status change)
 */
class UpdateTaskStatus {
  constructor({ taskRepository, projectRepository, cacheService, logger }) {
    this.taskRepository = taskRepository;
    this.projectRepository = projectRepository;
    this.cacheService = cacheService;
    this.logger = logger;
  }

  async execute(taskId, userId, userRole, newStatus) {
    try {
      this.logger.debug('UpdateTaskStatus use case executing', { taskId, userId, newStatus });

      // Validate status
      const validStatuses = ['not_started', 'in_progress', 'completed'];
      if (!validStatuses.includes(newStatus)) {
        throw new ValidationError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
      }

      // Get existing task
      const task = await this.taskRepository.findById(taskId);
      if (!task) {
        throw new NotFoundError('Task not found');
      }

      // Check if status is already the same
      if (task.status === newStatus) {
        this.logger.debug('Task already has the requested status', { taskId, status: newStatus });
        return task;
      }

      // Check project access
      const project = await this.projectRepository.findById(task.projectId);
      if (!project) {
        throw new NotFoundError('Project not found');
      }

      if (!this._hasAccess(project, userId, userRole)) {
        throw new AuthorizationError('You do not have permission to update tasks in this project');
      }

      // Get max order in new status column to place task at the end
      const maxOrder = await this.taskRepository.getMaxOrder(task.projectId, newStatus);

      // Update task with new status and order
      const updatedTask = await this.taskRepository.update(taskId, {
        status: newStatus,
        order: maxOrder + 1,
        modifiedBy: userId,
      });

      // Invalidate caches
      await Promise.all([
        this.cacheService.del(`task:${taskId}`),
        this.cacheService.delPattern(`task:project:${task.projectId}:*`),
      ]);

      this.logger.info('Task status updated successfully', {
        taskId,
        userId,
        oldStatus: task.status,
        newStatus,
        projectId: task.projectId,
      });

      return updatedTask;
    } catch (error) {
      this.logger.error('Error in UpdateTaskStatus use case', {
        error: error.message,
        taskId,
        userId,
      });
      throw error;
    }
  }

  _hasAccess(project, userId, userRole) {
    if (userRole === 'admin') return true;
    if (project.ownerId === userId) return true;
    if (project.members.includes(userId)) return true;
    return false;
  }
}

module.exports = UpdateTaskStatus;
