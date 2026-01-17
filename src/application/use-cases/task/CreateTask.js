const ValidationError = require('../../../domain/errors/ValidationError');
const NotFoundError = require('../../../domain/errors/NotFoundError');
const AuthorizationError = require('../../../domain/errors/AuthorizationError');

/**
 * Use Case: Create Task
 * Creates a new task in a project
 */
class CreateTask {
  constructor({ taskRepository, projectRepository, cacheService, logger }) {
    this.taskRepository = taskRepository;
    this.projectRepository = projectRepository;
    this.cacheService = cacheService;
    this.logger = logger;
  }

  async execute(taskData, userId, userRole) {
    const { title, description, status, priority, projectId, assigneeId, dueDate } = taskData;
    
    try {
      this.logger.debug('CreateTask use case executing', { title, projectId, userId });

      // Validate required fields
      if (!title) {
        throw new ValidationError('Task title is required');
      }

      if (!projectId) {
        throw new ValidationError('Project ID is required');
      }

      // Check if project exists and user has access
      const project = await this.projectRepository.findById(projectId);
      if (!project) {
        throw new NotFoundError('Project not found');
      }

      // Check if user is project owner or member
      if (project.ownerId !== userId && !project.members.includes(userId)) {
        throw new AuthorizationError('You do not have access to this project');
      }

      // Get max order for the status to place task at end
      const maxOrder = await this.taskRepository.getMaxOrder(projectId, status || 'not_started');

      // Create task
      const task = await this.taskRepository.create({
        title,
        description,
        status,
        priority,
        projectId,
        assigneeId,
        dueDate,
        order: maxOrder + 1,
        createdBy: userId,
        modifiedBy: userId,
      });

      // Invalidate project tasks cache
      await this.cacheService.delPattern(`task:project:${projectId}:*`);

      this.logger.info('Task created successfully', {
        taskId: task.id,
        projectId,
        userId,
      });

      return task;
    } catch (error) {
      this.logger.error('Error in CreateTask use case', {
        error: error.message,
        userId,
        projectId,
      });
      throw error;
    }
  }
}

module.exports = CreateTask;
