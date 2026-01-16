/**
 * Controller for project management endpoints
 */
class ProjectController {
  constructor({
    createProject,
    getProject,
    getAllProjects,
    updateProject,
    deleteProject,
    updateProjectVisibility,
    assignUserToProject,
    removeUserFromProject,
    getProjectMembers,
    logger,
  }) {
    this.createProject = createProject;
    this.getProject = getProject;
    this.getAllProjects = getAllProjects;
    this.updateProject = updateProject;
    this.deleteProject = deleteProject;
    this.updateProjectVisibility = updateProjectVisibility;
    this.assignUserToProject = assignUserToProject;
    this.removeUserFromProject = removeUserFromProject;
    this.getProjectMembers = getProjectMembers;
    this.logger = logger;
  }

  /**
   * Create a new project
   */
  async create(req, res, next) {
    try {
      const userId = req.user.userId;
      const { name, description, status, visibility } = req.body;

      const project = await this.createProject.execute({
        name,
        description,
        status,
        visibility,
        userId,
      });

      this.logger.info('Project created via API', { userId, projectId: project.id });

      res.status(201).json({
        success: true,
        message: 'Project created successfully',
        data: project,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get a single project by ID
   */
  async getById(req, res, next) {
    try {
      const userId = req.user.userId;
      const userRole = req.user.role;
      const { projectId } = req.params;

      const project = await this.getProject.execute(projectId, userId, userRole);

      res.status(200).json({
        success: true,
        data: project,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all projects (with filtering and pagination)
   */
  async getAll(req, res, next) {
    try {
      const userId = req.user.userId;
      const userRole = req.user.role;
      const { page, limit, status, visibility } = req.query;

      const result = await this.getAllProjects.execute(userId, userRole, {
        page: parseInt(page, 10) || 1,
        limit: parseInt(limit, 10) || 10,
        status,
        visibility,
      });

      res.status(200).json({
        success: true,
        data: result.projects,
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: result.totalPages,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update a project
   */
  async update(req, res, next) {
    try {
      const userId = req.user.userId;
      const userRole = req.user.role;
      const { projectId } = req.params;
      const updateData = req.body;

      const project = await this.updateProject.execute(
        projectId,
        userId,
        userRole,
        updateData
      );

      this.logger.info('Project updated via API', { userId, projectId });

      res.status(200).json({
        success: true,
        message: 'Project updated successfully',
        data: project,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a project
   */
  async delete(req, res, next) {
    try {
      const userId = req.user.userId;
      const userRole = req.user.role;
      const { projectId } = req.params;

      const result = await this.deleteProject.execute(projectId, userId, userRole);

      this.logger.info('Project deleted via API', { userId, projectId });

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update project visibility
   */
  async changeVisibility(req, res, next) {
    try {
      const userId = req.user.userId;
      const userRole = req.user.role;
      const { projectId } = req.params;
      const { visibility } = req.body;

      const project = await this.updateProjectVisibility.execute(
        projectId,
        userId,
        userRole,
        visibility
      );

      this.logger.info('Project visibility updated via API', { userId, projectId, visibility });

      res.status(200).json({
        success: true,
        message: 'Project visibility updated successfully',
        data: project,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Assign a user to a project
   */
  async addMember(req, res, next) {
    try {
      const requestingUserId = req.user.userId;
      const requestingUserRole = req.user.role;
      const { projectId } = req.params;
      const { userId } = req.body;

      const project = await this.assignUserToProject.execute(
        projectId,
        userId,
        requestingUserId,
        requestingUserRole
      );

      this.logger.info('User added to project via API', {
        requestingUserId,
        projectId,
        userId,
      });

      res.status(200).json({
        success: true,
        message: 'User added to project successfully',
        data: project,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Remove a user from a project
   */
  async removeMember(req, res, next) {
    try {
      const requestingUserId = req.user.userId;
      const requestingUserRole = req.user.role;
      const { projectId, userId } = req.params;

      const project = await this.removeUserFromProject.execute(
        projectId,
        userId,
        requestingUserId,
        requestingUserRole
      );

      this.logger.info('User removed from project via API', {
        requestingUserId,
        projectId,
        userId,
      });

      res.status(200).json({
        success: true,
        message: 'User removed from project successfully',
        data: project,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all members of a project
   */
  async getMembers(req, res, next) {
    try {
      const userId = req.user.userId;
      const userRole = req.user.role;
      const { projectId } = req.params;

      const result = await this.getProjectMembers.execute(projectId, userId, userRole);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ProjectController;
