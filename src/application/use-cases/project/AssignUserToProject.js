const NotFoundError = require('../../../domain/errors/NotFoundError');
const AuthorizationError = require('../../../domain/errors/AuthorizationError');
const ValidationError = require('../../../domain/errors/ValidationError');

/**
 * Use Case: Assign User To Project
 * Adds a user as a member of the project (owner or admin only)
 */
class AssignUserToProject {
  constructor({ projectRepository, userRepository, cacheService, logger }) {
    this.projectRepository = projectRepository;
    this.userRepository = userRepository;
    this.cacheService = cacheService;
    this.logger = logger;
  }

  async execute(projectId, userIdToAdd, requestingUserId, requestingUserRole) {
    try {
      this.logger.debug('AssignUserToProject use case executing', {
        projectId,
        userIdToAdd,
        requestingUserId,
      });

      // Get the project
      const project = await this.projectRepository.findById(projectId);
      if (!project) {
        throw new NotFoundError('Project not found');
      }

      // Check authorization (only owner or admin)
      if (project.ownerId !== requestingUserId && requestingUserRole !== 'admin') {
        throw new AuthorizationError('Only project owner or admin can add members');
      }

      // Check if user exists
      const userToAdd = await this.userRepository.findById(userIdToAdd);
      if (!userToAdd) {
        throw new NotFoundError('User to add not found');
      }

      if (!userToAdd.isActive) {
        throw new ValidationError('Cannot add inactive user to project');
      }

      // Check if already a member
      if (project.members.includes(userIdToAdd)) {
        throw new ValidationError('User is already a member of this project');
      }

      // Add member
      const updatedProject = await this.projectRepository.addMember(projectId, userIdToAdd);

      // Invalidate caches
      await Promise.all([
        this.cacheService.del(`project:${projectId}`),
        this.cacheService.delPattern(`project:user:${userIdToAdd}:*`),
        this.cacheService.delPattern(`project:user:${requestingUserId}:*`),
      ]);

      this.logger.info('User added to project successfully', {
        projectId,
        userIdToAdd,
        requestingUserId,
      });

      return updatedProject;
    } catch (error) {
      this.logger.error('Error in AssignUserToProject use case', {
        projectId,
        userIdToAdd,
        error: error.message,
      });
      throw error;
    }
  }
}

module.exports = AssignUserToProject;
