const NotFoundError = require('../../../domain/errors/NotFoundError');
const AuthorizationError = require('../../../domain/errors/AuthorizationError');

/**
 * Use Case: Get Task
 * Retrieves a single task by ID with access control
 */
class GetTask {
  constructor({ taskRepository, projectRepository, cacheService, logger }) {
    this.taskRepository = taskRepository;
    this.projectRepository = projectRepository;
    this.cacheService = cacheService;
    this.logger = logger;
  }

  async execute(taskId, userId, userRole) {
    try {
      this.logger.debug('GetTask use case executing', { taskId, userId });

      // Try to get from cache
      const cacheKey = `task:${taskId}`;
      const cachedTask = await this.cacheService.get(cacheKey);
      
      if (cachedTask) {
        this.logger.debug('Task found in cache', { taskId });
        const task = JSON.parse(cachedTask);
        
        // Still need to check access
        const project = await this.projectRepository.findById(task.projectId);
        if (!this._hasAccess(project, userId, userRole)) {
          throw new AuthorizationError('You do not have access to this task');
        }
        
        return task;
      }

      // Get task from database
      const task = await this.taskRepository.findById(taskId);
      if (!task) {
        throw new NotFoundError('Task not found');
      }

      // Check project access
      const project = await this.projectRepository.findById(task.projectId);
      if (!project) {
        throw new NotFoundError('Associated project not found');
      }

      if (!this._hasAccess(project, userId, userRole)) {
        throw new AuthorizationError('You do not have access to this task');
      }

      // Cache the task
      await this.cacheService.set(cacheKey, JSON.stringify(task), 600); // 10 minutes

      this.logger.info('Task retrieved successfully', { taskId, userId });

      return task;
    } catch (error) {
      this.logger.error('Error in GetTask use case', {
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
    if (project.visibility === 'public') return true;
    return false;
  }
}

module.exports = GetTask;
