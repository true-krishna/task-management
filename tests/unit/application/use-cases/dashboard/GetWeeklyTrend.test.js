const GetWeeklyTrend = require('../../../../../src/application/use-cases/dashboard/GetWeeklyTrend');

describe('GetWeeklyTrend Use Case', () => {
  let getWeeklyTrend;
  let mockTaskRepository;
  let mockProjectRepository;
  let mockCacheService;
  let mockLogger;

  beforeEach(() => {
    mockTaskRepository = {
      findAll: jest.fn(),
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

    getWeeklyTrend = new GetWeeklyTrend({
      taskRepository: mockTaskRepository,
      projectRepository: mockProjectRepository,
      cacheService: mockCacheService,
      logger: mockLogger,
    });
  });

  it('should return cached trend if available', async () => {
    const mockTrend = {
      daily: [{ date: '2024-01-01', created: 5, completed: 3 }],
    };

    mockCacheService.get.mockResolvedValue(JSON.stringify(mockTrend));

    const result = await getWeeklyTrend.execute('user123', 'user');

    expect(result).toEqual(mockTrend);
    expect(mockProjectRepository.findAll).not.toHaveBeenCalled();
  });

  it('should generate trend for user with projects', async () => {
    mockCacheService.get.mockResolvedValue(null);

    const mockProjects = [
      { id: 'project1', ownerId: 'user123' },
      { id: 'project2', ownerId: 'user123' },
    ];

    mockProjectRepository.findAll.mockResolvedValue(mockProjects);
    mockTaskRepository.findAll.mockResolvedValue([]);

    const result = await getWeeklyTrend.execute('user123', 'user');

    expect(result.daily).toHaveLength(7);
    expect(mockCacheService.set).toHaveBeenCalled();
  });

  it('should return empty trend for user with no projects', async () => {
    mockCacheService.get.mockResolvedValue(null);
    mockProjectRepository.findAll.mockResolvedValue([]);

    const result = await getWeeklyTrend.execute('user123', 'user');

    expect(result.daily).toHaveLength(7);
    expect(result.daily[0].created).toBe(0);
    expect(result.daily[0].completed).toBe(0);
  });

  it('should handle admin users', async () => {
    mockCacheService.get.mockResolvedValue(null);

    const mockProjects = [{ id: 'project1' }];
    mockProjectRepository.findAll.mockResolvedValue(mockProjects);
    mockTaskRepository.findAll.mockResolvedValue([]);

    await getWeeklyTrend.execute('admin123', 'admin');

    expect(mockProjectRepository.findAll).toHaveBeenCalledWith({});
  });

  it('should calculate trend from tasks', async () => {
    mockCacheService.get.mockResolvedValue(null);

    const mockProjects = [{ id: 'project1' }];
    mockProjectRepository.findAll.mockResolvedValue(mockProjects);

    const today = new Date();
    const mockTasksCreated = [
      { id: 'task1', createdAt: today },
      { id: 'task2', createdAt: today },
    ];

    const mockTasksCompleted = [
      { id: 'task3', status: 'completed', updatedAt: today },
    ];

    mockTaskRepository.findAll
      .mockResolvedValueOnce(mockTasksCreated)
      .mockResolvedValueOnce(mockTasksCompleted);

    const result = await getWeeklyTrend.execute('user123', 'user');

    expect(result.daily).toBeDefined();
    expect(result.daily).toHaveLength(7);
  });

  it('should handle errors', async () => {
    const error = new Error('Database error');
    mockCacheService.get.mockRejectedValue(error);

    await expect(
      getWeeklyTrend.execute('user123', 'user')
    ).rejects.toThrow('Database error');
  });
});
