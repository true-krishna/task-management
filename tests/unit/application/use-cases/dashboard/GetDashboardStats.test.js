const GetDashboardStats = require('../../../../../src/application/use-cases/dashboard/GetDashboardStats');

describe('GetDashboardStats Use Case', () => {
  let getDashboardStats;
  let mockTaskRepository;
  let mockProjectRepository;
  let mockCacheService;
  let mockLogger;

  beforeEach(() => {
    mockTaskRepository = {
      findAll: jest.fn(),
      countByFilter: jest.fn(),
    };

    mockProjectRepository = {
      findAll: jest.fn(),
    };

    mockCacheService = {
      get: jest.fn(),
      set: jest.fn(),
    };

    mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
    };

    getDashboardStats = new GetDashboardStats({
      taskRepository: mockTaskRepository,
      projectRepository: mockProjectRepository,
      cacheService: mockCacheService,
      logger: mockLogger,
    });
  });

  it('should return dashboard stats for user', async () => {
    const userId = 'user123';
    const userRole = 'user';

    const mockProjects = [
      { id: 'project1', ownerId: userId },
      { id: 'project2', members: [userId] },
    ];

    const mockTasks = [
      { id: 'task1', projectId: 'project1', status: 'not_started', priority: 'high', assigneeId: userId },
      { id: 'task2', projectId: 'project1', status: 'in_progress', priority: 'medium', assigneeId: 'other' },
      { id: 'task3', projectId: 'project2', status: 'completed', priority: 'low', assigneeId: userId },
    ];

    mockCacheService.get.mockResolvedValue(null);
    mockProjectRepository.findAll.mockResolvedValue(mockProjects);
    mockTaskRepository.findAll.mockResolvedValue(mockTasks);

    const result = await getDashboardStats.execute(userId, userRole);

    expect(result).toBeDefined();
    expect(result.totalProjects).toBe(2);
    expect(result.totalTasks).toBe(3);
    expect(result.tasksByStatus).toBeDefined();
    expect(mockCacheService.set).toHaveBeenCalled();
  });

  it('should return cached stats if available', async () => {
    const userId = 'user123';
    const cachedStats = JSON.stringify({
      totalProjects: 5,
      totalTasks: 10,
    });

    mockCacheService.get.mockResolvedValue(cachedStats);

    const result = await getDashboardStats.execute(userId, 'user');

    expect(result.totalProjects).toBe(5);
    expect(result.totalTasks).toBe(10);
    expect(mockProjectRepository.findAll).not.toHaveBeenCalled();
  });

  it('should return empty stats for user with no projects', async () => {
    mockCacheService.get.mockResolvedValue(null);
    mockProjectRepository.findAll.mockResolvedValue([]);

    const result = await getDashboardStats.execute('user123', 'user');

    expect(result.totalProjects).toBe(0);
    expect(result.totalTasks).toBe(0);
  });

  it('should get all projects for admin users', async () => {
    const userId = 'admin123';
    const userRole = 'admin';

    mockCacheService.get.mockResolvedValue(null);
    mockProjectRepository.findAll.mockResolvedValue([]);

    await getDashboardStats.execute(userId, userRole);

    expect(mockProjectRepository.findAll).toHaveBeenCalledWith({});
  });
});
