const NotFoundError = require('../../../domain/errors/NotFoundError');
const AuthorizationError = require('../../../domain/errors/AuthorizationError');
const ValidationError = require('../../../domain/errors/ValidationError');

/**
 * Use Case: Update Task Priority
 * Changes the priority level of a task
 */
class UpdateTaskPriority {
  constructor({ taskRepository, projectRepository, cacheService, logger }) {
    this.taskRepository = taskRepository;
    this.projectRepository = projectRepository;
    this.cacheService = cacheService;
    this.logger = logger;
  }

  async execute(taskId, userId, userRole, newPriority) {
    try {
      this.logger.debug('UpdateTaskPriority use case executing', { taskId, userId, newPriority });

      // Validate priority
      const validPriorities = ['none', 'low', 'medium', 'high'];
      if (!validPriorities.includes(newPriority)) {
        throw new ValidationError(`Invalid priority. Must be one of: ${validPriorities.join(', ')}`);
      }

      // Get existing task
      const task = await this.taskRepository.findById(taskId);
      if (!task) {
        throw new NotFoundError('Task not found');
      }

      // Check if priority is already the same
      if (task.priority === newPriority) {
        this.logger.debug('Task already has the requested priority', { taskId, priority: newPriority });
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

      // Update task priority
      const updatedTask = await this.taskRepository.update(taskId, {
        priority: newPriority,
        modifiedBy: userId,
      });

      // Invalidate caches
      await Promise.all([
        this.cacheService.del(`task:${taskId}`),
        this.cacheService.delPattern(`task:project:${task.projectId}:*`),
      ]);

      this.logger.info('Task priority updated successfully', {
        taskId,
        userId,
        oldPriority: task.priority,
        newPriority,
        projectId: task.projectId,
      });

      return updatedTask;
    } catch (error) {
      this.logger.error('Error in UpdateTaskPriority use case', {
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

module.exports = UpdateTaskPriority;
