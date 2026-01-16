/**
 * Use Case: Get Task Distribution
 * Retrieves task distribution by status for chart visualization
 */
class GetTaskDistribution {
  constructor({ taskRepository, projectRepository, cacheService, logger }) {
    this.taskRepository = taskRepository;
    this.projectRepository = projectRepository;
    this.cacheService = cacheService;
    this.logger = logger;
  }

  async execute(userId, userRole) {
    try {
      this.logger.debug('GetTaskDistribution use case executing', { userId });

      // Check cache first
      const cacheKey = `dashboard:distribution:${userId}`;
      const cachedDistribution = await this.cacheService.get(cacheKey);
      
      if (cachedDistribution) {
        this.logger.debug('Task distribution found in cache', { userId });
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
          byStatus: [
            { status: 'not_started', count: 0, percentage: 0 },
            { status: 'in_progress', count: 0, percentage: 0 },
            { status: 'completed', count: 0, percentage: 0 }
          ],
          total: 0
        };
        
        await this.cacheService.set(cacheKey, JSON.stringify(emptyDistribution), 300);
        return emptyDistribution;
      }

      // Get statistics from repository
      const stats = await this.taskRepository.getProjectStatistics(projectIds);

      // Calculate status distribution
      const statusCounts = {
        not_started: 0,
        in_progress: 0,
        completed: 0
      };

      let totalTasks = 0;

      stats.forEach(stat => {
        if (statusCounts[stat._id] !== undefined) {
          statusCounts[stat._id] = stat.count;
          totalTasks += stat.count;
        }
      });

      const byStatus = Object.entries(statusCounts).map(([status, count]) => ({
        status,
        count,
        percentage: totalTasks > 0 ? Math.round((count / totalTasks) * 100) : 0
      }));

      const distribution = {
        byStatus,
        total: totalTasks
      };

      // Cache the distribution (5 minutes TTL)
      await this.cacheService.set(cacheKey, JSON.stringify(distribution), 300);

      this.logger.info('Task distribution calculated successfully', {
        userId,
        total: totalTasks,
      });

      return distribution;
    } catch (error) {
      this.logger.error('Error in GetTaskDistribution use case', {
        error: error.message,
        userId,
      });
      throw error;
    }
  }
}

module.exports = GetTaskDistribution;
