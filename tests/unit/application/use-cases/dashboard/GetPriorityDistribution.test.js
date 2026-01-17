const GetPriorityDistribution = require('../../../../../src/application/use-cases/dashboard/GetPriorityDistribution');

describe('GetPriorityDistribution Use Case', () => {
  let getPriorityDistribution;
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

    getPriorityDistribution = new GetPriorityDistribution({
      taskRepository: mockTaskRepository,
      projectRepository: mockProjectRepository,
      cacheService: mockCacheService,
      logger: mockLogger,
    });
  });

  it('should get priority distribution successfully', async () => {
    const userId = 'user123';
    const mockProjects = [
      { id: 'project1', ownerId: userId },
    ];

    const mockTasks = [
      { id: 'task1', priority: 'high' },
      { id: 'task2', priority: 'medium' },
      { id: 'task3', priority: 'high' },
    ];

    mockCacheService.get.mockResolvedValue(null);
    mockProjectRepository.findAll.mockResolvedValue(mockProjects);
    mockTaskRepository.findAll.mockResolvedValue(mockTasks);

    const result = await getPriorityDistribution.execute(userId, 'user');

    expect(result).toBeDefined();
    expect(result.total).toBe(3);
    expect(mockCacheService.set).toHaveBeenCalled();
  });

  it('should return cached distribution if available', async () => {
    const cachedData = JSON.stringify({
      byPriority: [
        { priority: 'high', count: 5, percentage: 50 },
        { priority: 'medium', count: 3, percentage: 30 },
        { priority: 'low', count: 2, percentage: 20 },
        { priority: 'none', count: 0, percentage: 0 },
      ],
      total: 10,
    });

    mockCacheService.get.mockResolvedValue(cachedData);

    const result = await getPriorityDistribution.execute('user123', 'user');

    expect(result.total).toBe(10);
    expect(mockProjectRepository.findAll).not.toHaveBeenCalled();
  });

  it('should return empty distribution for user with no projects', async () => {
    mockCacheService.get.mockResolvedValue(null);
    mockProjectRepository.findAll.mockResolvedValue([]);

    const result = await getPriorityDistribution.execute('user123', 'user');

    expect(result.total).toBe(0);
    expect(result.byPriority).toHaveLength(4);
  });

  it('should get all projects for admin users', async () => {
    mockCacheService.get.mockResolvedValue(null);
    mockProjectRepository.findAll.mockResolvedValue([]);

    await getPriorityDistribution.execute('admin123', 'admin');

    expect(mockProjectRepository.findAll).toHaveBeenCalledWith({});
  });
});
