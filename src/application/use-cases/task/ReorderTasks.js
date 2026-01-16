const NotFoundError = require('../../../domain/errors/NotFoundError');
const AuthorizationError = require('../../../domain/errors/AuthorizationError');
const ValidationError = require('../../../domain/errors/ValidationError');

/**
 * Use Case: Reorder Tasks
 * Handles Kanban drag-and-drop task reordering with optimistic updates
 */
class ReorderTasks {
  constructor({ taskRepository, projectRepository, cacheService, logger }) {
    this.taskRepository = taskRepository;
    this.projectRepository = projectRepository;
    this.cacheService = cacheService;
    this.logger = logger;
  }

  async execute(taskId, userId, userRole, { newStatus, newOrder }) {
    try {
      this.logger.debug('ReorderTasks use case executing', { 
        taskId, 
        userId, 
        newStatus, 
        newOrder 
      });

      // Validate status
      const validStatuses = ['not_started', 'in_progress', 'completed'];
      if (!validStatuses.includes(newStatus)) {
        throw new ValidationError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
      }

      // Validate order
      if (typeof newOrder !== 'number' || newOrder < 0) {
        throw new ValidationError('Order must be a non-negative number');
      }

      // Get existing task
      const task = await this.taskRepository.findById(taskId);
      if (!task) {
        throw new NotFoundError('Task not found');
      }

      // Check project access
      const project = await this.projectRepository.findById(task.projectId);
      if (!project) {
        throw new NotFoundError('Project not found');
      }

      if (!this._hasAccess(project, userId, userRole)) {
        throw new AuthorizationError('You do not have permission to reorder tasks in this project');
      }

      const oldStatus = task.status;
      const oldOrder = task.order;

      // If no change in status or order, return task as is
      if (oldStatus === newStatus && oldOrder === newOrder) {
        this.logger.debug('No change in task order', { taskId });
        return task;
      }

      // Update the task with new status and order
      const updatedTask = await this.taskRepository.update(taskId, {
        status: newStatus,
        order: newOrder,
        modifiedBy: userId,
      });

      // Invalidate caches
      await Promise.all([
        this.cacheService.del(`task:${taskId}`),
        this.cacheService.delPattern(`task:project:${task.projectId}:*`),
      ]);

      this.logger.info('Task reordered successfully', {
        taskId,
        userId,
        projectId: task.projectId,
        oldStatus,
        oldOrder,
        newStatus,
        newOrder,
      });

      return updatedTask;
    } catch (error) {
      this.logger.error('Error in ReorderTasks use case', {
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

module.exports = ReorderTasks;
