const NotFoundError = require('../../../domain/errors/NotFoundError');
const AuthorizationError = require('../../../domain/errors/AuthorizationError');

/**
 * Use Case: Get Project Tasks
 * Retrieves all tasks for a project with filtering
 */
class GetProjectTasks {
  constructor({ taskRepository, projectRepository, cacheService, logger }) {
    this.taskRepository = taskRepository;
    this.projectRepository = projectRepository;
    this.cacheService = cacheService;
    this.logger = logger;
  }

  async execute(projectId, userId, userRole, filters = {}) {
    try {
      this.logger.debug('GetProjectTasks use case executing', { projectId, userId, filters });

      // Check if project exists and user has access
      const project = await this.projectRepository.findById(projectId);
      if (!project) {
        throw new NotFoundError('Project not found');
      }

      if (!this._hasAccess(project, userId, userRole)) {
        throw new AuthorizationError('You do not have access to this project');
      }

      // Build cache key
      const { status, priority, assigneeId } = filters;
      const cacheKey = `task:project:${projectId}:${status || 'all'}:${priority || 'all'}:${assigneeId || 'all'}`;
      
      // Try to get from cache
      const cachedTasks = await this.cacheService.get(cacheKey);
      if (cachedTasks) {
        this.logger.debug('Tasks found in cache', { projectId });
        return JSON.parse(cachedTasks);
      }

      // Build query filter
      const query = { projectId };
      if (status) query.status = status;
      if (priority) query.priority = priority;
      if (assigneeId) query.assigneeId = assigneeId;

      // Get tasks from database
      const tasks = await this.taskRepository.findAll(query, {
        sort: { status: 1, order: 1, createdAt: -1 },
      });

      // Group tasks by status for Kanban view
      const groupedTasks = {
        not_started: [],
        in_progress: [],
        completed: [],
      };

      tasks.forEach(task => {
        if (groupedTasks[task.status]) {
          groupedTasks[task.status].push(task);
        }
      });

      const result = {
        projectId,
        tasks,
        groupedByStatus: groupedTasks,
        total: tasks.length,
      };

      // Cache the result
      await this.cacheService.set(cacheKey, JSON.stringify(result), 300); // 5 minutes

      this.logger.info('Project tasks retrieved successfully', {
        projectId,
        userId,
        count: tasks.length,
      });

      return result;
    } catch (error) {
      this.logger.error('Error in GetProjectTasks use case', {
        error: error.message,
        projectId,
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

module.exports = GetProjectTasks;
