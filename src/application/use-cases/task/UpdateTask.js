const NotFoundError = require('../../../domain/errors/NotFoundError');
const AuthorizationError = require('../../../domain/errors/AuthorizationError');
const ValidationError = require('../../../domain/errors/ValidationError');

/**
 * Use Case: Update Task
 * Updates task fields with validation
 */
class UpdateTask {
  constructor({ taskRepository, projectRepository, cacheService, logger }) {
    this.taskRepository = taskRepository;
    this.projectRepository = projectRepository;
    this.cacheService = cacheService;
    this.logger = logger;
  }

  async execute(taskId, userId, userRole, updates) {
    try {
      this.logger.debug('UpdateTask use case executing', { taskId, userId, updates });

      // Validate at least one field to update
      if (!updates || Object.keys(updates).length === 0) {
        throw new ValidationError('At least one field must be provided for update');
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
        throw new AuthorizationError('You do not have permission to update tasks in this project');
      }

      // If assigneeId is being updated, verify the user is a project member
      if (updates.assigneeId) {
        if (updates.assigneeId !== project.ownerId && !project.members.includes(updates.assigneeId)) {
          throw new ValidationError('Assignee must be a member of the project');
        }
      }

      // Prepare update data
      const updateData = {
        ...updates,
        modifiedBy: userId,
      };

      // Update task
      const updatedTask = await this.taskRepository.update(taskId, updateData);

      // Invalidate caches
      await Promise.all([
        this.cacheService.del(`task:${taskId}`),
        this.cacheService.delPattern(`task:project:${task.projectId}:*`),
      ]);

      this.logger.info('Task updated successfully', {
        taskId,
        userId,
        projectId: task.projectId,
      });

      return updatedTask;
    } catch (error) {
      this.logger.error('Error in UpdateTask use case', {
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

module.exports = UpdateTask;
