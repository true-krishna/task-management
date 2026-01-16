const NotFoundError = require('../../../domain/errors/NotFoundError');
const AuthorizationError = require('../../../domain/errors/AuthorizationError');
const ValidationError = require('../../../domain/errors/ValidationError');
const ProjectVisibility = require('../../../domain/enums/ProjectVisibility');

/**
 * Use Case: Update Project Visibility
 * Changes project visibility (owner or admin only)
 */
class UpdateProjectVisibility {
  constructor({ projectRepository, cacheService, logger }) {
    this.projectRepository = projectRepository;
    this.cacheService = cacheService;
    this.logger = logger;
  }

  async execute(projectId, userId, userRole, newVisibility) {
    try {
      this.logger.debug('UpdateProjectVisibility use case executing', {
        projectId,
        userId,
        newVisibility,
      });

      // Validate visibility
      if (!Object.values(ProjectVisibility).includes(newVisibility)) {
        throw new ValidationError(
          `Invalid visibility. Must be one of: ${Object.values(ProjectVisibility).join(', ')}`
        );
      }

      // Get the project
      const project = await this.projectRepository.findById(projectId);
      if (!project) {
        throw new NotFoundError('Project not found');
      }

      // Check authorization (only owner or admin)
      if (project.ownerId !== userId && userRole !== 'admin') {
        throw new AuthorizationError('Only project owner or admin can change visibility');
      }

      // Check if already the same
      if (project.visibility === newVisibility) {
        throw new ValidationError(`Project visibility is already set to: ${newVisibility}`);
      }

      // Update visibility
      const updatedProject = await this.projectRepository.update(projectId, {
        visibility: newVisibility,
        modifiedBy: userId,
      });

      // Invalidate caches
      await Promise.all([
        this.cacheService.del(`project:${projectId}`),
        this.cacheService.delPattern(`project:user:*`),
      ]);

      this.logger.info('Project visibility updated successfully', {
        projectId,
        oldVisibility: project.visibility,
        newVisibility,
        userId,
      });

      return updatedProject;
    } catch (error) {
      this.logger.error('Error in UpdateProjectVisibility use case', {
        projectId,
        userId,
        error: error.message,
      });
      throw error;
    }
  }
}

module.exports = UpdateProjectVisibility;
