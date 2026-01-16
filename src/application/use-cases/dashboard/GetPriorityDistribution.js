/**
 * Use Case: Get Priority Distribution
 * Retrieves task distribution by priority for chart visualization
 */
class GetPriorityDistribution {
  constructor({ taskRepository, projectRepository, cacheService, logger }) {
    this.taskRepository = taskRepository;
    this.projectRepository = projectRepository;
    this.cacheService = cacheService;
    this.logger = logger;
  }

  async execute(userId, userRole) {
    try {
      this.logger.debug('GetPriorityDistribution use case executing', { userId });

      // Check cache first
      const cacheKey = `dashboard:priority:${userId}`;
      const cachedDistribution = await this.cacheService.get(cacheKey);
      
      if (cachedDistribution) {
        this.logger.debug('Priority distribution found in cache', { userId });
        return JSON.parse(cachedDistribution);
      }

      // Get user's accessible projects
      let projects;
      if (userRole === 'admin') {
        projects = await this.projectRepository.findAll({});
      } else {
        projects = await this.projectRepository.findAll({
          $or: [
            { ownerId: userId },
            { members: userId },
            { visibility: 'public' }
          ]
        });
      }

      const projectIds = projects.map(p => p.id);

      if (projectIds.length === 0) {
        const emptyDistribution = {
          byPriority: [
            { priority: 'none', count: 0, percentage: 0 },
            { priority: 'low', count: 0, percentage: 0 },
            { priority: 'medium', count: 0, percentage: 0 },
            { priority: 'high', count: 0, percentage: 0 }
          ],
          total: 0
        };
        
        await this.cacheService.set(cacheKey, JSON.stringify(emptyDistribution), 300);
        return emptyDistribution;
      }

      // Get all tasks for accessible projects
      const tasks = await this.taskRepository.findAll({
        projectId: { $in: projectIds }
      });

      // Calculate priority distribution
      const priorityCounts = {
        none: 0,
        low: 0,
        medium: 0,
        high: 0
      };

      let totalTasks = tasks.length;

      tasks.forEach(task => {
        const priority = task.priority || 'none';
        if (priorityCounts[priority] !== undefined) {
          priorityCounts[priority]++;
        }
      });

      const byPriority = Object.entries(priorityCounts).map(([priority, count]) => ({
        priority,
        count,
        percentage: totalTasks > 0 ? Math.round((count / totalTasks) * 100) : 0
      }));

      const distribution = {
        byPriority,
        total: totalTasks
      };

      // Cache the distribution (5 minutes TTL)
      await this.cacheService.set(cacheKey, JSON.stringify(distribution), 300);

      this.logger.info('Priority distribution calculated successfully', {
        userId,
        total: totalTasks,
      });

      return distribution;
    } catch (error) {
      this.logger.error('Error in GetPriorityDistribution use case', {
        error: error.message,
        userId,
      });
      throw error;
    }
  }
}

module.exports = GetPriorityDistribution;
