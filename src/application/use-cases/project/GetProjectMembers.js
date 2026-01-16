const NotFoundError = require('../../../domain/errors/NotFoundError');
const AuthorizationError = require('../../../domain/errors/AuthorizationError');

/**
 * Use Case: Get Project Members
 * Retrieves all members of a project (with access control)
 */
class GetProjectMembers {
  constructor({ projectRepository, userRepository, logger }) {
    this.projectRepository = projectRepository;
    this.userRepository = userRepository;
    this.logger = logger;
  }

  async execute(projectId, userId, userRole) {
    try {
      this.logger.debug('GetProjectMembers use case executing', { projectId, userId });

      // Get the project
      const project = await this.projectRepository.findById(projectId);
      if (!project) {
        throw new NotFoundError('Project not found');
      }

      // Check access (same rules as GetProject)
      const hasAccess = this._checkAccess(project, userId, userRole);
      if (!hasAccess) {
        throw new AuthorizationError('You do not have access to this project');
      }

      // Get member details
      const memberPromises = project.members.map(memberId =>
        this.userRepository.findById(memberId)
      );
      const members = await Promise.all(memberPromises);

      // Filter out null values and map to safe data
      const memberData = members
        .filter(member => member !== null)
        .map(member => ({
          id: member.id,
          email: member.email,
          firstName: member.firstName,
          lastName: member.lastName,
          avatar: member.avatar,
          role: member.role,
        }));

      this.logger.info('Project members retrieved successfully', {
        projectId,
        userId,
        memberCount: memberData.length,
      });

      return {
        projectId: project.id,
        projectName: project.name,
        members: memberData,
      };
    } catch (error) {
      this.logger.error('Error in GetProjectMembers use case', {
        projectId,
        userId,
        error: error.message,
      });
      throw error;
    }
  }

  _checkAccess(project, userId, userRole) {
    if (userRole === 'admin') return true;
    if (project.ownerId === userId) return true;
    if (project.visibility === 'public') return true;
    if (project.visibility === 'team' && project.members.includes(userId)) return true;
    return false;
  }
}

module.exports = GetProjectMembers;
