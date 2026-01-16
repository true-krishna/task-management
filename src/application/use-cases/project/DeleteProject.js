const NotFoundError = require('../../../domain/errors/NotFoundError');
const AuthorizationError = require('../../../domain/errors/AuthorizationError');

/**
 * Use Case: Delete Project
 * Deletes a project (owner or admin only)
 */
class DeleteProject {
  constructor({ projectRepository, cacheService, logger }) {
    this.projectRepository = projectRepository;
    this.cacheService = cacheService;
    this.logger = logger;
  }

  async execute(projectId, userId, userRole) {
    try {
      this.logger.debug('DeleteProject use case executing', { projectId, userId });

      // Get the project
      const project = await this.projectRepository.findById(projectId);
      if (!project) {
        throw new NotFoundError('Project not found');
      }

      // Check authorization (only owner or admin)
      if (project.ownerId !== userId && userRole !== 'admin') {
        throw new AuthorizationError('Only project owner or admin can delete the project');
      }

      // Delete the project
      await this.projectRepository.delete(projectId);

      // Invalidate caches
      await Promise.all([
        this.cacheService.del(`project:${projectId}`),
        this.cacheService.delPattern(`project:user:*`),
      ]);

      this.logger.info('Project deleted successfully', {
        projectId,
        userId,
      });

      return {
        success: true,
        message: 'Project deleted successfully',
      };
    } catch (error) {
      this.logger.error('Error in DeleteProject use case', {
        projectId,
        userId,
        error: error.message,
      });
      throw error;
    }
  }
}

module.exports = DeleteProject;
