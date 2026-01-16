const NotFoundError = require('../../../domain/errors/NotFoundError');

/**
 * Use Case: Get Dashboard Statistics
 * Retrieves comprehensive statistics for user's accessible projects
 */
class GetDashboardStats {
  constructor({ taskRepository, projectRepository, cacheService, logger }) {
    this.taskRepository = taskRepository;
    this.projectRepository = projectRepository;
    this.cacheService = cacheService;
    this.logger = logger;
  }

  async execute(userId, userRole) {
    try {
      this.logger.debug('GetDashboardStats use case executing', { userId });

      // Check cache first
      const cacheKey = `dashboard:stats:${userId}`;
      const cachedStats = await this.cacheService.get(cacheKey);
      
      if (cachedStats) {
        this.logger.debug('Dashboard stats found in cache', { userId });
        return JSON.parse(cachedStats);
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
        const emptyStats = {
          totalProjects: 0,
          totalTasks: 0,
          tasksByStatus: {
            not_started: 0,
            in_progress: 0,
            completed: 0
          },
          tasksByPriority: {
            none: 0,
            low: 0,
            medium: 0,
            high: 0
          },
          completionRate: 0,
          myTasks: 0,
          overdueTasks: 0,
        };
        
        await this.cacheService.set(cacheKey, JSON.stringify(emptyStats), 300);
        return emptyStats;
      }

      // Get all tasks for these projects
      const allTasks = await this.taskRepository.findAll({
        projectId: { $in: projectIds }
      });

      // Get tasks assigned to current user
      const myTasks = allTasks.filter(task => task.assigneeId === userId);

      // Calculate overdue tasks
      const now = new Date();
      const overdueTasks = allTasks.filter(
        task => task.dueDate && new Date(task.dueDate) < now && task.status !== 'completed'
      );

      // Group tasks by status
      const tasksByStatus = {
        not_started: 0,
        in_progress: 0,
        completed: 0
      };

      allTasks.forEach(task => {
        if (tasksByStatus[task.status] !== undefined) {
          tasksByStatus[task.status]++;
        }
      });

      // Group tasks by priority
      const tasksByPriority = {
        none: 0,
        low: 0,
        medium: 0,
        high: 0
      };

      allTasks.forEach(task => {
        if (tasksByPriority[task.priority] !== undefined) {
          tasksByPriority[task.priority]++;
        }
      });

      // Calculate completion rate
      const totalTasks = allTasks.length;
      const completedTasks = tasksByStatus.completed;
      const completionRate = totalTasks > 0 
        ? Math.round((completedTasks / totalTasks) * 100) 
        : 0;

      // Group projects by status
      const projectsByStatus = {
        planning: 0,
        active: 0,
        completed: 0,
        archived: 0
      };

      projects.forEach(project => {
        if (projectsByStatus[project.status] !== undefined) {
          projectsByStatus[project.status]++;
        }
      });

      const stats = {
        totalProjects: projects.length,
        totalTasks: totalTasks,
        tasksByStatus,
        tasksByPriority,
        projectsByStatus,
        completionRate,
        myTasks: myTasks.length,
        overdueTasks: overdueTasks.length,
        recentActivity: {
          tasksCreatedThisWeek: this._getTasksCreatedThisWeek(allTasks),
          tasksCompletedThisWeek: this._getTasksCompletedThisWeek(allTasks),
        }
      };

      // Cache the stats (5 minutes TTL)
      await this.cacheService.set(cacheKey, JSON.stringify(stats), 300);

      this.logger.info('Dashboard stats calculated successfully', {
        userId,
        totalProjects: stats.totalProjects,
        totalTasks: stats.totalTasks,
      });

      return stats;
    } catch (error) {
      this.logger.error('Error in GetDashboardStats use case', {
        error: error.message,
        userId,
      });
      throw error;
    }
  }

  _getTasksCreatedThisWeek(tasks) {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return tasks.filter(task => new Date(task.createdAt) >= oneWeekAgo).length;
  }

  _getTasksCompletedThisWeek(tasks) {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return tasks.filter(
      task => task.status === 'completed' && new Date(task.updatedAt) >= oneWeekAgo
    ).length;
  }
}

module.exports = GetDashboardStats;
