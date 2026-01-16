const NotFoundError = require('../../../domain/errors/NotFoundError');
const AuthorizationError = require('../../../domain/errors/AuthorizationError');

/**
 * Use Case: Delete Task
 * Removes a task from the system
 */
class DeleteTask {
  constructor({ taskRepository, projectRepository, cacheService, logger }) {
    this.taskRepository = taskRepository;
    this.projectRepository = projectRepository;
    this.cacheService = cacheService;
    this.logger = logger;
  }

  async execute(taskId, userId, userRole) {
    try {
      this.logger.debug('DeleteTask use case executing', { taskId, userId });

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
        throw new AuthorizationError('You do not have permission to delete tasks in this project');
      }

      // Delete the task
      await this.taskRepository.delete(taskId);

      // Invalidate caches
      await Promise.all([
        this.cacheService.del(`task:${taskId}`),
        this.cacheService.delPattern(`task:project:${task.projectId}:*`),
      ]);

      this.logger.info('Task deleted successfully', {
        taskId,
        userId,
        projectId: task.projectId,
      });

      return { success: true, message: 'Task deleted successfully' };
    } catch (error) {
      this.logger.error('Error in DeleteTask use case', {
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

module.exports = DeleteTask;
