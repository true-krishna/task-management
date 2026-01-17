const NotFoundError = require('../../../domain/errors/NotFoundError');
const AuthorizationError = require('../../../domain/errors/AuthorizationError');
const ValidationError = require('../../../domain/errors/ValidationError');

/**
 * Use Case: Update Project
 * Updates project details (owner or admin only)
 */
class UpdateProject {
  constructor({ projectRepository, cacheService, logger }) {
    this.projectRepository = projectRepository;
    this.cacheService = cacheService;
    this.logger = logger;
  }

  async execute(projectId, userId, userRole, updateData) {
    try {
      this.logger.debug('UpdateProject use case executing', {
        projectId,
        userId,
        fields: Object.keys(updateData),
      });

      // Get the project
      const project = await this.projectRepository.findById(projectId);
      if (!project) {
        throw new NotFoundError('Project not found');
      }

      // Check authorization (only owner or admin)
      if (project.ownerId !== userId && userRole !== 'admin') {
        throw new AuthorizationError('Only project owner or admin can update the project');
      }

      // Filter allowed fields
      const allowedFields = ['name', 'description', 'status'];
      const filteredData = {};
      for (const field of allowedFields) {
        if (updateData[field] !== undefined) {
          filteredData[field] = updateData[field];
        }
      }

      if (Object.keys(filteredData).length === 0) {
        throw new ValidationError('No valid fields provided for update');
      }

      // Add modifiedBy
      filteredData.modifiedBy = userId;

      // Update project
      const updatedProject = await this.projectRepository.update(projectId, filteredData);

      // Invalidate caches
      await Promise.all([
        this.cacheService.del(`project:${projectId}`),
        this.cacheService.del(`project:user:${project.ownerId}`),
        this.cacheService.delPattern(`project:user:*`), // Invalidate all user project lists
      ]);

      this.logger.info('Project updated successfully', {
        projectId,
        userId,
        updatedFields: Object.keys(filteredData),
      });

      return updatedProject;
    } catch (error) {
      this.logger.error('Error in UpdateProject use case', {
        projectId,
        userId,
        error: error.message,
      });
      throw error;
    }
  }
}

module.exports = UpdateProject;
