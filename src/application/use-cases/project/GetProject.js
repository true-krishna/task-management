const NotFoundError = require('../../../domain/errors/NotFoundError');
const AuthorizationError = require('../../../domain/errors/AuthorizationError');

/**
 * Use Case: Get Project
 * Retrieves a project by ID with access control
 */
class GetProject {
  constructor({ projectRepository, cacheService, logger }) {
    this.projectRepository = projectRepository;
    this.cacheService = cacheService;
    this.logger = logger;
  }

  async execute(projectId, userId, userRole) {
    try {
      this.logger.debug('GetProject use case executing', { projectId, userId });

      // Check cache first
      const cacheKey = `project:${projectId}`;
      const cachedProject = await this.cacheService.get(cacheKey);

      let project;
      if (cachedProject) {
        this.logger.debug('Project found in cache', { projectId });
        project = JSON.parse(cachedProject);
      } else {
        // Get from database
        project = await this.projectRepository.findById(projectId);

        if (!project) {
          throw new NotFoundError('Project not found');
        }

        // Cache the project (10 minutes)
        await this.cacheService.set(cacheKey, JSON.stringify(project), 600);
      }

      // Check access permissions
      const hasAccess = this._checkAccess(project, userId, userRole);
      if (!hasAccess) {
        throw new AuthorizationError('You do not have access to this project');
      }

      this.logger.info('Project retrieved successfully', { projectId, userId });

      return project;
    } catch (error) {
      this.logger.error('Error in GetProject use case', {
        projectId,
        userId,
        error: error.message,
      });
      throw error;
    }
  }

  _checkAccess(project, userId, userRole) {
    // Admin has access to all projects
    if (userRole === 'admin') {
      return true;
    }

    // Owner has access
    if (project.ownerId === userId) {
      return true;
    }

    // Check visibility
    if (project.visibility === 'public') {
      return true;
    }

    if (project.visibility === 'team') {
      // Check if user is a member
      return project.members.includes(userId);
    }

    // Private project - only owner has access (already checked above)
    return false;
  }
}

module.exports = GetProject;
