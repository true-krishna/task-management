const AuditLogController = require('../../../../src/presentation/controllers/AuditLogController');

describe('AuditLogController', () => {
  let auditLogController;
  let mockLogActivity;
  let mockGetEntityActivity;
  let mockGetUserActivity;
  let mockGetAllActivity;
  let mockGetActivityStatistics;
  let mockLogger;
  let req, res, next;

  beforeEach(() => {
    mockLogActivity = {
      execute: jest.fn(),
    };

    mockGetEntityActivity = {
      execute: jest.fn(),
    };

    mockGetUserActivity = {
      execute: jest.fn(),
    };

    mockGetAllActivity = {
      execute: jest.fn(),
    };

    mockGetActivityStatistics = {
      execute: jest.fn(),
    };

    mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
    };

    auditLogController = new AuditLogController({
      logActivity: mockLogActivity,
      getEntityActivity: mockGetEntityActivity,
      getUserActivity: mockGetUserActivity,
      getAllActivity: mockGetAllActivity,
      getActivityStatistics: mockGetActivityStatistics,
      logger: mockLogger,
    });

    req = {
      user: {
        id: 'user123',
        role: 'user',
      },
      params: {},
      query: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
  });

  describe('getEntityActivity', () => {
    it('should return entity activity successfully', async () => {
      req.params = { entityType: 'project', entityId: 'project123' };
      req.query = { limit: '25', skip: '0' };

      const mockResult = {
        logs: [{ id: 'log1', action: 'create' }],
        pagination: { total: 1, limit: 25, skip: 0, hasMore: false },
      };

      mockGetEntityActivity.execute.mockResolvedValue(mockResult);

      await auditLogController.getEntityActivity(req, res, next);

      expect(mockGetEntityActivity.execute).toHaveBeenCalledWith(
        'project',
        'project123',
        'user123',
        'user',
        { limit: 25, skip: 0 }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockResult.logs,
        pagination: mockResult.pagination,
      });
    });

    it('should use default pagination values', async () => {
      req.params = { entityType: 'task', entityId: 'task123' };

      mockGetEntityActivity.execute.mockResolvedValue({
        logs: [],
        pagination: {},
      });

      await auditLogController.getEntityActivity(req, res, next);

      expect(mockGetEntityActivity.execute).toHaveBeenCalledWith(
        'task',
        'task123',
        'user123',
        'user',
        { limit: 50, skip: 0 }
      );
    });

    it('should call next with error on failure', async () => {
      req.params = { entityType: 'project', entityId: 'project123' };
      const error = new Error('Not found');
      mockGetEntityActivity.execute.mockRejectedValue(error);

      await auditLogController.getEntityActivity(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getUserActivity', () => {
    it('should return user activity successfully', async () => {
      req.params = { userId: 'target123' };
      req.query = { limit: '20', skip: '10', entityType: 'project' };

      const mockResult = {
        logs: [{ id: 'log1' }],
        pagination: { total: 1 },
      };

      mockGetUserActivity.execute.mockResolvedValue(mockResult);

      await auditLogController.getUserActivity(req, res, next);

      expect(mockGetUserActivity.execute).toHaveBeenCalledWith(
        'target123',
        'user123',
        'user',
        { limit: 20, skip: 10, entityType: 'project' }
      );
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockResult.logs,
        pagination: mockResult.pagination,
      });
    });

    it('should call next with error on failure', async () => {
      req.params = { userId: 'target123' };
      const error = new Error('Unauthorized');
      mockGetUserActivity.execute.mockRejectedValue(error);

      await auditLogController.getUserActivity(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getAllActivity', () => {
    it('should return all activity for admin', async () => {
      req.user.role = 'admin';
      req.query = {
        limit: '50',
        skip: '0',
        entityType: 'project',
        action: 'create',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
      };

      const mockResult = {
        logs: [{ id: 'log1' }],
        pagination: { total: 1 },
      };

      mockGetAllActivity.execute.mockResolvedValue(mockResult);

      await auditLogController.getAllActivity(req, res, next);

      expect(mockGetAllActivity.execute).toHaveBeenCalledWith('admin', {
        limit: 50,
        skip: 0,
        entityType: 'project',
        action: 'create',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
      });
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockResult.logs,
        pagination: mockResult.pagination,
      });
    });

    it('should call next with error on failure', async () => {
      const error = new Error('Forbidden');
      mockGetAllActivity.execute.mockRejectedValue(error);

      await auditLogController.getAllActivity(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getActivityStatistics', () => {
    it('should return activity statistics for admin', async () => {
      req.user.role = 'admin';
      req.query = { startDate: '2024-01-01', endDate: '2024-12-31' };

      const mockStats = {
        totalLogs: 100,
        byAction: [{ action: 'create', count: 50, percentage: 50 }],
      };

      mockGetActivityStatistics.execute.mockResolvedValue(mockStats);

      await auditLogController.getActivityStatistics(req, res, next);

      expect(mockGetActivityStatistics.execute).toHaveBeenCalledWith('admin', {
        startDate: '2024-01-01',
        endDate: '2024-12-31',
      });
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockStats,
      });
    });

    it('should call next with error on failure', async () => {
      const error = new Error('Forbidden');
      mockGetActivityStatistics.execute.mockRejectedValue(error);

      await auditLogController.getActivityStatistics(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
