const NotFoundError = require('../../../domain/errors/NotFoundError');
const AuthorizationError = require('../../../domain/errors/AuthorizationError');
const ValidationError = require('../../../domain/errors/ValidationError');

/**
 * Use Case: Assign Task
 * Assigns a task to a user (must be project member)
 */
class AssignTask {
  constructor({ taskRepository, projectRepository, userRepository, cacheService, logger }) {
    this.taskRepository = taskRepository;
    this.projectRepository = projectRepository;
    this.userRepository = userRepository;
    this.cacheService = cacheService;
    this.logger = logger;
  }

  async execute(taskId, userId, userRole, assigneeId) {
    try {
      this.logger.debug('AssignTask use case executing', { taskId, userId, assigneeId });

      if (!assigneeId) {
        throw new ValidationError('Assignee ID is required');
      }

      // Get existing task
      const task = await this.taskRepository.findById(taskId);
      if (!task) {
        throw new NotFoundError('Task not found');
      }

      // Check if task is already assigned to the user
      if (task.assigneeId === assigneeId) {
        this.logger.debug('Task already assigned to this user', { taskId, assigneeId });
        return task;
      }

      // Check project access
      const project = await this.projectRepository.findById(task.projectId);
      if (!project) {
        throw new NotFoundError('Project not found');
      }

      if (!this._hasAccess(project, userId, userRole)) {
        throw new AuthorizationError('You do not have permission to assign tasks in this project');
      }

      // Verify assignee exists
      const assignee = await this.userRepository.findById(assigneeId);
      if (!assignee) {
        throw new NotFoundError('Assignee user not found');
      }

      if (!assignee.isActive) {
        throw new ValidationError('Cannot assign task to an inactive user');
      }

      // Verify assignee is a member of the project
      if (assigneeId !== project.ownerId && !project.members.includes(assigneeId)) {
        throw new ValidationError('Assignee must be a member of the project');
      }

      // Assign task
      const updatedTask = await this.taskRepository.update(taskId, {
        assigneeId,
        modifiedBy: userId,
      });

      // Invalidate caches
      await Promise.all([
        this.cacheService.del(`task:${taskId}`),
        this.cacheService.delPattern(`task:project:${task.projectId}:*`),
      ]);

      this.logger.info('Task assigned successfully', {
        taskId,
        userId,
        assigneeId,
        projectId: task.projectId,
      });

      return updatedTask;
    } catch (error) {
      this.logger.error('Error in AssignTask use case', {
        error: error.message,
        taskId,
        userId,
        assigneeId,
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

module.exports = AssignTask;
