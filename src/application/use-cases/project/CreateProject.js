const ValidationError = require('../../../domain/errors/ValidationError');

/**
 * Use Case: Create Project
 * Creates a new project with the authenticated user as owner
 */
class CreateProject {
  constructor({ projectRepository, cacheService, logger }) {
    this.projectRepository = projectRepository;
    this.cacheService = cacheService;
    this.logger = logger;
  }

  async execute({ name, description, status, visibility, userId }) {
    try {
      this.logger.debug('CreateProject use case executing', { userId, name, description, status, visibility });

      // Validate required fields
      if (!name) {
        throw new ValidationError('Project name is required');
      }

      // Prepare project data
      const projectData = {
        name,
        description,
        status,
        visibility,
        ownerId: userId,
        createdBy: userId,
        modifiedBy: userId,
        members: [userId],
      };

      this.logger.debug('Project data prepared', projectData);

      // Create project with user as owner
      const project = await this.projectRepository.create(projectData);

      // Invalidate user's project cache
      await this.cacheService.del(`project:user:${userId}`);

      this.logger.info('Project created successfully', {
        projectId: project.id,
        userId,
      });

      return project;
    } catch (error) {
      this.logger.error('Error in CreateProject use case', {
        userId,
        error: error.message,
      });
      throw error;
    }
  }
}

module.exports = CreateProject;
