const DashboardController = require('../../../../src/presentation/controllers/DashboardController');

describe('DashboardController', () => {
  let dashboardController;
  let mockGetDashboardStats;
  let mockGetTaskDistribution;
  let mockGetPriorityDistribution;
  let mockGetWeeklyTrend;
  let mockLogger;
  let req, res, next;

  beforeEach(() => {
    mockGetDashboardStats = {
      execute: jest.fn(),
    };

    mockGetTaskDistribution = {
      execute: jest.fn(),
    };

    mockGetPriorityDistribution = {
      execute: jest.fn(),
    };

    mockGetWeeklyTrend = {
      execute: jest.fn(),
    };

    mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
    };

    dashboardController = new DashboardController({
      getDashboardStats: mockGetDashboardStats,
      getTaskDistribution: mockGetTaskDistribution,
      getPriorityDistribution: mockGetPriorityDistribution,
      getWeeklyTrend: mockGetWeeklyTrend,
      logger: mockLogger,
    });

    req = {
      user: {
        id: 'user123',
        role: 'user',
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
  });

  describe('getDashboardStats', () => {
    it('should return dashboard stats successfully', async () => {
      const mockStats = {
        totalProjects: 10,
        totalTasks: 50,
        completedTasks: 20,
      };

      mockGetDashboardStats.execute.mockResolvedValue(mockStats);

      await dashboardController.getDashboardStats(req, res, next);

      expect(mockGetDashboardStats.execute).toHaveBeenCalledWith('user123', 'user');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockStats,
      });
    });

    it('should call next with error on failure', async () => {
      const error = new Error('Database error');
      mockGetDashboardStats.execute.mockRejectedValue(error);

      await dashboardController.getDashboardStats(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getTaskDistribution', () => {
    it('should return task distribution successfully', async () => {
      const mockDistribution = {
        notStarted: 10,
        inProgress: 5,
        completed: 20,
      };

      mockGetTaskDistribution.execute.mockResolvedValue(mockDistribution);

      await dashboardController.getTaskDistribution(req, res, next);

      expect(mockGetTaskDistribution.execute).toHaveBeenCalledWith('user123', 'user');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockDistribution,
      });
    });

    it('should call next with error on failure', async () => {
      const error = new Error('Database error');
      mockGetTaskDistribution.execute.mockRejectedValue(error);

      await dashboardController.getTaskDistribution(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getPriorityDistribution', () => {
    it('should return priority distribution successfully', async () => {
      const mockDistribution = {
        none: 5,
        low: 10,
        medium: 15,
        high: 20,
      };

      mockGetPriorityDistribution.execute.mockResolvedValue(mockDistribution);

      await dashboardController.getPriorityDistribution(req, res, next);

      expect(mockGetPriorityDistribution.execute).toHaveBeenCalledWith('user123', 'user');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockDistribution,
      });
    });

    it('should call next with error on failure', async () => {
      const error = new Error('Database error');
      mockGetPriorityDistribution.execute.mockRejectedValue(error);

      await dashboardController.getPriorityDistribution(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getWeeklyTrend', () => {
    it('should return weekly trend successfully', async () => {
      const mockTrend = {
        week: [
          { day: 'Monday', tasks: 5 },
          { day: 'Tuesday', tasks: 8 },
        ],
      };

      mockGetWeeklyTrend.execute.mockResolvedValue(mockTrend);

      await dashboardController.getWeeklyTrend(req, res, next);

      expect(mockGetWeeklyTrend.execute).toHaveBeenCalledWith('user123', 'user');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockTrend,
      });
    });

    it('should call next with error on failure', async () => {
      const error = new Error('Database error');
      mockGetWeeklyTrend.execute.mockRejectedValue(error);

      await dashboardController.getWeeklyTrend(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
