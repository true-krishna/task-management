const NotFoundError = require('../../../domain/errors/NotFoundError');
const AuthorizationError = require('../../../domain/errors/AuthorizationError');
const ValidationError = require('../../../domain/errors/ValidationError');

/**
 * Use Case: Remove User From Project
 * Removes a user from project members (owner or admin only)
 */
class RemoveUserFromProject {
  constructor({ projectRepository, cacheService, logger }) {
    this.projectRepository = projectRepository;
    this.cacheService = cacheService;
    this.logger = logger;
  }

  async execute(projectId, userIdToRemove, requestingUserId, requestingUserRole) {
    try {
      this.logger.debug('RemoveUserFromProject use case executing', {
        projectId,
        userIdToRemove,
        requestingUserId,
      });

      // Get the project
      const project = await this.projectRepository.findById(projectId);
      if (!project) {
        throw new NotFoundError('Project not found');
      }

      // Check authorization (only owner or admin)
      if (project.ownerId !== requestingUserId && requestingUserRole !== 'admin') {
        throw new AuthorizationError('Only project owner or admin can remove members');
      }

      // Cannot remove owner
      if (userIdToRemove === project.ownerId) {
        throw new ValidationError('Cannot remove project owner from members');
      }

      // Check if user is a member
      if (!project.members.includes(userIdToRemove)) {
        throw new ValidationError('User is not a member of this project');
      }

      // Remove member
      const updatedProject = await this.projectRepository.removeMember(projectId, userIdToRemove);

      // Invalidate caches
      await Promise.all([
        this.cacheService.del(`project:${projectId}`),
        this.cacheService.delPattern(`project:user:${userIdToRemove}:*`),
        this.cacheService.delPattern(`project:user:${requestingUserId}:*`),
      ]);

      this.logger.info('User removed from project successfully', {
        projectId,
        userIdToRemove,
        requestingUserId,
      });

      return updatedProject;
    } catch (error) {
      this.logger.error('Error in RemoveUserFromProject use case', {
        projectId,
        userIdToRemove,
        error: error.message,
      });
      throw error;
    }
  }
}

module.exports = RemoveUserFromProject;
