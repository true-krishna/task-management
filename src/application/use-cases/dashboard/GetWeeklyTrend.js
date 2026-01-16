/**
 * Use Case: Get Weekly Trend
 * Retrieves task completion trend for the last 7 days
 */
class GetWeeklyTrend {
  constructor({ taskRepository, projectRepository, cacheService, logger }) {
    this.taskRepository = taskRepository;
    this.projectRepository = projectRepository;
    this.cacheService = cacheService;
    this.logger = logger;
  }

  async execute(userId, userRole) {
    try {
      this.logger.debug('GetWeeklyTrend use case executing', { userId });

      // Check cache first
      const cacheKey = `dashboard:trend:${userId}`;
      const cachedTrend = await this.cacheService.get(cacheKey);
      
      if (cachedTrend) {
        this.logger.debug('Weekly trend found in cache', { userId });
        return JSON.parse(cachedTrend);
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
        const emptyTrend = this._generateEmptyTrend();
        await this.cacheService.set(cacheKey, JSON.stringify(emptyTrend), 300);
        return emptyTrend;
      }

      // Get tasks created and completed in the last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const tasksCreated = await this.taskRepository.findAll({
        projectId: { $in: projectIds },
        createdAt: { $gte: sevenDaysAgo }
      });

      const tasksCompleted = await this.taskRepository.findAll({
        projectId: { $in: projectIds },
        status: 'completed',
        updatedAt: { $gte: sevenDaysAgo }
      });

      // Generate trend data for each day
      const trend = this._generateTrendData(tasksCreated, tasksCompleted);

      // Cache the trend (5 minutes TTL)
      await this.cacheService.set(cacheKey, JSON.stringify(trend), 300);

      this.logger.info('Weekly trend calculated successfully', {
        userId,
        days: trend.daily.length,
      });

      return trend;
    } catch (error) {
      this.logger.error('Error in GetWeeklyTrend use case', {
        error: error.message,
        userId,
      });
      throw error;
    }
  }

  _generateEmptyTrend() {
    const daily = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      daily.push({
        date: date.toISOString().split('T')[0],
        created: 0,
        completed: 0
      });
    }

    return {
      daily,
      summary: {
        totalCreated: 0,
        totalCompleted: 0,
        averageCreatedPerDay: 0,
        averageCompletedPerDay: 0
      }
    };
  }

  _generateTrendData(tasksCreated, tasksCompleted) {
    const daily = [];
    const today = new Date();
    
    let totalCreated = 0;
    let totalCompleted = 0;

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const created = tasksCreated.filter(task => {
        const taskDate = new Date(task.createdAt);
        return taskDate >= date && taskDate < nextDate;
      }).length;

      const completed = tasksCompleted.filter(task => {
        const taskDate = new Date(task.updatedAt);
        return taskDate >= date && taskDate < nextDate;
      }).length;

      totalCreated += created;
      totalCompleted += completed;

      daily.push({
        date: date.toISOString().split('T')[0],
        created,
        completed
      });
    }

    return {
      daily,
      summary: {
        totalCreated,
        totalCompleted,
        averageCreatedPerDay: Math.round(totalCreated / 7),
        averageCompletedPerDay: Math.round(totalCompleted / 7)
      }
    };
  }
}

module.exports = GetWeeklyTrend;
