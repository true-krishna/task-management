/**
 * Use Case: Get All Projects
 * Retrieves projects based on user's access level
 */
class GetAllProjects {
  constructor({ projectRepository, cacheService, logger }) {
    this.projectRepository = projectRepository;
    this.cacheService = cacheService;
    this.logger = logger;
  }

  async execute(userId, userRole, options = {}) {
    try {
      const { page = 1, limit = 50, status, visibility } = options;

      this.logger.debug('GetAllProjects use case executing', {
        userId,
        userRole,
        page,
        limit,
      });

      // Check cache
      const cacheKey = `project:user:${userId}:${page}:${limit}:${status || 'all'}:${visibility || 'all'}`;
      const cachedData = await this.cacheService.get(cacheKey);

      if (cachedData) {
        this.logger.debug('Projects found in cache', { userId });
        return JSON.parse(cachedData);
      }

      let projects;

      if (userRole === 'admin') {
        // Admin can see all projects
        const filter = {};
        if (status) filter.status = status;
        if (visibility) filter.visibility = visibility;

        projects = await this.projectRepository.findAll(filter, { page, limit });
      } else {
        // Regular users see:
        // 1. Projects they own
        // 2. Projects they're members of
        // 3. Public projects
        projects = await this._getUserAccessibleProjects(userId, { page, limit, status, visibility });
      }

      const response = {
        projects,
        pagination: {
          page,
          limit,
          total: projects.length,
        },
      };

      // Cache the result (5 minutes)
      await this.cacheService.set(cacheKey, JSON.stringify(response), 300);

      this.logger.info('Projects retrieved successfully', {
        userId,
        count: projects.length,
      });

      return response;
    } catch (error) {
      this.logger.error('Error in GetAllProjects use case', {
        userId,
        error: error.message,
      });
      throw error;
    }
  }

  async _getUserAccessibleProjects(userId, options) {
    const { page, limit, status, visibility } = options;

    // Get owned projects
    const ownedFilter = { ownerId: userId };
    if (status) ownedFilter.status = status;
    if (visibility) ownedFilter.visibility = visibility;
    const ownedProjects = await this.projectRepository.findByOwnerId(userId, { page, limit });

    // Get projects where user is a member
    const memberFilter = { members: userId, ownerId: { $ne: userId } };
    if (status) memberFilter.status = status;
    if (visibility) memberFilter.visibility = visibility;
    const memberProjects = await this.projectRepository.findByMemberId(userId, { page, limit });

    // Get public projects (excluding owned and member projects)
    const publicFilter = { 
      visibility: 'public',
      ownerId: { $ne: userId },
      members: { $ne: userId }
    };
    if (status) publicFilter.status = status;
    const publicProjects = await this.projectRepository.findPublicProjects({ page, limit });

    // Combine and deduplicate
    const projectMap = new Map();
    
    [...ownedProjects, ...memberProjects, ...publicProjects].forEach(project => {
      if (!projectMap.has(project.id)) {
        projectMap.set(project.id, project);
      }
    });

    return Array.from(projectMap.values());
  }
}

module.exports = GetAllProjects;
