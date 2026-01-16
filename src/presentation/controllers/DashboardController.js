/**
 * Dashboard Controller
 * Handles dashboard and analytics requests
 */
class DashboardController {
  constructor({ getDashboardStats, getTaskDistribution, getPriorityDistribution, getWeeklyTrend, logger }) {
    this.getDashboardStatsUseCase = getDashboardStats;
    this.getTaskDistributionUseCase = getTaskDistribution;
    this.getPriorityDistributionUseCase = getPriorityDistribution;
    this.getWeeklyTrendUseCase = getWeeklyTrend;
    this.logger = logger;
  }

  /**
   * Get comprehensive dashboard statistics
   * @route GET /api/v1/dashboard/stats
   * @access Private
   */
  async getDashboardStats(req, res, next) {
    try {
      const { id: userId, role: userRole } = req.user;

      this.logger.info('Getting dashboard stats', { userId });

      const stats = await this.getDashboardStatsUseCase.execute(userId, userRole);

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get task distribution by status
   * @route GET /api/v1/dashboard/task-distribution
   * @access Private
   */
  async getTaskDistribution(req, res, next) {
    try {
      const { id: userId, role: userRole } = req.user;

      this.logger.info('Getting task distribution', { userId });

      const distribution = await this.getTaskDistributionUseCase.execute(userId, userRole);

      res.status(200).json({
        success: true,
        data: distribution,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get task distribution by priority
   * @route GET /api/v1/dashboard/priority-distribution
   * @access Private
   */
  async getPriorityDistribution(req, res, next) {
    try {
      const { id: userId, role: userRole } = req.user;

      this.logger.info('Getting priority distribution', { userId });

      const distribution = await this.getPriorityDistributionUseCase.execute(userId, userRole);

      res.status(200).json({
        success: true,
        data: distribution,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get weekly task trend
   * @route GET /api/v1/dashboard/weekly-trend
   * @access Private
   */
  async getWeeklyTrend(req, res, next) {
    try {
      const { id: userId, role: userRole } = req.user;

      this.logger.info('Getting weekly trend', { userId });

      const trend = await this.getWeeklyTrendUseCase.execute(userId, userRole);

      res.status(200).json({
        success: true,
        data: trend,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = DashboardController;
